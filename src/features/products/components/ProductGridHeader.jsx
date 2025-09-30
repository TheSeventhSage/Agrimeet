import { Plus } from 'lucide-react';

const ProductGridHeader = ({
    onAddProduct,
    totalProducts = 0,
    currentPage = 1,
    totalPages = 1
}) => {
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AGRICULTURAL PRODUCTS</h1>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Dashboard</span>
                    <span>›</span>
                    <span>Products</span>
                    <span>›</span>
                    <span>All Products</span>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={onAddProduct}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Product
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600">
                    Showing <strong>{totalProducts}</strong> agricultural products
                    {totalPages > 1 && (
                        <span className="ml-2">
                            (Page {currentPage} of {totalPages})
                        </span>
                    )}
                </p>
                {totalProducts > 0 && (
                    <div className="text-xs text-gray-500">
                        Total: {totalProducts} products
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGridHeader;