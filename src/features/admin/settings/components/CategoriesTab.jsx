import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, AlertCircle, LayoutGrid, Search, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { categoriesApi, getErrorMessage } from '../api/settings.api';
import ConfirmationModal from '../../../../shared/components/ConfirmationModal';
import Pagination from '../../../../shared/components/Pagination';
import ImagePlaceholder from '../../../../assets/images/categories/fruits.png';
import { showSuccess, showError } from '../../../../shared/utils/alert'

// --- New Recursive CategoryRow Component ---
const CategoryRow = ({ category, level = 0, onEdit, onDelete, parentCategories }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Check if children exist and the array is not empty
    const hasChildren = category.children && category.children.length > 0;
    const parent = parentCategories.find(p => p.id === category.parent_id);

    return (
        <>
            <tr className={`hover:bg-gray-50 ${level > 0 ? 'bg-gray-50/50' : ''}`}>
                <td className="px-4 py-2 text-sm font-medium text-gray-900" style={{ paddingLeft: `${1 + level * 2}rem` }}>
                    <div className="flex items-center gap-2">
                        {/* Expander Button */}
                        <span className="w-5 flex-shrink-0">
                            {hasChildren && (
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-1 rounded-full hover:bg-gray-200"
                                >
                                    <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                                </button>
                            )}
                        </span>

                        <img
                            src={category.image_url || ImagePlaceholder}
                            alt={category.name}
                            className="w-4 h-4 rounded-md object-cover flex-shrink-0"
                        />
                        <span className="truncate">{category.name}</span>
                    </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{category?.slug || '—'}</td>
                <td className="px-4 py-2 text-sm text-gray-700 max-w-sm truncate">{category.description || '—'}</td>
                <td className="px-4 py-2 text-sm text-right space-x-2">
                    <button onClick={() => onEdit(category)} className="p-2 text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(category.id)} className="p-2 text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </td>
            </tr>
            {/* Render children recursively if open */}
            {isOpen && hasChildren && (
                category.children.map(child => (
                    <CategoryRow
                        key={child.id}
                        category={child}
                        level={level + 1}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        parentCategories={parentCategories} // Pass down the full list for parent name lookups
                    />
                ))
            )}
        </>
    );
};
// --- End Recursive CategoryRow Component ---


const CategoriesTab = () => {
    const [categories, setCategories] = useState([]); // Holds only the paginated, top-level categories
    const [parentCategories, setParentCategories] = useState([]); // Holds ALL top-level categories for dropdowns
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Pagination & Filter State ---
    const [paginationMeta, setPaginationMeta] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        parent_id: '',
        page: 1,
        per_page: 12
    });
    // --- End Pagination State ---

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', parent_id: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Delete Confirmation Modal State
    const [confirmModalState, setConfirmModalState] = useState({
        isOpen: false,
        itemId: null
    });

    useEffect(() => {
        loadCategories();
    }, [filters]); // Re-fetch when any filter (including page) changes

    useEffect(() => {
        // Load all parent categories just once for the dropdowns
        loadParentCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch categories based on current filters (page, per_page, name, etc.)
            const res = await categoriesApi.getAll(filters);
            setCategories(res.data || []);
            setPaginationMeta(res.meta || null); // Set pagination data from API
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const loadParentCategories = async () => {
        try {
            // Fetch all top-level categories for the dropdowns.
            // We fetch with no filters and a large per_page limit.
            // A better API might have a specific endpoint for this.
            const res = await categoriesApi.getAll({ per_page: 200, parent_id: '' });
            // Filter client-side for true top-level parents
            setParentCategories(res.data.filter(c => c.parent_id === null) || []);
        } catch (err) {
            console.error("Failed to load parent categories:", err);
            // Non-fatal error, dropdown might just be incomplete
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1 // Reset to page 1 on any filter change
        }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    // Modal Handlers
    const openCreateModal = () => {
        setModalMode('create');
        setCurrentItem(null);
        setFormData({ name: '', description: '', parent_id: '' });
        setImageFile(null);
        setImagePreview(null);
        setFormErrors({});
        setError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setModalMode('edit');
        setCurrentItem(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            parent_id: category.parent_id || ''
        });
        setImageFile(null);
        setImagePreview(category.image_url || null);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // CRUD: Create/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors({});
        setError(null);

        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('description', formData.description || '');
        if (formData.parent_id) {
            fd.append('parent_id', formData.parent_id);
        }
        if (imageFile) {
            fd.append('image', imageFile);
        }

        try {
            if (modalMode === 'create') {
                await categoriesApi.create(fd);
                showSuccess('Category created successfully!', 2500);
            } else {
                await categoriesApi.update(currentItem.id, fd);
                showSuccess('Category updated successfully!', 2500);
            }
            loadCategories(); // Refresh list
            loadParentCategories(); // Refresh parent list in case a new top-level was added
            closeModal();
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            showError(errorMessage, 2500);
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
            await categoriesApi.delete(confirmModalState.itemId);
            showSuccess('Category deleted successfully!', 2500);
            loadCategories();
            loadParentCategories(); // Refresh parent list in case one was deleted
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
    if (loading && !isModalOpen) {
        return <div className="flex justify-center items-center p-10"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;
    }

    if (error && !isModalOpen) {
        return (
            <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-700">Failed to load data</h3>
                <p className="text-red-600 mt-2">{error}</p>
                <button onClick={loadCategories} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-2 md:p-6">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">All Categories</h2>
                    <p className="text-sm text-gray-600">Manage product categories and subcategories</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex w-full md:w-auto items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                >
                    <Plus className="w-5 h-5" />
                    Create Category
                </button>
            </div>

            {/* Filter Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="Search by name..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg"
                    />
                </div>
                <select
                    name="parent_id"
                    value={filters.parent_id}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                    <option value="">Filter by Parent Category</option>
                    {parentCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Content Table */}
            {categories.length === 0 && !loading ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {filters.name || filters.parent_id ? 'Try adjusting your filters.' : 'Get started by creating a new category.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Name</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Parent</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase">Description</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <CategoryRow
                                        key={category.id}
                                        category={category}
                                        onEdit={openEditModal}
                                        onDelete={openDeleteModal}
                                        parentCategories={parentCategories}
                                    />
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
                <div className="ml-0 lg:ml-64 fixed inset-0 bg-[rgba(0,0,0,.8)] flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {modalMode === 'create' ? 'Create New Category' : 'Edit Category'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text" id="name" name="name"
                                    value={formData.name} onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required
                                />
                                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description" name="description" rows="3"
                                    value={formData.description} onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">Parent Category</label>
                                <select
                                    id="parent_id" name="parent_id"
                                    value={formData.parent_id} onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
                                >
                                    <option value="">None (Main Category)</option>
                                    {parentCategories
                                        .filter(cat => cat.id !== currentItem?.id) // Can't be its own parent
                                        .map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))
                                    }
                                </select>
                                {formErrors.parent_id && <p className="text-red-500 text-xs mt-1">{formErrors.parent_id[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <div className="mt-1 flex items-center gap-4">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-lg file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-brand-50 file:text-brand-700
                                            hover:file:bg-brand-100"
                                    />
                                </div>
                                {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image[0]}</p>}
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
                title="Delete Category"
                message="Are you sure you want to delete this category? Deleting a parent category may affect subcategories. This action cannot be undone."
                type="danger"
                confirmText="Delete"
            />
        </div>
    );
};

export default CategoriesTab;