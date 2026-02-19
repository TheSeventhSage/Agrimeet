import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Loader2, AlertCircle, Briefcase } from 'lucide-react';
import { businessTypesApi, getErrorMessage } from '../api/settings.api';
import ConfirmationModal from '../../../../shared/components/ConfirmationModal';
import Pagination from '../../../../shared/components/Pagination';
import { showSuccess, showError } from '../../../../shared/utils/alert';

const PAGE_SIZE = 12; // Data sets per page

const BusinessTypesTab = () => {
    const [allBusinessTypes, setAllBusinessTypes] = useState([]); // Holds ALL types
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(allBusinessTypes.length / PAGE_SIZE);

    // Calculate paginated types
    const paginatedBusinessTypes = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        return allBusinessTypes.slice(start, end);
    }, [allBusinessTypes, currentPage]);

    // Create pagination prop object
    const paginationProps = {
        current_page: currentPage,
        last_page: totalPages,
        from: allBusinessTypes.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0,
        to: Math.min(currentPage * PAGE_SIZE, allBusinessTypes.length),
        total: allBusinessTypes.length
    };
    // --- End Pagination State ---

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [formErrors, setFormErrors] = useState({});

    // Delete Confirmation Modal State
    const [confirmModalState, setConfirmModalState] = useState({
        isOpen: false,
        itemId: null
    });

    useEffect(() => {
        loadBusinessTypes();
    }, []);

    const loadBusinessTypes = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await businessTypesApi.getAll();
            setAllBusinessTypes(res.data || []);
            setCurrentPage(1); // Reset to first page
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Modal Handlers
    const openCreateModal = () => {
        setModalMode('create');
        setCurrentItem(null);
        setFormData({ name: '', description: '' });
        setFormErrors({});
        setError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (type) => {
        setModalMode('edit');
        setCurrentItem(type);
        setFormData({ name: type.name, description: type.description || '' });
        setFormErrors({});
        setError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // CRUD: Create/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors({});
        setError(null);

        try {
            if (modalMode === 'create') {
                await businessTypesApi.create(formData);
                // toast.success('Business Type created successfully!');
                showSuccess('Business Type created successfully!', 2500);
            } else {
                await businessTypesApi.update(currentItem.id, formData);
                // toast.success('Business Type updated successfully!');
                showSuccess('Business Type updated successfully!', 2500);
            }
            loadBusinessTypes(); // Refresh list
            closeModal();
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            // toast.error(errorMessage);
            if (err.data?.errors) {
                setFormErrors(err.data.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- CRUD: Delete ---
    const openDeleteModal = (id) => {
        setConfirmModalState({ isOpen: true, itemId: id });
    };

    const closeDeleteModal = () => {
        setConfirmModalState({ isOpen: false, itemId: null });
    };

    const handleConfirmDelete = async () => {
        if (!confirmModalState.itemId) return;

        try {
            await businessTypesApi.delete(confirmModalState.itemId);
            showSuccess('Business type deleted successfully!', 2500);
            loadBusinessTypes(); // Refresh list
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            showError(errorMessage, 2500);
        } finally {
            closeDeleteModal();
        }
    };
    // --- End Delete Logic ---

    // Render Logic
    if (loading) {
        return <div className="flex justify-center items-center p-10"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;
    }

    if (error && !isModalOpen) {
        return (
            <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-700">Failed to load data</h3>
                <p className="text-red-600 mt-2">{error}</p>
                <button onClick={loadBusinessTypes} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3 md:p-6">
            <div className="flex flex-col gap-3 justify-between mb-6 md:flex-row md:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">All Business Types</h2>
                    <p className="text-sm text-gray-600">Manage seller business classifications</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white justify-center rounded-lg hover:bg-brand-700"
                >
                    <Plus className="w-5 h-5" />
                    Create Type
                </button>
            </div>

            {allBusinessTypes.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No business types found</h3>
                    <p className="text-sm text-gray-500 mt-1">Get started by creating a new type.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg mb-5">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Name</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Description</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedBusinessTypes.map((type) => (
                                    <tr key={type.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{type.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 max-w-md truncate">{type.description || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-right space-x-2">
                                            <button onClick={() => openEditModal(type)} className="p-2 text-blue-600 hover:text-blue-800">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openDeleteModal(type.id)} className="p-2 text-red-600 hover:text-red-800">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Pagination Component */}
                    <Pagination
                        pagination={paginationProps}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="ml-0 lg:ml-64 fixed inset-0 bg-[rgba(0,0,0,.8)] flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {modalMode === 'create' ? 'Create New Business Type' : 'Edit Business Type'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description[0]}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (modalMode === 'create' ? 'Create' : 'Update')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModalState.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Business Type"
                message="Are you sure you want to delete this business type? This action cannot be undone."
                type="danger"
                confirmText="Delete"
            />
        </div>
    );
};

export default BusinessTypesTab;