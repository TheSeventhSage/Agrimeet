import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Loader2, AlertCircle, Scale } from 'lucide-react';
import { unitsApi, getErrorMessage } from '../api/settings.api';
import ConfirmationModal from '../../../../shared/components/ConfirmationModal';
import Pagination from '../../../../shared/components/Pagination';
import { showSuccess } from '../../../../shared/utils/alert';

const PAGE_SIZE = 12; // Data sets per page

const UnitsTab = () => {
    const [allUnits, setAllUnits] = useState([]); // Holds ALL units
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(allUnits.length / PAGE_SIZE);

    // Calculate paginated units
    const paginatedUnits = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        return allUnits.slice(start, end);
    }, [allUnits, currentPage]);

    // Create pagination prop object for the Pagination component
    const paginationProps = {
        current_page: currentPage,
        last_page: totalPages,
        from: allUnits.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0,
        to: Math.min(currentPage * PAGE_SIZE, allUnits.length),
        total: allUnits.length
    };
    // --- End Pagination State ---

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', symbol: '' });
    const [formErrors, setFormErrors] = useState({});

    // Delete Confirmation Modal State
    const [confirmModalState, setConfirmModalState] = useState({
        isOpen: false,
        itemId: null
    });

    // Load data on mount
    useEffect(() => {
        loadUnits();
    }, []);

    const loadUnits = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await unitsApi.getAll();
            setAllUnits(res.data || []);
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
        setFormData({ name: '', symbol: '' });
        setFormErrors({});
        setError(null); // Clear main error
        setIsModalOpen(true);
    };

    const openEditModal = (unit) => {
        setModalMode('edit');
        setCurrentItem(unit);
        setFormData({ _method: 'PUT', name: unit.name, symbol: unit.symbol });
        setFormErrors({});
        setError(null); // Clear main error
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null); // Clear modal-specific errors
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
                await unitsApi.create(formData);
                showSuccess('Unit created successfully!');
            } else {
                await unitsApi.update(currentItem.id, formData);
                showSuccess('Unit updated successfully!');
            }
            loadUnits(); // Refresh list
            closeModal();
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            showError(errorMessage);
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
            await unitsApi.delete(confirmModalState.itemId);
            showSuccess('Unit deleted successfully.');
            loadUnits(); // Refresh list
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage); // Show error on main page
            // toast.error(errorMessage);
        } finally {
            closeDeleteModal();
        }
    };
    // --- End Delete Logic ---

    // Render Logic
    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    if (error && !isModalOpen) { // Don't show main error if modal is open
        return (
            <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-700">Failed to load data</h3>
                <p className="text-red-600 mt-2">{error}</p>
                <button
                    onClick={loadUnits}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 md:p-6">
            <div className="flex flex-col gap-3 justify-between mb-6 md:flex-row md:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">All Units</h2>
                    <p className="text-sm text-gray-600">Manage product measurement units</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                >
                    <Plus className="w-5 h-5" />
                    Create Unit
                </button>
            </div>

            {allUnits.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No units found</h3>
                    <p className="text-sm text-gray-500 mt-1">Get started by creating a new unit.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Name</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Symbol</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedUnits.map((unit) => (
                                    <tr key={unit.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{unit.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{unit.symbol}</td>
                                        <td className="px-4 py-3 text-sm text-right space-x-2">
                                            <button onClick={() => openEditModal(unit)} className="p-2 text-blue-600 hover:text-blue-800">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openDeleteModal(unit.id)} className="p-2 text-red-600 hover:text-red-800">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        pagination={paginationProps}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {/* Modal (using simple conditional rendering) */}
            {isModalOpen && (
                <div className="ml-0 lg:ml-64 fixed inset-0 bg-[rgba(0,0,0,.8)] flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {modalMode === 'create' ? 'Create New Unit' : 'Edit Unit'}
                        </h3>
                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                                {error}
                            </div>
                        )}
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
                                <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">Symbol</label>
                                <input
                                    type="text"
                                    id="symbol"
                                    name="symbol"
                                    value={formData.symbol}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                {formErrors.symbol && <p className="text-red-500 text-xs mt-1">{formErrors.symbol[0]}</p>}
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
                title="Delete Unit"
                message="Are you sure you want to delete this unit? This action cannot be undone."
                type="danger"
                confirmText="Delete"
            />
        </div>
    );
};

export default UnitsTab;