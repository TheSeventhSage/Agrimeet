import { useState } from 'react';
import { Heart, Star, Edit, Trash2 } from 'lucide-react';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
            />
        ));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x300/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`;
                    }}
                />
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-1">
                        {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews} Review)
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">${product.discountedPrice}</span>
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    <span className="text-sm font-medium text-brand-500">({product.discount}% Off)</span>
                </div>

                {/* Actions */}
                <div className="space-y-3">

                    {/* Edit and Delete Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit && onEdit(product)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

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
        </div>
    );
};

export default ProductCard;
