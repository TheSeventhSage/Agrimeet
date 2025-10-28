import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    Star,
    MoreVertical,
    Package,
    MessageSquare,
    Trash2,
    Send,
    X,
    Filter,
    TrendingUp,
    Users,
    Award
} from 'lucide-react';
import { reviewsApi } from '../api/reviews.api';
import { showError, showSuccess } from '../../../shared/utils/alert';

const Reviews = () => {
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
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [filterRating, setFilterRating] = useState(null);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [pagination.current_page, filterRating]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewsApi.getReviews({
                page: pagination.current_page,
                rating: filterRating
            });
            console.log(response);

            setReviews(response.data);
            setStats({
                average_rating: response.average_rating,
                total_reviews: response.total_reviews,
                ratings_count: response.ratings_count
            });
            setPagination(response.pagination);
        } catch (error) {
            showError(error.message || 'Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleReplySubmit = async (reviewId) => {
        if (!replyText.trim()) {
            showError('Please enter a reply');
            return;
        }

        try {
            setSubmittingReply(true);
            const response = await reviewsApi.replyToReview(reviewId, {
                review_reply: replyText,
                review_status: 'approved'
            });

            // Update the review in the list
            setReviews(reviews.map(review =>
                review.id === reviewId ? response.data : review
            ));

            setReplyingTo(null);
            setReplyText('');
            showSuccess('Reply posted successfully');
        } catch (error) {
            showError(error.message || 'Failed to post reply');
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleDeleteReply = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this reply?')) {
            return;
        }

        try {
            await reviewsApi.deleteReply(reviewId);

            // Update the review in the list
            setReviews(reviews.map(review =>
                review.id === reviewId
                    ? { ...review, review_reply: null, reply_deleted: true }
                    : review
            ));

            showSuccess('Reply deleted successfully');
        } catch (error) {
            showError(error.message || 'Failed to delete reply');
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
            setPagination({ ...pagination, current_page: newPage });
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
                    <p className="text-gray-600 mt-2">Manage and respond to customer feedback</p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                                <p className="text-3xl font-bold text-gray-900">{Number(stats.average_rating).toFixed(1)}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    {renderStars(Math.round(Number(stats.average_rating)))}
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Star className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_reviews}</p>
                                <p className="text-sm text-green-600 mt-2">All products</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Response Rate</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.total_reviews > 0
                                        ? Math.round((reviews.filter(r => r.review_reply).length / reviews.length) * 100)
                                        : 0}%
                                </p>
                                <p className="text-sm text-gray-500 mt-2">Active engagement</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">5-Star Reviews</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.ratings_count[5] || 0}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {stats.total_reviews > 0 ? calculateRatingPercentage(5).toFixed(0) : 0}% of total
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Award className="w-6 h-6 text-purple-600" />
                            </div>
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

                {/* Filters */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Reviews</h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">
                                    {filterRating ? `${filterRating} Stars` : 'All Ratings'}
                                </span>
                            </button>

                            {showFilterMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setFilterRating(null);
                                                setShowFilterMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            All Ratings
                                        </button>
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => {
                                                    setFilterRating(rating);
                                                    setShowFilterMenu(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                            >
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                {rating} Stars
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                {loading ? (
                    <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
                        <div className="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 mt-4">Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-600">Your customer reviews will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                {/* Review Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                            {getInitials(review.user?.first_name || review.buyer_name)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {review.user?.first_name || review.buyer_name || 'Anonymous'}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-0.5">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Comment */}
                                <p className="text-gray-700 mb-3">{review.comment}</p>

                                {/* Product Info */}
                                <div className="flex items-center gap-2 text-sm mb-4 pb-4 border-b border-gray-200">
                                    <Package className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">
                                        {review.product?.name || 'Product'}
                                    </span>
                                </div>

                                {/* Seller Reply */}
                                {review.review_reply && !review.reply_deleted ? (
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                                                    <MessageSquare className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="font-semibold text-gray-900 text-sm">Your Reply</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteReply(review.id)}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                title="Delete reply"
                                            >
                                                <Trash2 className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                        <p className="text-gray-700 text-sm">{review.review_reply}</p>
                                    </div>
                                ) : review.reply_deleted ? (
                                    <div className="bg-red-50 rounded-lg p-4 mb-4">
                                        <p className="text-red-600 text-sm italic">Reply deleted</p>
                                    </div>
                                ) : replyingTo === review.id ? (
                                    <div className="border border-gray-300 rounded-lg p-4 mb-4">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write your reply..."
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-sm"
                                        />
                                        <div className="flex items-center gap-2 mt-3">
                                            <button
                                                onClick={() => handleReplySubmit(review.id)}
                                                disabled={submittingReply || !replyText.trim()}
                                                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                                            >
                                                {submittingReply ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Posting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        Post Reply
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(null);
                                                    setReplyText('');
                                                }}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setReplyingTo(review.id)}
                                        className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-2"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Reply to review
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="text-sm text-gray-600">
                            Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                            {pagination.total} reviews
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(pagination.last_page)].map((_, i) => {
                                    const page = i + 1;
                                    if (
                                        page === 1 ||
                                        page === pagination.last_page ||
                                        (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === pagination.current_page
                                                        ? 'bg-brand-500 text-white'
                                                        : 'border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (
                                        page === pagination.current_page - 2 ||
                                        page === pagination.current_page + 2
                                    ) {
                                        return <span key={page} className="px-2 text-gray-400">...</span>;
                                    }
                                    return null;
                                })}
                            </div>
                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Reviews;