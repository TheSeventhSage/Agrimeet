import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Eye, Edit, Package } from 'lucide-react';

const ProductsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddProduct = () => {
        window.location.href = '/products/add';
        setIsOpen(false);
    };

    const handleViewProducts = () => {
        window.location.href = '/products';
        setIsOpen(false);
    };

    const handleEditProduct = () => {
        // For now, navigate to a sample edit page - in real app, this would need product ID
        window.location.href = '/products/edit/1';
        setIsOpen(false);
    };

    const handleProductDetails = () => {
        // TODO: Navigate to product details page
        console.log('Product details clicked');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Products Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors bg-orange-500 text-white"
            >
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5">
                        <Package className="w-full h-full" />
                    </div>
                    <span className="text-sm">Products</span>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                        <button
                            onClick={handleViewProducts}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            View Products
                        </button>

                        <button
                            onClick={handleAddProduct}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </button>

                        <button
                            onClick={handleProductDetails}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Product Details
                        </button>

                        <button
                            onClick={handleEditProduct}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Product
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsDropdown;