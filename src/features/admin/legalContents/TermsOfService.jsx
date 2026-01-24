import { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    FileText,
    Calendar,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { showError, showSuccess } from '../../../shared/utils/alert';
import { termsOfServiceApi } from './api/termsOfService.api';

const TermsOfService = () => {
    // State
    const [terms, setTerms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        content: '',
        is_published: false
    });

    // --- Data Fetching ---
    const fetchTerms = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await termsOfServiceApi.getAll({ page });
            // The Swagger says response.data contains the list, and meta fields are siblings
            // Adjusting based on standard Laravel resource responses or the specific structure provided
            setTerms(response.data || []);
            setPagination({
                current_page: response.current_page || 1,
                last_page: response.last_page || 1,
                total: response.total || 0
            });
        } catch (error) {
            console.error('Failed to fetch terms:', error);
            showError('Failed to load terms of service');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    // --- Handlers ---
    const handleOpenModal = (term = null) => {
        if (term) {
            setEditingId(term.id);
            setFormData({
                content: term.content,
                is_published: !!term.is_published // Ensure boolean
            });
        } else {
            setEditingId(null);
            setFormData({
                content: '',
                is_published: false
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ content: '', is_published: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content.trim()) {
            showError('Content is required');
            return;
        }

        try {
            setIsSubmitting(true);
            if (editingId) {
                await termsOfServiceApi.update(editingId, formData);
                showSuccess('Terms of service updated successfully');
            } else {
                await termsOfServiceApi.create(formData);
                showSuccess('Terms of service created successfully');
            }
            handleCloseModal();
            fetchTerms(pagination.current_page);
        } catch (error) {
            showError(error.message || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this version?')) return;

        try {
            setIsLoading(true);
            await termsOfServiceApi.delete(id);
            showSuccess('Terms of service deleted successfully');
            fetchTerms(pagination.current_page); // Refresh current page
        } catch (error) {
            showError(error.message || 'Failed to delete');
            setIsLoading(false); // Only stop loading on error, fetchTerms handles it otherwise
        }
    };

    const handleTogglePublish = async (term) => {
        try {
            // Optimistic UI update or wait for server? Let's wait for server to be safe
            if (term.is_published) {
                await termsOfServiceApi.unpublish(term.id);
                showSuccess('Unpublished successfully');
            } else {
                await termsOfServiceApi.publish(term.id);
                showSuccess('Published successfully');
            }
            fetchTerms(pagination.current_page);
        } catch (error) {
            showError(error.message || 'Failed to update status');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchTerms(newPage);
        }
    };

    // --- Render Helpers ---
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <DashboardLayout>
            <div className="p-2 lg:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
                        <p className="text-gray-500 mt-1">Manage legal terms and conditions versions</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Version</span>
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
                        </div>
                    ) : terms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No versions found</h3>
                            <p className="text-gray-500 mt-1">Get started by creating a new terms of service version.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="md:px-6 md:py-4 px-4 py-3 font-medium text-gray-600">ID</th>
                                            <th className="md:px-6 md:py-4 px-4 py-3 font-medium text-gray-600 w-1/2">Content Preview</th>
                                            <th className="md:px-6 md:py-4 px-4 py-3 font-medium text-gray-600">Status</th>
                                            <th className="md:px-6 md:py-4 px-4 py-3 font-medium text-gray-600">Created At</th>
                                            <th className="md:px-6 md:py-4 px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {terms.map((term) => (
                                            <tr key={term.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="md:px-6 md:py-4 px-4 py-3 text-gray-900 font-medium">#{term.id}</td>
                                                <td className="md:px-6 md:py-4 px-4 py-3 text-gray-600 max-w-sm">
                                                    <div className="line-clamp-1 max-w-[100%]">
                                                        {term.content}
                                                    </div>
                                                </td>
                                                <td className="md:px-6 md:py-4 px-4 py-3">
                                                    <button
                                                        onClick={() => handleTogglePublish(term)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all ${term.is_published
                                                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                            : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                                            }`}
                                                        title={term.is_published ? "Click to Unpublish" : "Click to Publish"}
                                                    >
                                                        {term.is_published ? (
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <AlertCircle className="w-3.5 h-3.5" />
                                                        )}
                                                        {term.is_published ? 'Published' : 'Draft'}
                                                    </button>
                                                </td>
                                                <td className="md:px-6 md:py-4 px-4 py-3 text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {formatDate(term.created_at)}
                                                    </div>
                                                </td>
                                                <td className="md:px-6 md:py-4 px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(term)}
                                                            className="p-2 text-gray-800 hover:text-brand-700 hover:bg-brand-300 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(term.id)}
                                                            className="p-2 text-gray-800 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.last_page > 1 && (
                                <div className="md:px-6 md:py-4 px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        Page {pagination.current_page} of {pagination.last_page}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                            disabled={pagination.current_page <= 1}
                                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                            disabled={pagination.current_page >= pagination.last_page}
                                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingId ? 'Edit Terms of Service' : 'Create New Version'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content
                                </label>
                                <textarea
                                    required
                                    rows={12}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm font-mono bg-gray-50 p-4"
                                    placeholder="Enter terms of service content here..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Supports plain text. Formatting will be preserved as entered.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                />
                                <label htmlFor="is_published" className="text-sm text-gray-700 select-none cursor-pointer">
                                    Publish immediately <i className='text-brand-700'>(Uncheck to unpiblish)</i>
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-70"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingId ? 'Update Version' : 'Create Version'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TermsOfService;