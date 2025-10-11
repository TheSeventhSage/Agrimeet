import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import ProductGridHeader from '../components/ProductGridHeader';
import ProductTable from '../components/ProductTable';
import { LoadingSpinner } from '../../../shared/components/Loader';
import {
    getProducts,
    deleteProduct,
    transformProductData
} from '../api/productsApi';
import { showSuccess, showError } from '../../../shared/utils/alert';

// Pagination Component
const Pagination = ({ currentPage, lastPage, onPageChange }) => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(lastPage, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Previous
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 text-sm border border-gray-300 rounded-md ${page === currentPage
                            ? 'bg-brand-500 text-white border-brand-500'
                            : 'hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
            <div className="text-sm text-gray-600">
                Page {currentPage} of {lastPage}
            </div>
        </div>
    );
};

// Main Product Grid Component
export default function ProductGrid() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState({});
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        status: 'active'
    });
    const [error, setError] = useState(null);

    // Fetch products from API
    const fetchProducts = async (page = 1, currentFilters = filters) => {
        try {
            setLoading(true);
            setError(null);

            const response = await getProducts(page, {
                search: currentFilters.search || undefined,
                category: currentFilters.category || undefined,
                status: currentFilters.status || undefined,
                per_page: 10
            });

            // Transform API data to match component expectations
            const transformedProducts = response.data.map(transformProductData);
            console.log(transformedProducts);
            setProducts(transformedProducts);

            setPagination(response.meta);

        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message);
            showError(error.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchProducts();
    }, []);

    // Refetch when filters change
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchProducts(1, filters);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [filters]);

    const handleAddProduct = () => {
        navigate('/products/add');
    };

    const handleEditProduct = (product) => {
        navigate(`/products/edit/${product.id}`);
    };

    const handleDeleteProduct = async (product) => {
        try {
            setDeleting(prev => ({ ...prev, [product.id]: true }));

            await deleteProduct(product.id);

            // Refresh the products list
            await fetchProducts(pagination.current_page);

            showSuccess(`"${product.name}" has been deleted successfully!`);
        } catch (error) {
            showError(error.message || 'Failed to delete product. Please try again.');
            console.error('Error deleting product:', error);
        } finally {
            setDeleting(prev => ({ ...prev, [product.id]: false }));
        }
    };

    const handleViewProduct = (product) => {
        navigate(`/products/${product.id}`);
    };

    const handlePageChange = (page) => {
        fetchProducts(page);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleRefresh = () => {
        fetchProducts(pagination.current_page);
    };

    const handleManageVariants = (product) => {
        navigate(`/products/${product.id}/variants/add`);
    };

    // Error state
    if (error && !loading) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto">
                    <ProductGridHeader onAddProduct={handleAddProduct} />
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load products</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <ProductGridHeader
                onAddProduct={handleAddProduct}
                totalProducts={pagination.total}
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
            />

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange({ search: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange({ status: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden ">
                {/* Table Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                        <div className="text-sm text-gray-500">
                            Showing {products.length} of {pagination.total} products
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && <LoadingSpinner />}

                {/* Table Content */}
                {!loading && products.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <ProductTable
                                        key={product.id}
                                        product={product}
                                        onEdit={handleEditProduct}
                                        onDelete={handleDeleteProduct}
                                        onView={handleViewProduct}
                                        onManageVariants={handleManageVariants}  // Add this line
                                        isDeleting={deleting[product.id]}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">
                            {filters.search || filters.category ?
                                'No products match your current filters.' :
                                'You haven\'t added any products yet.'
                            }
                        </p>
                        {filters.search || filters.category ? (
                            <button
                                onClick={() => setFilters({ search: '', category: '', status: 'active' })}
                                className="text-brand-600 hover:text-brand-700 font-medium"
                            >
                                Clear filters
                            </button>
                        ) : (
                            <button
                                onClick={handleAddProduct}
                                className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                            >
                                Add Your First Product
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!loading && products.length > 0 && pagination.last_page > 1 && (
                    <Pagination
                        currentPage={pagination.current_page}
                        lastPage={pagination.last_page}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}