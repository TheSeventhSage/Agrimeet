// ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "./api/home.api";
import { LoadingSpinner } from "../shared/components/Loader";

/**
 * Props:
 * - productId (number|string) required
 * - appDeepLinkScheme (string) optional, default 'agrimeet' used for app deep linking
 * - webCheckoutUrl (string) optional, fallback URL if deep link fails
 */
export default function ProductDetails({
    
    appDeepLinkScheme = "agrimeet",
    webCheckoutUrl = "/checkout", // change to your web checkout
}) {
    const { id: productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI state
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        let cancelled = false;

        async function fetchProduct() {
            setLoading(true);
            setError(null);
            try {
                const res = await api.getProduct(productId);
                if (cancelled) return;
                setProduct(res.data);

                // default select first variant if exists
                if (Array.isArray(res?.data?.variants) && res.data.variants.length > 0) {
                    setSelectedVariantId(res.data.variants[0].id);
                } else {
                    setSelectedVariantId(null);
                }
            } catch (err) {
                if (!cancelled) setError(err.message || "Failed to load product");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchProduct();
        return () => {
            cancelled = true;
        };
    }, [productId]);

    if (loading) {
        return (
            <LoadingSpinner message="Loading product details..." />
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    // Safe helpers
    const images = Array.isArray(product.images) ? product.images.map((i) => i.url ?? i) : [];
    // If thumbnail is relative, you may need to prepend BASE_URL/images path in production
    if (images.length === 0 && product.thumbnail) images.push(product.thumbnail);

    // compute stock:
    const variantStock = Array.isArray(product.variants)
        ? product.variants.reduce((s, v) => s + (Number(v.stock_quantity) || 0), 0)
        : 0;
    const topLevelStock = Number(product.stock_quantity) || 0;
    const totalStock = topLevelStock + variantStock;
    const isAvailable = totalStock > 0;

    // find selected variant object
    const selectedVariant =
        (Array.isArray(product.variants) && product.variants.find((v) => v.id === selectedVariantId)) ||
        null;

    const displayPrice = selectedVariant?.price ?? product.discount_price ?? product.base_price;

    // Quantity controls
    const increaseQty = () => {
        // respect stock: if selectedVariant exists use its stock, else use totalStock
        const maxStock = selectedVariant ? Number(selectedVariant.stock_quantity || 0) : totalStock;
        setQuantity((q) => Math.min(maxStock || Infinity, q + 1));
    };
    const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));

    // Build the deep link to the app:
    // Example: agrimeet://product/1?qty=2&variant=3
    const buildAppDeepLink = () => {
        const scheme = appDeepLinkScheme.replace(/:\/+$/, ""); // tidy
        const base = `${scheme}://product/${product.id}`;
        const params = new URLSearchParams();
        params.set("qty", quantity);
        if (selectedVariant) params.set("variant", selectedVariant.id);
        return `${base}?${params.toString()}`;
    };

    // On Buy Now: try to open app via deep link. If that fails, fallback to web checkout.
    const handleBuyNow = () => {
        const deepLink = buildAppDeepLink();

        // If running on mobile, try deep link; otherwise redirect to web checkout.
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            // Try to open app via deep link. Many browsers block or prompt; this approach is commonly used.
            // NOTE: you should replace the fallbackPage with your app store URL if you want to direct users to install.
            const now = Date.now();
            // Create an invisible iframe approach for older browsers (works for many webviews),
            // but on modern browsers iframe deep links are often blocked. We still attempt it.
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = deepLink;
            document.body.appendChild(iframe);

            // As a better fallback, also set top location to intent (Android) or universal link fallback.
            // We'll wait a short time then navigate to web checkout if app didn't open.
            setTimeout(() => {
                // remove iframe
                document.body.removeChild(iframe);
                // If too fast (less than 2 seconds) it's likely the app opened; otherwise, go to web fallback
                if (Date.now() - now < 2000) {
                    // app probably opened — do nothing
                } else {
                    // fallback to web checkout
                    // you can also redirect to app store here if you have store links.
                    window.location.href = webCheckoutUrl + `?product=${product.id}&qty=${quantity}${selectedVariant ? `&variant=${selectedVariant.id}` : ""
                        }`;
                }
            }, 1200);
        } else {
            // Desktop: go to web checkout directly
            window.location.href = webCheckoutUrl + `?product=${product.id}&qty=${quantity}${selectedVariant ? `&variant=${selectedVariant.id}` : ""
                }`;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images / gallery */}
            <div>
                <div className="bg-white rounded-lg overflow-hidden shadow">
                    <div className="relative pb-[56%]"> {/* 16:9 container */}
                        {images && images.length > 0 ? (
                            <img
                                src={images[selectedImageIndex]}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                No image
                            </div>
                        )}
                    </div>

                    {/* thumbnails */}
                    {images.length > 1 && (
                        <div className="flex gap-2 p-3 overflow-x-auto">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImageIndex(idx)}
                                    className={`w-20 h-20 flex-shrink-0 rounded overflow-hidden border ${selectedImageIndex === idx ? "ring-2 ring-green-600" : "border-gray-200"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`${product.name} ${idx}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* simple product meta */}
                <div className="mt-4 flex gap-4 items-center text-sm text-gray-600">
                    <div>Category: <strong className="text-gray-800">{product.category?.name ?? "—"}</strong></div>
                    <div>Seller: <strong className="text-gray-800">{product.seller?.store_name ?? "—"}</strong></div>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">{product.name}</h1>

                <div className="flex items-center gap-4">
                    <div className="text-3xl font-extrabold">
                        {displayPrice != null ? (
                            <>
                                <span className="mr-2">${Number(displayPrice).toFixed(2)}</span>
                                {product.discount_price && Number(product.discount_price) < Number(product.base_price) && (
                                    <span className="text-sm line-through text-gray-400">${Number(product.base_price).toFixed(2)}</span>
                                )}
                            </>
                        ) : (
                            <span className="text-gray-500">Price unavailable</span>
                        )}
                    </div>

                    <div className={`px-2 py-1 rounded text-xs font-medium ${isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {isAvailable ? "In Stock" : "Out of Stock"}
                    </div>
                </div>

                <p className="text-gray-700">{product.description}</p>

                {/* Variant selector */}
                {Array.isArray(product.variants) && product.variants.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">Choose variant</div>
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map((v) => {
                                const vStock = Number(v.stock_quantity || 0);
                                const disabled = vStock <= 0;
                                return (
                                    <button
                                        key={v.id}
                                        onClick={() => {
                                            setSelectedVariantId(v.id);
                                            setQuantity(1);
                                        }}
                                        disabled={disabled}
                                        className={`px-3 py-2 rounded border ${selectedVariantId === v.id ? "border-green-600 bg-green-50" : "border-gray-200"
                                            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <div className="text-sm font-medium">{v.name}</div>
                                        <div className="text-xs text-gray-500">${Number(v.price).toFixed(2)}</div>
                                        <div className="text-xs text-gray-400">{vStock} {v.unit?.symbol ?? product.unit?.symbol ?? "units"}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Quantity and stock display */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded overflow-hidden">
                        <button onClick={decreaseQty} className="px-3 py-2">-</button>
                        <div className="px-4 py-2 min-w-[48px] text-center">{quantity}</div>
                        <button onClick={increaseQty} className="px-3 py-2">+</button>
                    </div>

                    <div className="text-sm text-gray-500">
                        {selectedVariant ? `${selectedVariant.stock_quantity} ${selectedVariant.unit?.symbol ?? ""} available` : `${totalStock} ${product.unit?.symbol ?? ""} available`}
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                        onClick={handleBuyNow}
                        disabled={!isAvailable}
                        className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAvailable ? "Buy Now" : "Out of Stock"}
                    </button>

                    <a
                        href={`/seller/${product.seller?.id ?? ""}`}
                        className="flex-1 text-center border border-gray-200 rounded-lg py-3 px-6"
                    >
                        View Seller
                    </a>
                </div>

                {/* Seller contact */}
                <div className="text-sm text-gray-600 pt-4 border-t">
                    <div>Seller: <strong>{product.seller?.store_name ?? "—"}</strong></div>
                    {product.seller?.business_phone_number && (
                        <div>Contact: <a href={`tel:${product.seller.business_phone_number}`} className="text-green-600">{product.seller.business_phone_number}</a></div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">Product added: {new Date(product.created_at).toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
