// components/home/Hero.jsx
import React, { useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import Button from "../../shared/components/Button";
import useReveal from "../../shared/hooks/useReveal";

const Hero = () => {
    const [isDemoOpen, setDemoOpen] = useState(false);
    const ref = useReveal();

    return (
        <>
            <section ref={ref} className="relative bg-gradient-to-r from-green-50 to-emerald-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                Connect Farmers & <span className="text-green-600">Buyers</span> Directly
                            </h1>

                            <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl">
                                AgriMeet brings agricultural producers and consumers together in a seamless marketplace —
                                fresh produce, fair prices, and sustainable farming practices delivered fast.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                <Button
                                    size="lg"
                                    className="inline-flex items-center gap-2 px-5 py-3 shadow-md"
                                    onClick={() => window.location.assign("/marketplace")}
                                    aria-label="Get started — browse marketplace"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="inline-flex items-center gap-2 px-5 py-3"
                                    onClick={() => setDemoOpen(true)}
                                    aria-label="Watch demo"
                                >
                                    <Play className="w-5 h-5" />
                                    Watch Demo
                                </Button>
                            </div>

                            <ul className="mt-12 grid grid-cols-3 gap-6 text-center max-w-md mx-auto lg:mx-0">
                                <li>
                                    <div className="text-2xl md:text-3xl font-bold text-green-600">10K+</div>
                                    <div className="text-sm text-gray-600">Farmers</div>
                                </li>
                                <li>
                                    <div className="text-2xl md:text-3xl font-bold text-green-600">50K+</div>
                                    <div className="text-sm text-gray-600">Products</div>
                                </li>
                                <li>
                                    <div className="text-2xl md:text-3xl font-bold text-green-600">100K+</div>
                                    <div className="text-sm text-gray-600">Customers</div>
                                </li>
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="bg-white rounded-2xl p-6 shadow-2xl">
                                <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
                                    <img
                                        src="/api/placeholder/800/600"
                                        alt="Farmers market"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 font-bold">🌱</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 left-4 w-64 md:w-80 bg-white rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-md bg-green-50 flex items-center justify-center text-green-600 font-bold">NEW</div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">Weekly Harvest Box</div>
                                        <div className="text-xs text-gray-500">Fresh picks from nearby farms — delivered weekly</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Modal */}
            {isDemoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl max-w-3xl w-full mx-4 p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold">AgriMeet — Demo</h3>
                            <button aria-label="Close demo" onClick={() => setDemoOpen(false)} className="text-gray-500">✕</button>
                        </div>

                        <div className="mt-4">
                            {/* Replace the iframe src with your demo video URL */}
                            <div className="aspect-video">
                                <iframe
                                    title="AgriMeet demo"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                    className="w-full h-full rounded-md"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Hero;
