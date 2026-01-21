import { Plus, Search } from 'lucide-react';

const ProductGridHeader = ({
    onAddProduct,
    totalProducts = 0,
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange
}) => {
    return (
        <div className="mb-6">
            {/* Top Row: Title and Add Button */}
            <div className="flex items-start lg:items-center justify-between lg:flex-row flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">AGRICULTURAL PRODUCTS</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Dashboard</span>
                        <span>›</span>
                        <span>Products</span>
                        <span>›</span>
                        <span>All Products</span>
                    </div>
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

            {/* Bottom Row: Filters and Count */}
            <div className="flex flex-col justify-between mt-6 gap-4 md:items-center md:flex-row">
                <div className="flex items-center gap-4 flex-1">
                    {/* Search Input */}
                    <div className="relative w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="Search by product name..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {/* Status Filter */}
                    <div className="relative w-full">
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <p className="text-sm text-gray-600 flex-shrink-0">
                    Showing <strong>{totalProducts}</strong> total products
                </p>
            </div>
        </div>
    );
};

export default ProductGridHeader;