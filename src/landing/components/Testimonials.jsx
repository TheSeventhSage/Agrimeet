import React from "react";
import { Star } from "lucide-react";

const Testimonials = () => {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Local Farmer",
            image: "/api/placeholder/80/80",
            content:
                "AgriMeet has transformed my business. I can now reach customers directly and get fair prices for my produce.",
            rating: 5,
        },
        {
            name: "Michael Chen",
            role: "Restaurant Owner",
            image: "/api/placeholder/80/80",
            content:
                "The quality of produce is exceptional. Fresh ingredients delivered right to my kitchen daily.",
            rating: 5,
        },
        {
            name: "Emily Rodriguez",
            role: "Home Cook",
            image: "/api/placeholder/80/80",
            content:
                "I love supporting local farmers and getting the freshest ingredients. The app is so easy to use!",
            rating: 5,
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Users Say</h2>
                    <p className="mt-4 text-xl text-gray-600">Join thousands of satisfied farmers and customers</p>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <article key={i} className="bg-white p-6 rounded-2xl shadow-lg">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={t.image}
                                        alt={`${t.name} avatar`}
                                        className="w-12 h-12 rounded-full object-cover"
                                        loading="lazy"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{t.name}</h4>
                                        <p className="text-sm text-gray-500">{t.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center" aria-hidden="true">
                                    {[...Array(t.rating)].map((_, x) => (
                                        <Star key={x} className="w-4 h-4 text-yellow-400" />
                                    ))}
                                </div>
                            </div>

                            <blockquote className="text-gray-600 italic">“{t.content}”</blockquote>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
