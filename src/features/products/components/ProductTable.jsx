import { useState } from 'react';
import { Edit, Trash2, Eye, Star, Package } from 'lucide-react';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';

const ProductTable = ({ product, onEdit, onDelete, onView, isDeleting = false }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    console.log(product)
    console.log(product.image)
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (onDelete) {
            onDelete(product);
        }
        setShowDeleteModal(false);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
            'inactive': { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' },
            'draft': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' }
        };

        const config = statusConfig[status?.toLowerCase()] || statusConfig['draft'];

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const StockBadge = ({ stock }) => {
        let config;
        if (stock > 50) {
            config = { bg: 'bg-green-100', text: 'text-green-800', label: 'In Stock' };
        } else if (stock > 10) {
            config = { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Low Stock' };
        } else if (stock > 0) {
            config = { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Very Low' };
        } else {
            config = { bg: 'bg-red-100', text: 'text-red-800', label: 'Out of Stock' };
        }

        return (
            <div className="flex">
                <span className="font-semibold text-gray-900 text-sm">{stock}</span>
                <span className={` px-1.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                    {config.label}
                </span>
            </div>
        );
    };

    // Handle image error by showing placeholder
    const handleImageError = (e) => {
        e.target.src = `data:image/svg+xml;base64,${btoa(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#f3f4f6"/>
                <path d="M20 10L16 14H12C10.9 14 10 14.9 10 16V26C10 27.1 10.9 28 12 28H28C29.1 28 30 27.1 30 26V16C30 14.9 29.1 14 28 14H24L20 10ZM20 25C17.24 25 15 22.76 15 20C15 17.24 17.24 15 20 15C22.76 15 25 17.24 25 20C25 22.76 22.76 25 20 25Z" fill="#9ca3af"/>
            </svg>
        `)}`;
    };

    return (
        <>
            <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                {/* Product Image and Name */}
                <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">

                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                            />

                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 text-sm truncate" title={product.name}>
                                {product.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate" title={product.description}>
                                {product.description || 'No description'}
                            </div>
                            {product.slug && (
                                <div className="text-xs text-gray-400">
                                    Slug: {product.slug}
                                </div>
                            )}
                        </div>
                    </div>
                </td>

                {/* Category */}
                <td className="px-3 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                    </span>
                </td>

                {/* Price */}
                <td className="px-3 py-3">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-gray-900 text-sm">
                                ${product.discountedPrice || product.price}
                            </span>
                            {product.unit && (
                                <span className="text-xs text-gray-500">
                                    /{product.unitSymbol || product.unit}
                                </span>
                            )}
                        </div>

                        {product.originalPrice && product.originalPrice > (product.discountedPrice || product.price) && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 line-through">
                                    ${product.originalPrice}
                                </span>
                                <span className="text-xs font-medium text-green-600">
                                    ({product.discount}% off)
                                </span>
                            </div>
                        )}
                    </div>
                </td>

                {/* Stock */}
                <td className="px-2 py-3 w-fit">
                    <StockBadge stock={product.stock} />
                </td>

                {/* Status */}
                <td className="px-3 py-3">
                    <StatusBadge status={product.status} />
                </td>

                {/* Actions */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onView && onView(product)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Product"
                        >
                            <Eye className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => onEdit && onEdit(product)}
                            className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product"
                        >
                            <Edit className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Product"
                        >
                            {isDeleting ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600"></div>
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </td>
            </tr>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Product"
                message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
};

export default ProductTable;