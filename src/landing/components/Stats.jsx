
import { Users, ShoppingBag, Truck, Award } from "lucide-react";

const Stats = () => {
    const stats = [
        { icon: Users, number: "10,000+", label: "Active Farmers", description: "Registered agricultural producers" },
        { icon: ShoppingBag, number: "50,000+", label: "Products", description: "Fresh items available daily" },
        { icon: Truck, number: "100,000+", label: "Deliveries", description: "Successful orders delivered" },
        { icon: Award, number: "98%", label: "Satisfaction Rate", description: "Happy customers & farmers" },
    ];

    return (
        <section className="py-20 bg-green-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Growing Together</h2>
                    <p className="mt-4 text-xl text-green-100 max-w-3xl mx-auto">
                        Join thousands of farmers and customers who trust AgriMeet for fresh produce, transparency, and fast delivery.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className="text-center p-6 bg-green-700/90 rounded-2xl">
                                <div className="w-16 h-16 bg-green-800/80 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Icon className="w-7 h-7" aria-hidden="true" />
                                </div>

                                <div className="text-2xl md:text-3xl font-bold">{s.number}</div>
                                <h3 className="mt-2 text-lg font-semibold">{s.label}</h3>
                                <p className="mt-2 text-green-200 text-sm">{s.description}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <div className="flex items-center gap-2 bg-green-700/90 px-4 py-2 rounded-full">
                        <Award className="w-5 h-5" aria-hidden="true" />
                        <span className="text-sm">Best Agricultural Platform 2024</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-700/90 px-4 py-2 rounded-full">
                        <span className="text-sm">🏆 Sustainable Business Award</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-700/90 px-4 py-2 rounded-full">
                        <span className="text-sm">⭐ 4.9/5 Rating</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
