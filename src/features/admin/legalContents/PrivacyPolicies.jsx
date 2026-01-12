import { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    FileText,
    Calendar,
    Loader2
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { showError, showSuccess } from '../../../shared/utils/alert';
import { privacyPolicyApi } from './api/privacyPolicy.api'; // Adjust import path

const PrivacyPolicies = () => {
    // State
    const [policies, setPolicies] = useState([]);
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
    const fetchPolicies = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await privacyPolicyApi.getAll({ page, per_page: 10 });
            setPolicies(response.data || []);
            setPagination({
                current_page: response.current_page || 1,
                last_page: response.last_page || 1,
                total: response.total || 0
            });
        } catch (error) {
            console.error('Fetch error:', error);
            showError('Failed to load privacy policies.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    // --- Handlers ---

    const handleOpenModal = (policy = null) => {
        if (policy) {
            setEditingId(policy.id);
            setFormData({
                content: policy.content,
                is_published: !!policy.is_published
            });
        } else {
            setEditingId(null);
            setFormData({ content: '', is_published: false });
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
            showError('Policy content is required.');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingId) {
                await privacyPolicyApi.update(editingId, formData);
                showSuccess('Policy updated successfully.');
            } else {
                await privacyPolicyApi.create(formData);
                showSuccess('Policy created successfully.');
            }
            handleCloseModal();
            fetchPolicies(pagination.current_page);
        } catch (error) {
            console.error('Submit error:', error);
            showError(error.message || 'Operation failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this policy?')) return;

        try {
            await privacyPolicyApi.delete(id);
            showSuccess('Policy deleted successfully.');
            fetchPolicies(pagination.current_page);
        } catch (error) {
            showError('Failed to delete policy.');
        }
    };

    const handleTogglePublish = async (policy) => {
        const action = policy.is_published ? 'unpublish' : 'publish';
        if (!window.confirm(`Are you sure you want to ${action} this policy?`)) return;

        try {
            if (policy.is_published) {
                await privacyPolicyApi.unpublish(policy.id);
            } else {
                await privacyPolicyApi.publish(policy.id);
            }
            showSuccess(`Policy ${action}ed successfully.`);
            fetchPolicies(pagination.current_page);
        } catch (error) {
            showError(`Failed to ${action} policy.`);
        }
    };

    // --- Helper for Date Formatting ---
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <DashboardLayout>
            <div className="p-4 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Privacy Policies</h1>
                        <p className="text-gray-600 mt-1">Create and manage your application's privacy policies.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Policy
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-2" />
                            <p className="text-gray-500">Loading policies...</p>
                        </div>
                    ) : policies.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No Policies Found</h3>
                            <p className="text-gray-500 mt-1">Get started by creating your first privacy policy.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">ID</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Content Preview</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Last Updated</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {policies.map((policy) => (
                                        <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-500">#{policy.id}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-900 line-clamp-2 max-w-md">
                                                    {policy.content}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleTogglePublish(policy)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors
                                                        ${policy.is_published
                                                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                            : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                                        }`}
                                                >
                                                    {policy.is_published ? (
                                                        <><CheckCircle className="w-3.5 h-3.5" /> Published</>
                                                    ) : (
                                                        <><XCircle className="w-3.5 h-3.5" /> Draft</>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {formatDate(policy.updated_at || policy.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(policy)}
                                                        className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(policy.id)}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    )}

                    {/* Simple Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Page {pagination.current_page} of {pagination.last_page}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    disabled={pagination.current_page === 1}
                                    onClick={() => fetchPolicies(pagination.current_page - 1)}
                                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={pagination.current_page === pagination.last_page}
                                    onClick={() => fetchPolicies(pagination.current_page + 1)}
                                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Create/Edit Modal --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingId ? 'Edit Privacy Policy' : 'Create Privacy Policy'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Policy Content
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    rows={10}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-y"
                                    placeholder="Enter the details of the privacy policy here..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Supports plain text. For rich text, please integrate a WYSIWYG editor.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                    className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300"
                                />
                                <label htmlFor="is_published" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Publish immediately
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
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
                                    {editingId ? 'Update Policy' : 'Create Policy'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default PrivacyPolicies;