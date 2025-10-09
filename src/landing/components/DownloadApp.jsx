import { useState } from "react";
import { Apple, Play, QrCode, Download } from "lucide-react";
import Button from "../../shared/components/Button";
// adjust path if your alerts file is elsewhere
import { showSuccess, showError } from "../../shared/utils/alert";

const DownloadApp = () => {
    const [open, setOpen] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText("https://example.com/download");
            showSuccess("Download link copied to clipboard");
        } catch (err) {
            showError("Could not copy link");
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <>
            <section className="py-20 bg-brand-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold">Get the AgriMeet App</h2>
                            <p className="mt-4 text-lg text-gray-300 max-w-lg">
                                Shop fresh produce, connect with farmers, and manage your orders anytime, anywhere.
                            </p>

                            <ul className="mt-6 space-y-3 text-gray-200">
                                <li className="flex items-center gap-3">
                                    <Download className="w-5 h-5 text-green-400" aria-hidden="true" />
                                    <span>Instant order updates and notifications</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Download className="w-5 h-5 text-green-400" aria-hidden="true" />
                                    <span>Secure in-app payments</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Download className="w-5 h-5 text-green-400" aria-hidden="true" />
                                    <span>Real-time delivery tracking</span>
                                </li>
                            </ul>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                {/* Official store badges (add assets to /public/images) */}
                                <a href="#" className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-black text-white shadow-xs hover:bg-gray-800" aria-label="Download on the App Store">
                                    <Apple className="w-5 h-5" />
                                    <span className="text-sm">App Store</span>
                                </a>

                                <a href="#" className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-black text-white shadow-xs hover:bg-gray-800" aria-label="Get it on Google Play">
                                    <Play className="w-5 h-5" />
                                    <span className="text-sm">Google Play</span>
                                </a>

                                <Button variant="outline" className="ml-0 sm:ml-2" onClick={() => setOpen(true)}>
                                    <QrCode className="w-5 h-5 mr-2" />
                                    Scan QR
                                </Button>
                            </div>

                            <div className="mt-6 flex items-center text-sm text-gray-400">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">⭐</span>
                                    ))}
                                </div>
                                <span className="ml-3">4.9/5 from 10,000+ reviews</span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative z-10">
                                <img src="/api/placeholder/400/800" alt="AgriMeet Mobile App" className="w-80 mx-auto rounded-3xl shadow-2xl" loading="lazy" />
                            </div>

                            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl">
                                <div className="text-center">
                                    <QrCode className="w-16 h-16 text-gray-900 mx-auto" />
                                    <p className="text-xs text-gray-600 mt-2">Scan to download</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Download AgriMeet</h3>
                            <button onClick={() => setOpen(false)} aria-label="Close" className="text-gray-500">✕</button>
                        </div>

                        <div className="mt-4 text-center">
                            {/* large QR placeholder — replace src with generated QR if available */}
                            <div className="inline-block bg-gray-100 p-4 rounded-lg">
                                <img src="/api/placeholder/200/200" alt="QR code" className="w-40 h-40" loading="lazy" />
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-3">
                                <a href="#" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white" aria-label="App Store">
                                    <Apple className="w-4 h-4" />
                                    <span className="text-sm">App Store</span>
                                </a>
                                <a href="#" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white" aria-label="Google Play">
                                    <Play className="w-4 h-4" />
                                    <span className="text-sm">Google Play</span>
                                </a>
                            </div>

                            <div className="mt-4 flex justify-center gap-3">
                                <button onClick={handleCopyLink} className="px-4 py-2 bg-green-600 text-white rounded-lg">Copy link</button>
                                <a href="https://example.com/download" className="px-4 py-2 border rounded-lg">Open link</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DownloadApp;
