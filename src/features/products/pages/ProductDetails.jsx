import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Star, ShoppingCart, Share2, Heart, Package, Truck, Shield, RotateCcw } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { LoadingSpinner } from '../../../shared/components/Loader';
import { getProduct, transformProductData } from '../api/productsApi';
import { showError } from '../../../shared/utils/alert';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError('Product ID not found');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await getProduct(id);
                const transformedProduct = transformProductData(response.data || response);
                setProduct(transformedProduct);

                // Set first image as selected by default
                if (transformedProduct.images && transformedProduct.images.length > 0) {
                    setSelectedImage(0);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message || 'Failed to load product details');
                showError(err.message || 'Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleEdit = () => {
        navigate(`/products/edit/${id}`);
    };

    const handleBack = () => {
        navigate('/products');
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
            'inactive': { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' },
            'draft': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' }
        };

        const config = statusConfig[status?.toLowerCase()] || statusConfig['draft'];

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const StockIndicator = ({ stock }) => {
        let config;
        if (stock > 50) {
            config = { bg: 'bg-green-500', text: 'In Stock', color: 'text-green-600' };
        } else if (stock > 10) {
            config = { bg: 'bg-yellow-500', text: 'Low Stock', color: 'text-yellow-600' };
        } else if (stock > 0) {
            config = { bg: 'bg-orange-500', text: 'Very Low', color: 'text-orange-600' };
        } else {
            config = { bg: 'bg-red-500', text: 'Out of Stock', color: 'text-red-600' };
        }

        return (
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${config.bg}`}></div>
                <span className={`text-sm font-medium ${config.color}`}>
                    {config.text} ({stock} units)
                </span>
            </div>
        );
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center min-h-96">
                        <LoadingSpinner />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !product) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load product</h3>
                        <p className="text-gray-500 mb-4">{error || 'Product not found'}</p>
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Products
                        </button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
                            <p className="text-gray-600">View and manage product information</p>
                        </div>
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Product
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Image Gallery */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex flex-col gap-6">
                            {/* Main Image */}
                            <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[selectedImage] : product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = `data:image/svg+xml;base64,${btoa(`
                                            <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="400" height="400" fill="#f3f4f6"/>
                                                <path d="M200 100L160 140H120C110 140 100 150 100 160V260C100 270 110 280 120 280H280C290 280 300 270 300 260V160C300 150 290 140 280 140H240L200 100ZM200 250C172 250 150 228 150 200C150 172 172 150 200 150C228 150 250 172 250 200C250 228 228 250 200 250Z" fill="#9ca3af"/>
                                            </svg>
                                        `)}`;
                                    }}
                                />
                            </div>

                            {/* Thumbnail Images */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                    ? 'border-brand-500 ring-2 ring-brand-100'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                                    <StatusBadge status={product.status} />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>SKU: {product.slug || 'N/A'}</span>
                                    <span>•</span>
                                    <span>Category: {product.category}</span>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {renderStars(product.rating)}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {product.rating} • {product.reviews} reviews
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-gray-900">
                                    ${product.discountedPrice || product.price}
                                </span>
                                {product.originalPrice && product.originalPrice > (product.discountedPrice || product.price) && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">
                                            ${product.originalPrice}
                                        </span>
                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                            {product.discount}% OFF
                                        </span>
                                    </>
                                )}
                                <span className="text-sm text-gray-500">
                                    per {product.unitSymbol || product.unit}
                                </span>
                            </div>

                            {/* Stock */}
                            <StockIndicator stock={product.stock} />

                            {/* Description Preview */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 line-clamp-3">
                                    {product.description || 'No description available.'}
                                </p>
                            </div>

                            {/* Key Features */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Package className="w-5 h-5 text-brand-500" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">In Stock</div>
                                        <div className="text-xs text-gray-500">{product.stock} units</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Truck className="w-5 h-5 text-brand-500" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Free Shipping</div>
                                        <div className="text-xs text-gray-500">Available</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Shield className="w-5 h-5 text-brand-500" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Warranty</div>
                                        <div className="text-xs text-gray-500">1 Year</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <RotateCcw className="w-5 h-5 text-brand-500" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Returns</div>
                                        <div className="text-xs text-gray-500">30 Days</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                                <button className="p-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Tabs */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-8 px-6">
                            {['description', 'specifications', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                                            ? 'border-brand-500 text-brand-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description || 'No detailed description available for this product.'}
                                </p>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Category</span>
                                            <span className="font-medium text-gray-900">{product.category}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Unit</span>
                                            <span className="font-medium text-gray-900">{product.unit}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">SKU</span>
                                            <span className="font-medium text-gray-900">{product.slug || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Status</span>
                                            <StatusBadge status={product.status} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Base Price</span>
                                            <span className="font-medium text-gray-900">${product.originalPrice}</span>
                                        </div>
                                        {product.discountedPrice && (
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-500">Discount Price</span>
                                                <span className="font-medium text-green-600">${product.discountedPrice}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Stock Quantity</span>
                                            <span className="font-medium text-gray-900">{product.stock} units</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Created</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(product.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-center py-8">
                                <div className="text-gray-400 mb-4">
                                    <Star className="w-12 h-12 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                                <p className="text-gray-500">
                                    This product doesn't have any reviews yet. Be the first to share your experience!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProductDetails;