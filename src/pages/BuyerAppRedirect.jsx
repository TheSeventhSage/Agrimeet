import { useEffect, useState } from "react";
import { LogoLightIcon } from "../shared/components/Logo";
import {
    Search,
    User,
    Menu,
    X,
    Leaf,
    Play,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

/**
 * Replace these with your real values:
 * - appScheme: custom URI scheme for your app (e.g. 'agrimeet')
 * - playStoreUrl: Play Store listing URL
 * - appStoreUrl: App Store listing URL
 * - androidPackage: Android package name (for intent fallback)
 */
const DEFAULTS = {
    appScheme: "agrimeet",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.yourcompany.yourapp",
    appStoreUrl: "https://apps.apple.com/app/idYOUR_APP_ID",
    androidPackage: "com.yourcompany.yourapp",
};

const Navbar = ({ onOpenMenu = () => { } }) => {
    // Small trimmed copy of your header structure so the download page matches Home.
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4 lg:py-6">
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="w-12 h-12 bg-linear-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                                <LogoLightIcon className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h1 className="text-xl font-bold text-gray-900">AgriMeet</h1>
                            <p className="text-xs text-gray-500 -mt-1">Farm Fresh Marketplace</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            className="hidden lg:flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all cursor-pointer"
                            onClick={() => (window.location.href = "/login")}
                        >
                            <User className="w-5 h-5" />
                            <span className="text-sm font-medium">Account</span>
                        </button>

                        <button
                            onClick={() => onOpenMenu(true)}
                            className="p-2 sm:hidden rounded-lg hover:bg-gray-100"
                        >
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

/* Footer copied/adapted from your HomePage footer so styles match exactly. */
const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-linear-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white">
                                <Leaf className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold">AgriMeet</h4>
                                <p className="text-sm text-gray-500">Farm Fresh Marketplace</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Connecting local farmers with customers who value sustainable, high-quality produce.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <a href="#" aria-label="Facebook" className="p-2 rounded-lg hover:bg-gray-100">
                                <Facebook className="w-5 h-5 text-gray-600" />
                            </a>
                            <a href="#" aria-label="Twitter" className="p-2 rounded-lg hover:bg-gray-100">
                                <Twitter className="w-5 h-5 text-gray-600" />
                            </a>
                            <a href="#" aria-label="Instagram" className="p-2 rounded-lg hover:bg-gray-100">
                                <Instagram className="w-5 h-5 text-gray-600" />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg hover:bg-gray-100">
                                <Linkedin className="w-5 h-5 text-gray-600" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-semibold mb-3">Marketplace</h5>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-green-600">Browse Products</a></li>
                            <li><a href="#" className="hover:text-green-600">Become a Seller</a></li>
                            <li><a href="#" className="hover:text-green-600">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-semibold mb-3">Support</h5>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-green-600">Help Center</a></li>
                            <li><a href="#" className="hover:text-green-600">Returns</a></li>
                            <li><a href="#" className="hover:text-green-600">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-semibold mb-3">Contact</h5>
                        <div className="text-sm text-gray-600 space-y-3">
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> <span>hello@agrimeet.com</span></div>
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> <span>+234 803 456 789</span></div>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> <span>123 Farm Lane, AgriTown</span></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-8 pt-8 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>© {new Date().getFullYear()} AgriMeet. All rights reserved.</div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-green-600">Terms</a>
                        <a href="#" className="hover:text-green-600">Privacy</a>
                        <a href="#" className="hover:text-green-600">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default function DownloadLanding({
    appScheme = DEFAULTS.appScheme,
    playStoreUrl = DEFAULTS.playStoreUrl,
    appStoreUrl = DEFAULTS.appStoreUrl,
    androidPackage = DEFAULTS.androidPackage,
    product = null, // optional product preview { id, name, description, thumbnail, price }
}) {
    const [platform, setPlatform] = useState("web"); // 'android' | 'ios' | 'web'
    const [status, setStatus] = useState(""); // '', 'attempting', 'redirected'

    useEffect(() => {
        const ua = navigator.userAgent || "";
        if (/android/i.test(ua)) setPlatform("android");
        else if (/iPhone|iPad|iPod/i.test(ua)) setPlatform("ios");
        else setPlatform("web");
    }, []);

    // Construct deep link like: agrimeet://product/1?qty=1
    const buildDeepLink = (productId = null, qty = 1) => {
        const scheme = appScheme.replace(/:\/+$/, "");
        if (productId) return `${scheme}://product/${productId}?qty=${qty}`;
        return `${scheme}://home`;
    };

    // Try to open app. If not installed, redirect to store.
    const openAppOrStore = ({ productId = null, qty = 1 } = {}) => {
        setStatus("attempting");
        const deepLink = buildDeepLink(productId, qty);
        const start = Date.now();
        const REDIRECT_MS = 1200;

        if (platform === "android") {
            // Use chrome intent URL which falls back to Play store automatically for Chrome
            const path = deepLink.replace(/^[a-z]+:\/\//i, "");
            const intentUrl = `intent://${path}#Intent;scheme=${appScheme};package=${androidPackage};end`;
            window.location.href = intentUrl;

            setTimeout(() => {
                if (Date.now() - start < REDIRECT_MS + 200) {
                    setStatus("redirected");
                    window.location.href = playStoreUrl;
                }
            }, REDIRECT_MS);
            return;
        }

        if (platform === "ios") {
            // iOS custom scheme fallback to App Store
            window.location.href = deepLink;
            setTimeout(() => {
                if (Date.now() - start < REDIRECT_MS + 200) {
                    setStatus("redirected");
                    window.location.href = appStoreUrl;
                }
            }, REDIRECT_MS);
            return;
        }

        // Web / unknown
        setStatus("web");
        // Optional: open web checkout page:
        window.location.href = `/checkout?product=${productId ?? ""}&qty=${qty}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Left column: content */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-3 bg-white/30 px-3 py-1 rounded-full text-sm text-green-700 w-max shadow-sm">
                            <Leaf className="w-4 h-4" />
                            App Exclusive
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                            Buy faster. Save more. <span className="text-green-600">Get the AgriMeet app</span>
                        </h1>

                        <p className="text-lg text-gray-600 max-w-2xl">
                            Use the app for instant checkout, order tracking, exclusive in-app discounts and saved favorites — all built for shoppers who value farm fresh produce.
                        </p>

                        {/* Product preview (optional) */}
                        {product && (
                            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow">
                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                                    <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">{product.name}</div>
                                    <div className="text-sm text-gray-500">{product.description}</div>
                                    <div className="text-green-600 font-bold mt-2">${Number(product.price ?? product.base_price ?? 0).toFixed(2)}</div>
                                </div>
                            </div>
                        )}

                        {/* CTA row */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <button
                                onClick={() => openAppOrStore({ productId: product?.id ?? null, qty: 1 })}
                                className="inline-flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-2xl text-lg font-semibold hover:bg-green-700 transition"
                            >
                                <Play className="w-5 h-5" /> Buy in App
                            </button>

                            <div className="inline-flex gap-3 items-center">
                                <a
                                    href={playStoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 bg-black text-white px-4 py-3 rounded-2xl"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 2.2 14.3 11l-10.8 8.8a1 1 0 0 1-1.6-.8V3a1 1 0 0 1 1.1-.8zM14.3 13.1 3.5 21.9 20.7 12 3.5 2.1 14.3 10.9z" /></svg>
                                    Google Play
                                </a>

                                <a
                                    href={appStoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 border border-gray-200 px-4 py-3 rounded-2xl"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M16.2 1.9c.7.9 1.2 2.1 1.2 3.4 0 2.6-2 5.2-4.5 5.2-.6 0-1.3-.1-1.9-.2-1.1-.2-2.2-.6-3.2-.6-2.6 0-5.2 2.1-5.2 4.7 0 1.9-1 4.2-3.1 5.1 1-.7 1.9-1.7 2.6-2.9C8.9 17.8 9.8 16.7 11 16.1c1.6-.9 3.4-.5 5.1.2 1.6.7 2.7 1.7 3.7 2.7 0-4 1.2-9.3 5.9-13.6-1.1 1.5-2.8 2.5-4.8 2.5-1.1 0-2.1-.2-3.1-.8z" /></svg>
                                    App Store
                                </a>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                            <div className="bg-white p-4 rounded-xl shadow">
                                <h4 className="font-semibold">Faster Checkout</h4>
                                <p className="text-sm text-gray-500 mt-1">Complete orders in under 30 seconds.</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow">
                                <h4 className="font-semibold">Exclusive Offers</h4>
                                <p className="text-sm text-gray-500 mt-1">App-only discounts and loyalty rewards.</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow">
                                <h4 className="font-semibold">Order Tracking</h4>
                                <p className="text-sm text-gray-500 mt-1">Real-time updates from seller to doorstep.</p>
                            </div>
                        </div>

                        <div className="mt-8 text-sm text-gray-500">
                            {status === "attempting" && <div>Attempting to open the app... If nothing happens, you'll be redirected to the store.</div>}
                            {status === "redirected" && <div>Redirecting to store...</div>}
                            {status === "web" && <div>Opening web checkout...</div>}
                        </div>
                    </div>

                    {/* Right column: Phone mockup and screenshots */}
                    <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
                        <div className="relative w-[320px] h-[680px] bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                            {/* header speaker */}
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-3 rounded-full bg-gray-200" />

                            {/* screen area */}
                            <div className="absolute inset-12 p-4 overflow-hidden">
                                <div className="h-full rounded-xl bg-[url('/api/placeholder/300/600')] bg-cover bg-center flex items-end">
                                    <div className="bg-gradient-to-t from-black/50 to-transparent w-full p-6 rounded-b-xl">
                                        <div className="text-white font-bold text-xl">{product?.name ?? "Fresh farm foods"}</div>
                                        <div className="text-white/90 text-sm mt-1">{product?.description ?? "Open the app to view product pricing and buy."}</div>
                                    </div>
                                </div>
                            </div>

                            {/* bottom controls */}
                            <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-between items-center">
                                <div className="w-3 h-3 bg-white rounded-full opacity-60" />
                                <div className="w-3 h-3 bg-white rounded-full opacity-40" />
                                <div className="w-3 h-3 bg-white rounded-full opacity-20" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ / small extras */}
                <div className="mt-12 bg-white rounded-xl p-6 shadow">
                    <h3 className="text-xl font-semibold">Got questions?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                        <div>
                            <div className="font-medium">How do I pay?</div>
                            <div className="mt-1">Card payments, mobile money and cash on delivery (where available).</div>
                        </div>
                        <div>
                            <div className="font-medium">Is the app free?</div>
                            <div className="mt-1">Yes — the app is free to download. Some in-app features may require an account.</div>
                        </div>
                        <div>
                            <div className="font-medium">Need support?</div>
                            <div className="mt-1">Email us at hello@agrimeet.com or call +234 803 456 789.</div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
