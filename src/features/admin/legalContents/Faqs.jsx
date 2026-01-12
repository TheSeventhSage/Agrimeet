import { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    HelpCircle,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Hash
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { showError, showSuccess } from '../../../shared/utils/alert';
import { faqApi } from './api/faq.api';

const Faqs = () => {
    // State
    const [faqs, setFaqs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        order: 0,
        is_published: false
    });

    // --- Data Fetching ---
    const fetchFaqs = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await faqApi.getAll({ page });
            // Sort locally by order for better UX, though backend should ideally sort
            const sortedData = (response.data || []).sort((a, b) => a.order - b.order);

            setFaqs(sortedData);
            setPagination({
                current_page: response.current_page || 1,
                last_page: response.last_page || 1,
                total: response.total || 0
            });
        } catch (error) {
            console.error('Failed to fetch FAQs:', error);
            showError('Failed to load FAQs');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    // --- Handlers ---
    const handleOpenModal = (faq = null) => {
        if (faq) {
            setEditingId(faq.id);
            setFormData({
                question: faq.question,
                answer: faq.answer,
                order: faq.order || 0,
                is_published: !!faq.is_published
            });
        } else {
            setEditingId(null);
            // Auto-increment order suggestion
            const maxOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.order)) : -1;
            setFormData({
                question: '',
                answer: '',
                order: maxOrder + 1,
                is_published: false
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ question: '', answer: '', order: 0, is_published: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.question.trim() || !formData.answer.trim()) {
            showError('Question and Answer are required');
            return;
        }

        try {
            setIsSubmitting(true);
            if (editingId) {
                await faqApi.update(editingId, formData);
                showSuccess('FAQ updated successfully');
            } else {
                await faqApi.create(formData);
                showSuccess('FAQ created successfully');
            }
            handleCloseModal();
            fetchFaqs(pagination.current_page);
        } catch (error) {
            showError(error.message || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            setIsLoading(true);
            await faqApi.delete(id);
            showSuccess('FAQ deleted successfully');
            fetchFaqs(pagination.current_page);
        } catch (error) {
            showError(error.message || 'Failed to delete');
            setIsLoading(false);
        }
    };

    const handleTogglePublish = async (faq) => {
        try {
            if (faq.is_published) {
                await faqApi.unpublish(faq.id);
                showSuccess('Unpublished successfully');
            } else {
                await faqApi.publish(faq.id);
                showSuccess('Published successfully');
            }
            fetchFaqs(pagination.current_page);
        } catch (error) {
            showError(error.message || 'Failed to update status');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchFaqs(newPage);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
                        <p className="text-gray-500 mt-1">Manage frequently asked questions and answers</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New FAQ</span>
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
                        </div>
                    ) : faqs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <HelpCircle className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No FAQs found</h3>
                            <p className="text-gray-500 mt-1">Get started by creating your first question.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-medium text-gray-600 w-16">
                                                <div className="flex items-center gap-1">
                                                    <Hash className="w-3 h-3" />
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 font-medium text-gray-600 w-1/3">Question</th>
                                            <th className="px-6 py-4 font-medium text-gray-600">Answer Preview</th>
                                            <th className="px-6 py-4 font-medium text-gray-600">Status</th>
                                            <th className="px-6 py-4 font-medium text-gray-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {faqs.map((faq) => (
                                            <tr key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-gray-500 font-mono">
                                                    {faq.order}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 font-medium align-top">
                                                    {faq.question}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 align-top">
                                                    <div className="line-clamp-2 max-w-md text-gray-500">
                                                        {faq.answer}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <button
                                                        onClick={() => handleTogglePublish(faq)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all ${faq.is_published
                                                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                            : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                                            }`}
                                                    >
                                                        {faq.is_published ? (
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <AlertCircle className="w-3.5 h-3.5" />
                                                        )}
                                                        {faq.is_published ? 'Published' : 'Draft'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right align-top">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(faq)}
                                                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(faq.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
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
                                {editingId ? 'Edit FAQ' : 'Create New FAQ'}
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
                                    Question
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={500}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm p-2.5 border"
                                    placeholder="e.g., How do I reset my password?"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Answer
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm p-3 border"
                                    placeholder="Enter the detailed answer here..."
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm p-2.5 border"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                                </div>
                                <div className="flex items-end pb-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="is_published"
                                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 h-5 w-5"
                                            checked={formData.is_published}
                                            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                        />
                                        <label htmlFor="is_published" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                            Publish immediately
                                        </label>
                                    </div>
                                </div>
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
                                    {editingId ? 'Update FAQ' : 'Create FAQ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Faqs;