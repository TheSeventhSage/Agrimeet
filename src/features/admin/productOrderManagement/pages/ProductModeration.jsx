import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import ProductDetails from '../components/ProductDetails';
import {
    Package,
    Search,
    Filter,
    Eye,
    Tag,
    User,
    ChevronLeft,
    ChevronRight,
    X,
    ImageIcon,
    Store,
    Grid
} from 'lucide-react';
import adminProductService from '../api/adminProductService';
import { showError } from '../../../../shared/utils/alert';
import { Button } from '../../../../shared/components';

const ProductModeration = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        category_id: '',
        page: 1
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 20
    });

    useEffect(() => {
        loadDashboardData();
    }, [filters]);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);

            const [productsResponse, categoriesResponse] = await Promise.all([
                adminProductService.getProducts(filters),
                adminProductService.getCategories()
            ]);

            // --- Handle Products Data ---
            // The API response structure matches: { data: [...], links: {...}, meta: {...} }
            const responseData = productsResponse.data || productsResponse;
            setProducts(responseData.data || []);

            const meta = responseData.meta || {};
            setPagination({
                current_page: meta.current_page || 1,
                last_page: meta.last_page || 1,
                total: meta.total || 0,
                per_page: meta.per_page || 20
            });

            // --- Handle Categories Data ---
            let categoryList = [];
            if (Array.isArray(categoriesResponse)) {
                categoryList = categoriesResponse;
            } else if (categoriesResponse?.data && Array.isArray(categoriesResponse.data)) {
                categoryList = categoriesResponse.data;
            } else if (categoriesResponse?.data?.data && Array.isArray(categoriesResponse.data.data)) {
                categoryList = categoriesResponse.data.data;
            } else {
                categoryList = [];
            }
            setCategories(categoryList);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showError('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewProduct = async (product) => {
        try {
            const response = await adminProductService.getProduct(product.id);
            // Handle potentially different structure for single product view vs list view
            setSelectedProduct(response.data?.data || response.data || product);
            setShowProductModal(true);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setSelectedProduct(product);
            setShowProductModal(true);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            status: '',
            category_id: '',
            page: 1
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            case 'inactive': return 'bg-yellow-100 text-yellow-700';
            case 'archived': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-50 text-blue-700';
        }
    };

    // Helper to safely display category (string or object)
    const renderCategory = (cat) => {
        if (!cat) return 'Uncategorized';
        return typeof cat === 'object' ? cat.name : cat;
    };

    // Helper to safely display unit (object based on your JSON)
    const renderUnit = (unit) => {
        if (!unit) return '';
        // JSON shows unit is an object: { id, name, symbol... }
        return typeof unit === 'object' ? (unit.symbol || unit.name) : unit;
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-600">Oversee and view seller products</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-sm text-gray-500">Total Products: </span>
                    <span className="font-semibold text-gray-900">{pagination.total}</span>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                        />
                    </div>

                    <div className="flex items-center gap-2 min-w-[200px]">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="inactive">Inactive</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 min-w-[200px]">
                        <Grid className="w-5 h-5 text-gray-400" />
                        <select
                            value={filters.category_id}
                            onChange={(e) => handleFilterChange('category_id', e.target.value)}
                            className="w-full border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                        >
                            <option value="">All Categories</option>
                            {Array.isArray(categories) && categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button onClick={handleClearFilters}>Clear Filters</Button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Seller</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            src={
                                                                // Handle case where image is object string or object
                                                                typeof product.images[0] === 'string'
                                                                    ? product.images[0]
                                                                    : (product.images[0]?.url || '')
                                                            }
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://placehold.co/400?text=No+Image';
                                                            }}
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {renderCategory(product.category)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-900">{product.seller?.store_name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                ₦{parseFloat(product.base_price || 0).toLocaleString()}
                                            </p>
                                            {/* Fix: safely render unit symbol */}
                                            {product.unit && (
                                                <p className="text-xs text-gray-500">
                                                    per {renderUnit(product.unit)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm ${product.stock_quantity < (product.low_stock_threshold || 10) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                                {product.stock_quantity || 0} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(product.status)}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewProduct(product)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && products.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Showing page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Details Modal - Now using the dedicated component */}
            {showProductModal && selectedProduct && (
                <ProductDetails
                    product={selectedProduct}
                    onClose={() => setShowProductModal(false)}
                />
            )}
        </DashboardLayout>
    );
};

export default ProductModeration;