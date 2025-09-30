import { Truck, Shield, Users, TrendingUp } from "lucide-react";

const Features = () => {
    const features = [
        {
            icon: Truck,
            title: "Fast Delivery",
            description: "Fresh produce delivered directly from farm to your doorstep within hours.",
            color: "text-blue-600 bg-blue-100",
        },
        {
            icon: Shield,
            title: "Quality Guarantee",
            description: "All products are verified for quality and freshness before delivery.",
            color: "text-green-600 bg-green-100",
        },
        {
            icon: Users,
            title: "Community Support",
            description: "Support local farmers and sustainable agricultural practices.",
            color: "text-orange-600 bg-orange-100",
        },
        {
            icon: TrendingUp,
            title: "Fair Pricing",
            description: "Transparent pricing that benefits both farmers and consumers.",
            color: "text-purple-600 bg-purple-100",
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose AgriMeet?</h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        We're revolutionizing the way agricultural products are bought and sold.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-white"
                                role="article"
                                aria-labelledby={`feature-${idx}`}
                            >
                                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto`}>
                                    <Icon className="w-7 h-7" aria-hidden="true" />
                                </div>

                                <h3 id={`feature-${idx}`} className="mt-6 text-xl font-semibold text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
