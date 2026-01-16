import { useState } from 'react';
import {
    Package,
    Tag,
    User,
    MapPin,
    CreditCard,
    Phone,
    Mail,
    Globe,
    Calendar,
    Box,
    Layers,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ImageIcon,
    Shield,
    Info,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const ProductDetails = ({ product, onClose }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!product) return null;

    // Helper to safely render string values or N/A
    const val = (value) => {
        if (value === null || value === undefined || value === '') return <span className="text-gray-400 italic">N/A</span>;
        return value;
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(parseFloat(amount || 0));
    };

    // Prepare images array (combining thumbnail and images)
    const allImages = [
        product.thumbnail,
        ...(Array.isArray(product.images) ? product.images : [])
    ].filter(Boolean);

    // Get image URL safely whether string or object
    const getImageUrl = (img) => typeof img === 'string' ? img : img?.url;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{val(product.name)}</h2>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                ID: <span className="font-mono text-xs bg-gray-100 px-1 rounded">#{product.id}</span>
                                <span>•</span>
                                Created: {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'Unknown Date'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* LEFT COLUMN - Images & Core Info (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Image Gallery */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="aspect-square bg-gray-100 relative group">
                                    {allImages.length > 0 ? (
                                        <img
                                            src={getImageUrl(allImages[activeImageIndex])}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
                                            <span className="text-sm">No Images Available</span>
                                        </div>
                                    )}

                                    {/* Navigation Overlay */}
                                    {allImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1); }}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0); }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {allImages.length > 1 && (
                                    <div className="flex gap-2 p-3 overflow-x-auto">
                                        {allImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImageIndex(idx)}
                                                className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-brand-600 ring-2 ring-brand-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            >
                                                <img src={getImageUrl(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Card */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Status Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                        <span className="text-gray-500 text-sm">Product Status</span>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${product.status === 'active' ? 'bg-green-100 text-green-700' :
                                            product.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {product.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                                            {product.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                        <span className="text-gray-500 text-sm">Stock Level</span>
                                        <div className="text-right">
                                            <span className={`font-bold ${product.stock_quantity <= product.low_stock_threshold ? 'text-red-600' : 'text-gray-900'}`}>
                                                {val(product.stock_quantity)}
                                            </span>
                                            {product.stock_quantity <= product.low_stock_threshold && (
                                                <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">LOW</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Slug</span>
                                        <span className="text-xs text-gray-900 font-mono truncate max-w-[150px]" title={product.slug}>{val(product.slug)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MIDDLE COLUMN - Detailed Specs & Pricing (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Product Attributes */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Box className="w-4 h-4 text-brand-600" />
                                    Product Specifications
                                </h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">Category</p>
                                        <p className="font-medium text-gray-900 flex items-center gap-2">
                                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                                            {typeof product.category === 'object' ? val(product.category?.name) : val(product.category)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Unit Type</p>
                                        <p className="font-medium text-gray-900 capitalize">
                                            {typeof product.unit === 'object' ? `${product.unit.name} (${product.unit.symbol})` : val(product.unit)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Weight</p>
                                        <p className="font-medium text-gray-900">{val(product.weight)} kg</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">SKU</p>
                                        <p className="font-medium text-gray-900 font-mono text-sm">{val(product.sku)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Low Stock Limit</p>
                                        <p className="font-medium text-gray-900">{val(product.low_stock_threshold)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Card */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-brand-600" />
                                    Pricing Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 text-sm">Base Price</span>
                                        <span className="text-lg font-bold text-gray-900">{formatCurrency(product.base_price)}</span>
                                    </div>

                                    {parseFloat(product.discount_price) > 0 && (
                                        <div className="flex justify-between items-end p-3 bg-green-50 rounded-lg border border-green-100">
                                            <span className="text-green-700 text-sm font-medium">Discount Price</span>
                                            <span className="text-lg font-bold text-green-700">{formatCurrency(product.discount_price)}</span>
                                        </div>
                                    )}

                                    {/* Calculated Margin (If strictly base price vs discount) */}
                                    {parseFloat(product.discount_price) > 0 && (
                                        <div className="mt-2 text-right">
                                            <span className="text-xs text-gray-500">Discount Amount: </span>
                                            <span className="text-xs font-medium text-red-500">
                                                -{formatCurrency(product.base_price - product.discount_price)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Description</h3>
                                <div className="bg-gray-50 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                                        {val(product.description)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Seller & Sensitive Data (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Seller Profile */}
                            {product.seller && (
                                <div className="bg-white rounded-xl p-0 shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-gray-900 p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/20">
                                            {product.seller.store_name?.charAt(0) || <Store className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-sm">{val(product.seller.store_name)}</h3>
                                            <p className="text-white/60 text-xs">Seller ID: #{product.seller.id}</p>
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        {/* User Details */}
                                        <div className="flex items-start gap-3">
                                            <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900">
                                                    {product.seller.user?.first_name} {product.seller.user?.last_name}
                                                </p>
                                                <p className="text-gray-500 text-xs">Owner</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="text-gray-900">{val(product.seller.user?.email)}</p>
                                                <p className="text-gray-500 text-xs">Email</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="text-gray-900">{val(product.seller.business_phone_number || product.seller.user?.phone_number)}</p>
                                                <p className="text-gray-500 text-xs">Phone</p>
                                            </div>
                                        </div>

                                        <hr className="border-gray-100" />

                                        {/* Location */}
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="text-gray-900">{val(product.seller.address)}</p>
                                                <p className="text-gray-500">
                                                    {val(product.seller.city)}, {val(product.seller.state)}
                                                </p>
                                                {product.seller.latitude && (
                                                    <p className="text-[10px] text-gray-400 mt-1 font-mono">
                                                        Lat: {product.seller.latitude}, Long: {product.seller.longitude}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bank Details (Admin Only View) */}
                            {product.seller && (
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-brand-600" />
                                        Financial Details
                                    </h3>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Bank Name</p>
                                                <p className="font-semibold text-gray-900">{val(product.seller.bank_name)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Account Number</p>
                                                <p className="font-mono font-medium text-gray-900 tracking-wide">{val(product.seller.bank_account_number)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Account Name</p>
                                                <p className="text-sm text-gray-900">{val(product.seller.name_on_account)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification Status */}
                                    <div className="mt-4 flex items-center gap-2 text-xs">
                                        <Shield className={`w-3 h-3 ${product.seller.is_address_validated ? 'text-green-500' : 'text-gray-400'}`} />
                                        <span className={product.seller.is_address_validated ? 'text-green-700 font-medium' : 'text-gray-500'}>
                                            Address Validated: {product.seller.is_address_validated ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer - Raw Data Toggle (Optional) */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <details className="group">
                            <summary className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-900">
                                <Info className="w-4 h-4" />
                                <span>View Raw JSON Data</span>
                            </summary>
                            <div className="mt-4 p-4 bg-gray-900 text-gray-300 rounded-lg overflow-x-auto text-xs font-mono">
                                <pre>{JSON.stringify(product, null, 2)}</pre>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;