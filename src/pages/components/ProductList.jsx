// src/components/products/ProductsList.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/home.api"; // Note the adjusted import path
import {
    Package,
    Store,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

/**
 * A self-contained component to fetch, display, and paginate all products.
 */
const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    // Fetch products when the component mounts or when currentPage changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Use the existing API call
                const result = await api.getAllProducts(currentPage, 12, {
                    status: "active"
                });

                // Safely set products, defaulting to an empty array
                const productsArray = Array.isArray(result?.data) ? result.data : [];
                setProducts(productsArray);

                // Safely set pagination meta, defaulting to 1 page
                setTotalPages(result?.meta?.last_page ?? 1);
                setTotalProducts(result?.meta?.total ?? productsArray.length);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                // On error, we'll show the empty state by default
                setProducts([]);
                setTotalPages(1);
                setTotalProducts(0);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    /**
     * Handles changing the product page and scrolls to the top.
     * @param {number} newPage - The page number to navigate to.
     */
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Scroll to top for a smooth pagination experience
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="space-y-8">
            {/* This is the main container card, copied from Home.jsx */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="px-4 md:px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                All Products
                            </h2>
                            <p className="text-gray-600">
                                Premium quality products from verified farmers ({totalProducts}{" "}
                                products)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body (Loading, Empty, or Grid) */}
                <div className="p-4 sm:p-8">
                    {loading ? (
                        // --- Loading State ---
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : products.length === 0 ? (
                        // --- Empty State ---
                        <div className="p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Package className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No products yet
                            </h3>
                            <p className="text-sm text-gray-500 max-w-lg">
                                We're working with farmers to bring more items to the
                                marketplace.
                            </p>
                        </div>
                    ) : (
                        // --- Products Grid ---
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => {
                                    // Calculate total stock from all variants
                                    const variantStock = Array.isArray(product.variants)
                                        ? product.variants.reduce(
                                            (sum, v) => sum + (Number(v.stock_quantity) || 0),
                                            0
                                        )
                                        : 0;

                                    // Determine availability
                                    const isAvailable = variantStock > 0;

                                    return (
                                        <div
                                            key={product.id}
                                            className="group relative bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:scale-[1.02]"
                                        >
                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 z-10 space-y-2">
                                                {product.status === "active" && (
                                                    <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        Available
                                                    </span>
                                                )}
                                            </div>

                                            {/* Image */}
                                            <div className="relative mb-6 rounded-2xl overflow-hidden bg-gray-50">
                                                <img
                                                    src={
                                                        product.thumbnail || "/api/placeholder/300/300"
                                                    }
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                                                            {product.name}
                                                        </h3>
                                                        <div className="flex items-center gap-[5px]">
                                                            <span className="text-2xl font-bold text-green-600">
                                                                ${product.discount_price || product.base_price}
                                                            </span>
                                                            {product.discount_price &&
                                                                Number(product.discount_price) <
                                                                Number(product.base_price) && (
                                                                    <span className="text-xs text-gray-400 line-through">
                                                                        ${product.base_price}
                                                                    </span>
                                                                )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {/* FIX: Changed from `product?.category` to `product.category?.name` 
                                                            based on your API sample showing category as an object.
                                                        */}
                                                            {product?.category || "General"}
                                                        </p>
                                                    </div>

                                                    <div className=" items-center justify-between">
                                                        <p className="text-sm text-right text-gray-500 flex items-center justify-end gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {product.seller?.city || "Location"}
                                                        </p>
                                                        <p className="text-sm text-right text-gray-500 flex items-center justify-end gap-1">
                                                            <Store className="w-3 h-3" />
                                                            {product.seller?.store_name.length > 7 ? product.seller?.store_name.slice(0, 9).replaceAll(' ', '') + '...' : product.seller?.store_name || "Local Farm"}
                                                        </p>

                                                        {/* <div className="text-right">
                                                        <div
                                                            className={`text-xs font-medium ${isAvailable
                                                                    ? "text-green-600"
                                                                    : "text-red-500"
                                                                }`}
                                                        >
                                                            {isAvailable ? "In Stock" : "Out of Stock"}
                                                        </div>
                                                    </div> */}
                                                    </div>
                                                </div>

                                                {/* Price & Stock */}


                                                {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>
                                                        {variantStock}{" "}
                                                        {product.unit?.symbol || "units"} available
                                                    </span>
                                                </div> */}

                                                {/* Action Button */}
                                                <Link to={`/details/${product.id}`}>
                                                    <button className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform active:scale-95 cursor-pointer">
                                                        View Details
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* --- Pagination --- */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {/* Dynamic Page Number Logic */}
                                        {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                pageNumber = index + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = index + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + index;
                                            } else {
                                                pageNumber = currentPage - 2 + index;
                                            }

                                            return (
                                                <button
                                                    key={index}
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

export default ProductsList;