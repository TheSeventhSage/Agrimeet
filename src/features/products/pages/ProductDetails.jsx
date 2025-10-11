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

    // New state: selected variant and quantity
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [quantity, setQuantity] = useState(1);

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
                const raw = response?.data ?? response;
                const transformedProduct = transformProductData(raw);
                setProduct(transformedProduct);

                // set default selected variant: prefer first variant, else null
                if (Array.isArray(transformedProduct?.variants) && transformedProduct.variants.length > 0) {
                    setSelectedVariantId(transformedProduct.variants[0].id);
                } else {
                    setSelectedVariantId(null);
                }

                // default selected image
                if (Array.isArray(transformedProduct?.images) && transformedProduct.images.length > 0) {
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

    // Helper: compute variant stock sum and total stock (safe)
    const computeVariantStockSum = (p) => {
        if (!p) return 0;
        if (!Array.isArray(p.variants)) return 0;
        return p.variants.reduce((s, v) => s + (Number(v?.stock_quantity ?? v?.stock ?? 0) || 0), 0);
    };

    const variantStockSum = computeVariantStockSum(product);
    const topLevelStock = Number(product?.stock ?? product?.stock_quantity ?? 0) || 0;
    const totalStock = topLevelStock + variantStockSum;
    const isAvailable = totalStock > 0;

    // Selected variant object
    const selectedVariant =
        Array.isArray(product?.variants) && selectedVariantId
            ? product.variants.find((v) => v.id === selectedVariantId) ?? null
            : null;

    const selectedVariantStock = Number(selectedVariant?.stock_quantity ?? selectedVariant?.stock ?? 0) || 0;

    // Price display: prefer variant price if selected, else product discounted/base price
    const displayPrice = selectedVariant?.price ?? product?.discountedPrice ?? product?.discount_price ?? product?.price ?? product?.base_price;

    // Quantity controls - respect selected variant stock or total stock
    const increaseQty = () => {
        const maxStock = selectedVariant ? selectedVariantStock : totalStock;
        setQuantity((q) => Math.min(maxStock || Infinity, q + 1));
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
            'inactive': { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' },
            'draft': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' }
        };

        const config = statusConfig[(status || '').toLowerCase()] || statusConfig['draft'];

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const StockIndicator = ({ stock, selectedStock = null }) => {
        // stock = totalStock, selectedStock = selectedVariantStock (optional)
        let config;
        if (stock > 50) {
            config = { dot: 'bg-green-500', text: 'In Stock', color: 'text-green-600' };
        } else if (stock > 10) {
            config = { dot: 'bg-yellow-500', text: 'Low Stock', color: 'text-yellow-600' };
        } else if (stock > 0) {
            config = { dot: 'bg-orange-500', text: 'Very Low', color: 'text-orange-600' };
        } else {
            config = { dot: 'bg-red-500', text: 'Out of Stock', color: 'text-red-600' };
        }

        return (
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${config.dot}`}></div>
                <div>
                    <div className={`text-sm font-medium ${config.color}`}>{config.text}</div>
                    <div className="text-xs text-gray-500">
                        {stock} units total{selectedStock != null ? ` • selected: ${selectedStock} units` : ''}
                    </div>
                </div>
            </div>
        );
    };

    const renderStars = (rating) =>
        Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < Math.floor(rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ));

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
                                    src={
                                        product?.image
                                        || (Array.isArray(product?.images) && product.images[selectedImage])
                                        || product?.thumbnail
                                        || ''
                                    }
                                    alt={product?.name}
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
                            {Array.isArray(product?.images) && product.images.length > 1 && (
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
                                    <span>Category: {product.category ?? '—'}</span>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {renderStars(product.rating)}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {product.rating ?? 0} • {product.reviews ?? 0} reviews
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-gray-900">
                                    ${Number(displayPrice ?? 0).toFixed(2)}
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
                                    per {product.unitSymbol || product.unit || product.unit?.symbol || ''}
                                </span>
                            </div>

                            {/* Stock */}
                            <StockIndicator stock={totalStock} selectedStock={selectedVariant ? selectedVariantStock : null} />

                            {/* Variant selector (if variants exist) */}
                            {Array.isArray(product?.variants) && product.variants.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Variants</h4>

                                    {/* If many variants, render as horizontal scrollable pills */}
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {product.variants.map((v) => {
                                            const vStock = Number(v?.stock_quantity ?? v?.stock ?? 0) || 0;
                                            const disabled = vStock <= 0;
                                            const isSelected = selectedVariantId === v.id;

                                            return (
                                                <button
                                                    key={v.id}
                                                    onClick={() => {
                                                        setSelectedVariantId(v.id);
                                                        setQuantity(1);
                                                    }}
                                                    disabled={disabled}
                                                    className={`flex-shrink-0 px-3 py-2 rounded-lg border transition-all text-left min-w-[150px]
                                                        ${isSelected ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}
                                                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm font-medium">{v.name || `Variant ${v.id}`}</div>
                                                        <div className="text-sm font-semibold">${Number(v.price ?? 0).toFixed(2)}</div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {v.attribute_values ? v.attribute_values.map(av => `${av.attribute}: ${av.value}`).join(' • ') : ''}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {vStock} {v.unit?.symbol ?? product.unit ?? ''} available
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

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
                                        <div className="text-sm font-medium text-gray-900">Total Stock</div>
                                        <div className="text-xs text-gray-500">{totalStock} units</div>
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
                                            <span className="font-medium text-gray-900">{product.unit ?? product.unitSymbol}</span>
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
                                            <span className="font-medium text-gray-900">${product.originalPrice ?? product.base_price ?? product.price}</span>
                                        </div>
                                        {product.discountedPrice && (
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-500">Discount Price</span>
                                                <span className="font-medium text-green-600">${product.discountedPrice}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Stock Quantity</span>
                                            <span className="font-medium text-gray-900">{totalStock} units</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Created</span>
                                            <span className="font-medium text-gray-900">
                                                {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}
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
