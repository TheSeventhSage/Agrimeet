import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, AlertCircle, Ticket } from 'lucide-react';
import { couponsApi, getErrorMessage } from '../api/settings.api';
import ConfirmationModal from '../../../../shared/components/ConfirmationModal';
import Pagination from '../../../../shared/components/Pagination';
import { showSuccess, showError } from '../../../../shared/utils/alert'

const PAGE_SIZE = 12;

const CouponsTab = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Pagination & Filter State ---
    const [paginationMeta, setPaginationMeta] = useState(null);
    const [filters, setFilters] = useState({
        page: 1,
        per_page: PAGE_SIZE,
    });
    // --- End Pagination State ---

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        valid_from: '',
        valid_to: '',
        usage_limit: '',
        is_active: true
    });
    const [formErrors, setFormErrors] = useState({});

    // Delete Confirmation Modal State
    const [confirmModalState, setConfirmModalState] = useState({
        isOpen: false,
        itemId: null
    });

    // useEffect(() => {
    //     loadCoupons();
    // }, [filters]); // Re-fetch when filters (including page) change

    const loadCoupons = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await couponsApi.getAll(filters);
            if (res.ok) showSuccess('Coupons gotten successfully!', 5500)
            setCoupons(res.data || []);
            setPaginationMeta(res.meta || null); // Set pagination data from API
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    // --- Modal Handlers ---
    const openCreateModal = () => {
        setModalMode('create');
        setCurrentItem(null);
        setFormData({
            code: '',
            type: 'percentage',
            value: '',
            valid_from: '',
            valid_to: '',
            usage_limit: '',
            is_active: true
        });
        setFormErrors({});
        setError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (coupon) => {
        setModalMode('edit');
        setCurrentItem(coupon);
        setFormData({
            code: coupon.code, // Code is not updatable, but we show it
            type: coupon.type,
            value: coupon.value,
            valid_from: coupon.valid_from?.split('T')[0] || '', // Format for date input
            valid_to: coupon.valid_to?.split('T')[0] || '', // Format for date input
            usage_limit: coupon.usage_limit || '',
            is_active: coupon.is_active
        });
        setFormErrors({});
        setError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- CRUD: Create/Update ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors({});
        setError(null);

        // Prepare data payload
        let payload = {
            type: formData.type,
            value: formData.value,
            valid_from: formData.valid_from,
            valid_to: formData.valid_to,
            usage_limit: formData.usage_limit,
            is_active: formData.is_active,
        };

        // Add code only on create
        if (modalMode === 'create') {
            payload.code = formData.code;
        }

        try {
            if (modalMode === 'create') {
                await couponsApi.create(payload);
                showSuccess('Coupon created successfully!', 5500)

            } else {
                await couponsApi.update(currentItem.id, payload);
                showSuccess('Coupon updated successfully!', 5500);
            }
            // loadCoupons(); // Refresh list
            closeModal();
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            showError(errorMessage, 2)
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
            await couponsApi.delete(confirmModalState.itemId);
            showSuccess('Coupon deleted successfully!', 5500);
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            showError(errorMessage, 2);
        } finally {
            closeDeleteModal();
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <div className="flex justify-center items-center p-10"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;
    }

    if (error && !isModalOpen) {
        return (
            <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-700">Failed to load data</h3>
                <p className="text-red-600 mt-2">{error}</p>
                <button onClick={loadCoupons} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
            {/* Header & Create Button */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">All Coupons</h2>
                    <p className="text-sm text-gray-600">Manage discount codes</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex w-full md:w-auto items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                >
                    <Plus className="w-5 h-5" />
                    Create Coupon
                </button>
            </div>

            {/* Content Table */}
            {coupons.length === 0 && !loading ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No coupons found</h3>
                    <p className="text-sm text-gray-500 mt-1">Get started by creating a new coupon.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Code</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Type</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Value</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Usage</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Expires On</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{coupon.code}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 capitalize">{coupon.type}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {coupon.type === 'percentage' ? `${coupon.value}%` : `₦${coupon.value}`}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${coupon.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {coupon.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {coupon.used_count || 0} / {coupon.usage_limit || '∞'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {new Date(coupon.valid_to).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right space-x-2">
                                            <button onClick={() => openEditModal(coupon)} className="p-2 text-blue-600 hover:text-blue-800">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openDeleteModal(coupon.id)} className="p-2 text-red-600 hover:text-red-800">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Backend-side Pagination */}
                    {paginationMeta && (
                        <Pagination
                            pagination={paginationMeta}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mt-10 mb-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {modalMode === 'create' ? 'Create New Coupon' : 'Edit Coupon'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700">Coupon Code</label>
                                <input
                                    type="text" id="code" name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                                    required
                                    disabled={modalMode === 'edit'} // Code not updatable
                                />
                                {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code[0]}</p>}
                                {modalMode === 'edit' && <p className="text-gray-500 text-xs mt-1">Coupon code cannot be changed.</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        id="type" name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed (₦)</option>
                                    </select>
                                    {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type[0]}</p>}
                                </div>
                                <div>
                                    <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
                                    <input
                                        type="number" id="value" name="value"
                                        value={formData.value}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                        required
                                        placeholder={formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 1000'}
                                    />
                                    {formErrors.value && <p className="text-red-500 text-xs mt-1">{formErrors.value[0]}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="valid_from" className="block text-sm font-medium text-gray-700">Valid From</label>
                                    <input
                                        type="date" id="valid_from" name="valid_from"
                                        value={formData.valid_from}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {formErrors.valid_from && <p className="text-red-500 text-xs mt-1">{formErrors.valid_from[0]}</p>}
                                </div>
                                <div>
                                    <label htmlFor="valid_to" className="block text-sm font-medium text-gray-700">Valid To</label>
                                    <input
                                        type="date" id="valid_to" name="valid_to"
                                        value={formData.valid_to}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {formErrors.valid_to && <p className="text-red-500 text-xs mt-1">{formErrors.valid_to[0]}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="usage_limit" className="block text-sm font-medium text-gray-700">Usage Limit</label>
                                <input
                                    type="number" id="usage_limit" name="usage_limit"
                                    value={formData.usage_limit}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    placeholder="Leave blank for unlimited"
                                />
                                {formErrors.usage_limit && <p className="text-red-500 text-xs mt-1">{formErrors.usage_limit[0]}</p>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="is_active" name="is_active"
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-brand-600 border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                    Activate this coupon
                                </label>
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
                title="Delete Coupon"
                message="Are you sure you want to delete this coupon? This action cannot be undone."
                type="danger"
                confirmText="Delete"
            />
        </div>
    );
};

export default CouponsTab;