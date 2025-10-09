import React from 'react';
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';

const ProductList = ({ products }) => {
    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                    <div className="col-span-4">Product</div>
                    <div className="col-span-2">SKU</div>
                    <div className="col-span-1">Stock</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1">Actions</div>
                </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
                {products.map((product) => (
                    <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Product Info */}
                            <div className="col-span-4 flex items-center gap-3">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://via.placeholder.com/48x48/f3f4f6/6b7280?text=${encodeURIComponent(product.name.substring(0, 2))}`;
                                    }}
                                />
                                <div>
                                    <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                                    <p className="text-xs text-gray-500">Rating: {product.rating} ({product.reviews} reviews)</p>
                                </div>
                            </div>

                            {/* SKU */}
                            <div className="col-span-2">
                                <span className="text-sm text-gray-600">{product.sku}</span>
                            </div>

                            {/* Stock */}
                            <div className="col-span-1">
                                <span className={`text-sm font-medium ${product.stock > 20 ? 'text-green-600' :
                                        product.stock > 10 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    {product.stock}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="col-span-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">${product.discountedPrice}</span>
                                    {product.originalPrice > product.discountedPrice && (
                                        <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                                    )}
                                </div>
                            </div>

                            {/* Category */}
                            <div className="col-span-2">
                                <span className="text-sm text-gray-600">{product.category}</span>
                            </div>

                            {/* Actions */}
                            <div className="col-span-1">
                                <div className="flex items-center gap-1">
                                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-orange-600 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
