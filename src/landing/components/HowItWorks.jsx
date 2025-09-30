import { UserPlus, ShoppingCart, Truck, CheckCircle } from "lucide-react";

const HowItWorks = () => {
    const steps = [
        { icon: UserPlus, title: "Create Account", description: "Sign up as a farmer or buyer in minutes", step: "01" },
        { icon: ShoppingCart, title: "Browse Products", description: "Explore fresh produce from local farmers", step: "02" },
        { icon: Truck, title: "Place Order", description: "Select products and schedule delivery", step: "03" },
        { icon: CheckCircle, title: "Enjoy Freshness", description: "Receive quality products at your doorstep", step: "04" },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Simple steps to receive fresh agricultural products from trusted farmers.</p>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <article
                                key={idx}
                                className="relative bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                                aria-labelledby={`how-step-${idx}`}
                            >
                                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Icon className="w-10 h-10 text-green-600" aria-hidden="true" />
                                </div>

                                <div className="absolute -top-3 right-6 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                                    {step.step}
                                </div>

                                <h3 id={`how-step-${idx}`} className="text-lg font-semibold text-gray-900">{step.title}</h3>
                                <p className="mt-2 text-gray-600 text-sm">{step.description}</p>
                            </article>
                        );
                    })}
                </div>

                {/* CTA tied to How it Works — helpful to convert visitors */}
                <div className="mt-10 text-center">
                    <a
                        href="/signup"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-full font-medium shadow hover:bg-green-500"
                        aria-label="Create account now"
                    >
                        Get Started — Join AgriMeet
                        <span aria-hidden>→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
