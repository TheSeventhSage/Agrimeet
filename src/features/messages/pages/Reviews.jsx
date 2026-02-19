import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    Star,
    MessageSquare,
    Trash2,
    Filter,
    Award,
    Search,
    Package,
    Edit2,
} from 'lucide-react';
import { reviewsApi } from '../api/reviews.api';

import { showError, showSuccess } from '../../../shared/utils/alert';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';

const Reviews = () => {
    // --- State Management ---
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({
        average_rating: 0,
        total_reviews: 0,
        ratings_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [statusFilter, setStatusFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');

    // UI State
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [replyToDelete, setReplyToDelete] = useState(null);
    const [isDeletingReply, setIsDeletingReply] = useState(false);
    const [replyStatus, setReplyStatus] = useState('');
    const [statusLoading, setStatusLoading] = useState(null);
    const [isDeleteReviewModalOpen, setIsDeleteReviewModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [isDeletingReview, setIsDeletingReview] = useState(false);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editReplyText, setEditReplyText] = useState('');
    const [editReplyStatus, setEditReplyStatus] = useState('');
    const [submittingEdit, setSubmittingEdit] = useState(false);


    // --- Data Fetching ---
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReviews();
        }, 500);

        return () => clearTimeout(timer);
    }, [pagination.current_page, searchQuery, dateRange, statusFilter, productFilter]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            let response;

            // 1. Select the correct API call
            const isSearching = searchQuery.trim() !== '' || (dateRange.start && dateRange.end);
            const isFiltering = statusFilter !== '' || productFilter !== '';

            if (isSearching) {
                response = await reviewsApi.searchReviews({
                    search_global: searchQuery,
                    start_date: dateRange.start,
                    end_date: dateRange.end,
                    page: pagination.current_page
                });
            } else if (isFiltering) {
                response = await reviewsApi.filterReviews({
                    review_status: statusFilter,
                    product_name: productFilter,
                    page: pagination.current_page
                });
            } else {
                response = await reviewsApi.getReviews(pagination.current_page);
            }

            // 2. Correctly Extract Data (Fixing previous error)
            // The API returns { data: [...], ... } directly. 
            // We access response.data for the array.
            const reviewsList = response.data || [];
            setReviews(reviewsList);

            // 3. Extract Pagination
            // Search/Filter uses 'pagination' key, standard often uses 'meta' or root props
            const meta = response.pagination || response.meta || {};
            setPagination({
                current_page: meta.current_page || response.current_page || 1,
                last_page: meta.last_page || response.last_page || 1,
                per_page: meta.per_page || response.per_page || 10,
                total: meta.total || response.total || 0
            });

            // 4. Extract Stats (if available in response)
            if (response.average_rating !== undefined) {
                setStats({
                    average_rating: response.average_rating,
                    total_reviews: response.total_reviews,
                    ratings_count: response.ratings_count || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                });
            }

        } catch (error) {
            if (error.message === "No reviews found for this seller") {
                setReviews([]);
                setPagination(prev => ({ ...prev, total: 0, last_page: 1 }));
            } else {
                console.error('Fetch reviews error:', error);
                showError(error.message || 'Failed to fetch reviews');
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers ---
    const handleReplySubmit = async (reviewId) => {
        if (!replyText.trim()) return;
        setSubmittingReply(true);
        try {
            await reviewsApi.replyToReview(reviewId, replyText, replyStatus || undefined);
            showSuccess('Reply posted successfully');
            setReplyingTo(null);
            setReplyText('');
            setReplyStatus('');
            fetchReviews(pagination.current_page);
        } catch (error) {
            showError(error.message || 'Failed to post reply');
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleEditReplySubmit = async (reviewId) => {
        if (!editReplyText.trim()) return;
        setSubmittingEdit(true);
        try {
            await reviewsApi.editReply(reviewId, editReplyText, editReplyStatus || undefined);
            showSuccess('Reply updated successfully');
            setEditingReplyId(null);
            setEditReplyText('');
            setEditReplyStatus('');
            fetchReviews(pagination.current_page);
        } catch (error) {
            showError(error.message || 'Failed to update reply');
        } finally {
            setSubmittingEdit(false);
        }
    };

    const confirmDeleteReview = (reviewId) => {
        setReviewToDelete(reviewId);
        setIsDeleteReviewModalOpen(true);
    };

    const handleDeleteReview = async () => {
        if (!reviewToDelete) return;
        setIsDeletingReview(true);
        try {
            await reviewsApi.deleteReview(reviewToDelete);
            showSuccess('Review deleted successfully');
            fetchReviews(pagination.current_page);
        } catch (error) {
            showError(error.message || 'Failed to delete review');
        } finally {
            setIsDeletingReview(false);
            setIsDeleteReviewModalOpen(false);
            setReviewToDelete(null);
        }
    };

    const handleStatusUpdate = async (reviewId, status) => {
        if (status !== 'pending') return;

        setStatusLoading(reviewId);
        try {
            await reviewsApi.markAsPending(reviewId);
            showSuccess(`Review marked as pending`);
            fetchReviews(pagination.current_page);
        } catch (error) {
            showError(error.message || `Failed to update status`);
        } finally {
            setStatusLoading(null);
        }
    };

    const confirmDeleteReply = (reviewId) => {
        setReplyToDelete(reviewId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteReply = async () => {
        if (!replyToDelete) return;

        setIsDeletingReply(true);
        try {
            await reviewsApi.deleteReply(replyToDelete);
            showSuccess('Reply deleted');
            fetchReviews();
        } catch (error) {
            showError('Failed to delete reply');
        } finally {
            setIsDeletingReply(false);
            setIsDeleteModalOpen(false);
            setReplyToDelete(null);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    const calculateRatingPercentage = (rating) => {
        if (stats.total_reviews === 0) return 0;
        return ((stats.ratings_count[rating] || 0) / stats.total_reviews) * 100;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setPagination(prev => ({ ...prev, current_page: newPage }));
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
                        <p className="text-gray-500">Manage your product reviews and customer feedback</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Average Rating</p>
                            <h3 className="text-2xl font-bold text-gray-900">{parseFloat(stats.average_rating || 0).toFixed(1)}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Reviews</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.total_reviews}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">5 Star Reviews</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.ratings_count?.[5] || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-16">
                                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${calculateRatingPercentage(rating)}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-16 text-right">
                                    {stats.ratings_count[rating] || 0} ({calculateRatingPercentage(rating).toFixed(0)}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Global Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search comments, products, buyers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                            />
                        </div>

                        {/* Date Filters */}
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Start Date"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="End Date"
                            />
                        </div>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`p-2 border rounded-lg hover:bg-gray-50 ${showFilterMenu ? 'bg-gray-100 border-gray-400' : 'border-gray-300'}`}
                        >
                            <Filter className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Extended Filters */}
                    {showFilterMenu && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="Filter by product..."
                                    value={productFilter}
                                    onChange={(e) => setProductFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-12 bg-white rounded-xl border border-gray-200">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search terms</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <span className="font-semibold text-gray-600">
                                                {review.user?.first_name?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {review.user?.first_name} {review.user?.last_name}
                                            </h4>
                                            <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${review.review_status === 'approved' ? 'bg-green-100 text-green-700' :
                                            review.review_status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {review.review_status}
                                        </span>

                                        {/* Status Quick Actions & Delete */}
                                        <div className="flex items-center gap-2 ml-2 border-l pl-2 border-gray-200">
                                            {review.review_status !== 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(review.id, 'pending')}
                                                    disabled={statusLoading === review.id}
                                                    className="text-xs font-medium text-yellow-600 hover:text-yellow-800 disabled:opacity-50"
                                                >
                                                    Mark Pending
                                                </button>
                                            )}
                                            <button
                                                onClick={() => confirmDeleteReview(review.id)}
                                                className="text-gray-400 hover:text-red-600 ml-1 transition-colors"
                                                title="Delete Review"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Star Rating Display */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    {/* UPDATED: Changed from review.comment to review.review_comment */}
                                    <p className="text-gray-600 mb-2">{review.review_comment}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                        <Package className="w-4 h-4" />
                                        <span>Product: <strong>{review.product?.name}</strong></span>
                                    </div>
                                </div>

                                {/* Reply Section */}
                                {/* UPDATED: Changed from review.reply to review.review_reply */}
                                {review.review_reply ? (
                                    editingReplyId === review.id ? (
                                        <div className="bg-white p-4 rounded-lg ml-8 relative border border-gray-200 shadow-sm">
                                            <div className="mb-3">
                                                <label className="text-xs font-medium text-gray-700 block mb-1">Update Status (Optional)</label>
                                                <select
                                                    value={editReplyStatus}
                                                    onChange={(e) => setEditReplyStatus(e.target.value)}
                                                    className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 w-full sm:w-auto outline-none bg-white"
                                                >
                                                    <option value="">Leave status unchanged</option>
                                                    <option value="approved">Approve Review</option>
                                                    <option value="rejected">Reject Review</option>
                                                </select>
                                            </div>
                                            <textarea
                                                value={editReplyText}
                                                onChange={(e) => setEditReplyText(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 mb-3 text-sm bg-gray-50 outline-none"
                                                rows="3"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditReplySubmit(review.id)}
                                                    disabled={submittingEdit}
                                                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
                                                >
                                                    {submittingEdit ? 'Updating...' : 'Update'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingReplyId(null);
                                                        setEditReplyText('');
                                                        setEditReplyStatus('');
                                                    }}
                                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-brand-50 p-4 rounded-lg ml-8 relative group">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-bold text-brand-800 mb-1">Your Reply</p>
                                                    <p className="text-sm text-brand-700 whitespace-pre-wrap">{review.review_reply}</p>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-.8 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setEditingReplyId(review.id);
                                                            setEditReplyText(review.review_reply);
                                                        }}
                                                        className="text-blue-400 hover:text-blue-600 transition-colors"
                                                        title="Edit Reply"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDeleteReply(review.id)}
                                                        className="text-red-400 hover:text-red-600 transition-colors"
                                                        title="Delete Reply"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ) : replyingTo === review.id ? (
                                    <div className="mt-4 ml-8 animate-in fade-in slide-in-from-top-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="mb-3">
                                            <label className="text-xs font-medium text-gray-700 block mb-1">Update Status (Optional)</label>
                                            <select
                                                value={replyStatus}
                                                onChange={(e) => setReplyStatus(e.target.value)}
                                                className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 w-full sm:w-auto outline-none bg-white"
                                            >
                                                <option value="">Leave status unchanged</option>
                                                <option value="approved">Approve Review</option>
                                                <option value="rejected">Reject Review</option>
                                            </select>
                                        </div>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write your reply..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 mb-3 text-sm bg-white"
                                            rows="3"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReplySubmit(review.id)}
                                                disabled={submittingReply}
                                                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
                                            >
                                                {submittingReply ? 'Posting...' : 'Post Reply'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(null);
                                                    setReplyText('');
                                                    setReplyStatus('');
                                                }}
                                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setReplyingTo(review.id)}
                                        className="text-sm text-brand-600 font-medium hover:underline ml-1"
                                    >
                                        Reply to review
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {reviews.length > 0 && (
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-600">
                            Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} results
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete reply to a review confirmation modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                isLoading={isDeletingReply}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setReplyToDelete(null);
                }}
                onConfirm={handleDeleteReply}
                title="Delete Reply"
                message="Are you sure you want to delete this reply? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            {/* Delete review confirmation modal */}
            <ConfirmationModal
                isOpen={isDeleteReviewModalOpen}
                isLoading={isDeletingReview}
                onClose={() => {
                    setIsDeleteReviewModalOpen(false);
                    setReviewToDelete(null);
                }}
                onConfirm={handleDeleteReview}
                title="Delete Review"
                message="Are you sure you want to permanently delete this entire review? This action cannot be undone."
                confirmText="Delete Review"
                cancelText="Cancel"
                type="danger"
            />
        </DashboardLayout>
    );
};

export default Reviews;