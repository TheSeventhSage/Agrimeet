// src/components/products/SearchProductGrid.jsx

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/home.api"; // Adjust path as needed
import {
    Package,
    Heart,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

/**
 * A component to fetch and display products based on the URL search query.
 * It includes variant stock calculation and a "View Details" button.
 */
const SearchProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || ''; // Get search query from URL

    // Reset page to 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    // Fetch products when page or query changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const filters = {
                    status: "active",
                    search: query, // Send search term to the API
                };

                const result = await api.getAllProducts(currentPage, 12, filters);

                const productsArray = Array.isArray(result?.data) ? result.data : [];
                setProducts(productsArray);

                setTotalPages(result?.meta?.last_page ?? 1);
                setTotalProducts(result?.meta?.total ?? productsArray.length);
            } catch (error) {
                console.error("Failed to fetch search results:", error);
                setProducts([]);
                setTotalPages(1);
                setTotalProducts(0);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, query]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const title = query ? `Search Results` : 'Browse All Products';
    const description = query
        ? `Showing products matching "${query}"`
        : 'Showing all available products';

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {title}
                        </h2>
                        <p className="text-gray-600">
                            {description} ({totalProducts} products)
                        </p>
                    </div>
                </div>

                {/* Body (Loading, Empty, or Grid) */}
                <div className="p-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Package className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Products Found
                            </h3>
                            <p className="text-sm text-gray-500 max-w-lg">
                                We couldn't find any products matching your search for "{query}".
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* --- REVISED PRODUCT CARD GRID --- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => {

                                    // 1. VARIANT STOCK CALCULATION (as requested)
                                    const variantStock = Array.isArray(product.variants)
                                        ? product.variants.reduce(
                                            (sum, v) => sum + (Number(v.stock_quantity) || 0),
                                            0
                                        )
                                        : 0;
                                    const isAvailable = variantStock > 0;

                                    return (
                                        <div
                                            key={product.id}
                                            className="group relative bg-white border border-gray-100 rounded-3xl p-6 flex flex-col transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                                        >
                                            {/* Image */}
                                            <div className="relative mb-6 rounded-2xl overflow-hidden bg-gray-50">
                                                <img
                                                    src={
                                                        product.thumbnail || "/api/placeholder/300/300"
                                                    }
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>

                                            {/* Content Area - uses flex-grow to push button to bottom */}
                                            <div className="relative flex flex-col flex-grow">
                                                <h3 className="text-lg font-bold text-gray-900 truncate mb-2 group-hover:text-green-600">
                                                    <Link to={`/details/${product.id}`}>
                                                        {product.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate mb-4">
                                                    {product.seller?.store_name || "AgriMeet Farmer"}
                                                </p>

                                                {/* Price - This spacer pushes button down */}
                                                <div className="flex-grow">
                                                    <div className="text-lg font-bold text-green-600">
                                                        ${Number(product.base_price).toFixed(2)}
                                                        <span className="text-sm text-gray-500 font-normal">
                                                            {" "}
                                                            / {product.unit?.symbol || "unit"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 2. "VIEW DETAILS" BUTTON (as requested) */}
                                                <Link
                                                    to={`/details/${product.id}`}
                                                    className="mt-4 w-full text-center bg-green-50 text-green-600 px-4 py-3 rounded-xl font-semibold hover:bg-green-100 transition-all duration-300"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pt-8 mt-8 border-t border-gray-100 flex items-center justify-center gap-2">
                                    {/* ... pagination buttons ... */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages).keys()].map((n) => {
                                            const pageNumber = n + 1;
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${currentPage === pageNumber
                                                        ? "bg-green-600 text-white shadow-lg"
                                                        : "border border-gray-200 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchProductGrid;