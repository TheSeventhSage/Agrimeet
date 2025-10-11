import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Package } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { Loading } from '../../../shared/components/Loader';
import { ConfirmationModal } from '../../../shared/components';
import { showSuccess, showError } from '../../../shared/utils/alert';
import { getVariants, deleteVariant } from '../api/productsApi';

const VariantsList = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [variants, setVariants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleting, setDeleting] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState(null);

    useEffect(() => {
        if (!productId) {
            showError('Invalid product ID');
            navigate('/products');
            return;
        }

        loadVariants();
    }, [productId, navigate]);

    const loadVariants = async () => {
        try {
            setIsLoading(true);
            const response = await getVariants(productId);
            setVariants(response.data || response || []);
        } catch (error) {
            console.error('Error loading variants:', error);
            showError('Failed to load variants. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddVariant = () => {
        navigate(`/products/${productId}/variants/add`);
    };

    const handleEditVariant = (variantId) => {
        navigate(`/products/${productId}/variants/${variantId}/edit`);
    };

    const handleDeleteClick = (variant) => {
        setVariantToDelete(variant);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!variantToDelete) return;

        try {
            setDeleting(prev => ({ ...prev, [variantToDelete.id]: true }));
            await deleteVariant(productId, variantToDelete.id);
            showSuccess('Variant deleted successfully!');
            await loadVariants();
        } catch (error) {
            console.error('Error deleting variant:', error);
            showError('Failed to delete variant. Please try again.');
        } finally {
            setDeleting(prev => ({ ...prev, [variantToDelete.id]: false }));
            setShowDeleteModal(false);
            setVariantToDelete(null);
        }
    };

    const goBack = () => {
        navigate('/products');
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Loading />
                            <p className="text-gray-600">Loading variants...</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={goBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">Product Variants</h1>
                            <p className="text-gray-600">Manage variants for Product ID: {productId}</p>
                        </div>
                        <button
                            onClick={handleAddVariant}
                            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Variant
                        </button>
                    </div>
                </div>

                {/* Variants List */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    {variants.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No variants yet</h3>
                            <p className="text-gray-500 mb-6">Create your first variant for this product</p>
                            <button
                                onClick={handleAddVariant}
                                className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                            >
                                Add First Variant
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                                    <div className="col-span-3">Name</div>
                                    <div className="col-span-2">SKU</div>
                                    <div className="col-span-2">Price</div>
                                    <div className="col-span-2">Stock</div>
                                    <div className="col-span-2">Attributes</div>
                                    <div className="col-span-1">Actions</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {variants.map((variant) => (
                                    <div key={variant.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            {/* Name */}
                                            <div className="col-span-3">
                                                <p className="font-medium text-gray-900 text-sm">{variant.name}</p>
                                            </div>

                                            {/* SKU */}
                                            <div className="col-span-2">
                                                <span className="text-sm text-gray-600">{variant.sku}</span>
                                            </div>

                                            {/* Price */}
                                            <div className="col-span-2">
                                                <span className="text-sm font-medium text-gray-900">${variant.price}</span>
                                            </div>

                                            {/* Stock */}
                                            <div className="col-span-2">
                                                <span className={`text-sm font-medium ${variant.stock_quantity > 50 ? 'text-green-600' :
                                                    variant.stock_quantity > 10 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {variant.stock_quantity}
                                                </span>
                                            </div>

                                            {/* Attributes */}
                                            <div className="col-span-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {variant.attributes && variant.attributes.length > 0 ? (
                                                        variant.attributes.map((attr, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                            >
                                                                {attr.value}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No attributes</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="col-span-1">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleEditVariant(variant.id)}
                                                        className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit Variant"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteClick(variant)}
                                                        disabled={deleting[variant.id]}
                                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete Variant"
                                                    >
                                                        {deleting[variant.id] ? (
                                                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600"></div>
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setVariantToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Variant"
                    message={`Are you sure you want to delete "${variantToDelete?.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    type="danger"
                />
            </div>
        </DashboardLayout>
    );
};

export default VariantsList;