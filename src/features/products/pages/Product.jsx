import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import ProductGridHeader from '../components/ProductGridHeader';
import ProductTable from '../components/ProductTable';
import { LoadingSpinner } from '../../../shared/components/Loader';
import ConfirmationModal from '../../../shared/components/ConfirmationModal'; // Added Import
import Pagination from '../components/Pagination';
import {
    getProducts,
    deleteProduct,
    transformProductData
} from '../api/productsApi';
import { showSuccess, showError } from '../../../shared/utils/alert';
import { Package } from 'lucide-react';

export default function Product() {
    const navigate = useNavigate();

    // --- State Management ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // Modal State (Moved from ProductTable)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    // --- Client-side Filter State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // --- Data Fetching ---
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await getProducts(currentPage);
                const productsArray = response.data;
                const paginationInfo = response.meta;

                if (!productsArray || !paginationInfo) {
                    throw new Error("Invalid API response structure");
                }

                setProducts(productsArray.map(transformProductData));
                setPagination({
                    current_page: paginationInfo.current_page,
                    last_page: paginationInfo.last_page,
                    total: paginationInfo.total
                });

            } catch (err) {
                showError('Failed to fetch products', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    // --- Client-side Filtering ---
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const productStatus = product.is_published ? 'active' : 'inactive';
            const matchesStatus = statusFilter === 'all' || productStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [products, searchTerm, statusFilter]);

    // --- Event Handlers ---
    const handleAddProduct = () => navigate('/products/add');
    const handleEditProduct = (product) => navigate(`/products/edit/${product.id}`);
    const handleViewProduct = (product) => navigate(`/products/${product.id}`);

    // ADDED: Fix for "Manage Variants" button not working
    const handleManageVariants = (product) => navigate(`/products/${product.id}/variants`);

    // ADDED: Handler to open the delete modal (Lifted from ProductTable)
    const handleOpenDeleteModal = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    // ADDED: Handler to confirm deletion
    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        setShowDeleteModal(false);
        setDeletingId(productToDelete.id);

        try {
            await deleteProduct(productToDelete.id);
            showSuccess('Product deleted successfully');

            // Refetch to update list
            const response = await getProducts(currentPage);
            const { data, meta } = response;
            setProducts(data.map(transformProductData));
            setPagination({
                current_page: meta.current_page,
                last_page: meta.last_page,
                total: meta.total
            });

            if (data.length === 0 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }

        } catch (err) {
            showError('Failed to delete product', err.message);
        } finally {
            setDeletingId(null);
            setProductToDelete(null);
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= pagination.last_page) {
            setCurrentPage(page);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <ProductGridHeader
                    onAddProduct={handleAddProduct}
                    totalProducts={pagination.total}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                />

                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {!loading && filteredProducts.length > 0 && (
                                    filteredProducts.map(product => (
                                        <ProductTable
                                            key={product.id}
                                            product={product}
                                            onEdit={handleEditProduct}
                                            onDelete={handleOpenDeleteModal} // Pass the modal opener here
                                            onView={handleViewProduct}
                                            onManageVariants={handleManageVariants} // Pass the variant handler here
                                            isDeleting={deletingId === product.id}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center p-12">
                            <LoadingSpinner size="lg" message="Loading products..." />
                        </div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center p-12">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {searchTerm || statusFilter !== 'all' ? 'No Products Match Filters' : 'No Products Found'}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters.' : "You haven't added any products yet."}
                            </p>
                            {!(searchTerm || statusFilter !== 'all') && (
                                <button
                                    onClick={handleAddProduct}
                                    className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                                >
                                    Add Your First Product
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {!loading && pagination.last_page > 1 && (
                    <Pagination
                        currentPage={pagination.current_page}
                        lastPage={pagination.last_page}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            {/* MOVED: Modal is now here, outside the table structure */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </DashboardLayout>
    );
}