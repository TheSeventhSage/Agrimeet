const Categories = () => {
    const categories = [
        { name: "Fresh Vegetables", image: "/api/placeholder/300/200", count: "2,500+ Products" },
        { name: "Organic Fruits", image: "/api/placeholder/300/200", count: "1,800+ Products" },
        { name: "Dairy Products", image: "/api/placeholder/300/200", count: "900+ Products" },
        { name: "Grains & Cereals", image: "/api/placeholder/300/200", count: "1,200+ Products" },
        { name: "Meat & Poultry", image: "/api/placeholder/300/200", count: "700+ Products" },
        { name: "Herbs & Spices", image: "/api/placeholder/300/200", count: "600+ Products" },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse Categories</h2>
                    <p className="mt-4 text-xl text-gray-600">Discover fresh produce from trusted farmers — shop by category.</p>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, idx) => (
                        <article
                            key={idx}
                            className="group relative overflow-hidden rounded-2xl shadow-lg bg-white"
                            aria-labelledby={`cat-${idx}-title`}
                        >
                            <div className="relative w-full aspect-16/10 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
                            </div>

                            <div className="p-5">
                                <h3 id={`cat-${idx}-title`} className="text-xl font-semibold text-gray-900">
                                    {category.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">{category.count}</p>

                                <div className="mt-4 flex items-center justify-between">
                                    <a
                                        href={`/shop?category=${encodeURIComponent(category.name)}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium shadow-xs hover:bg-green-500 focus:outline-hidden focus:ring-2 focus:ring-green-300"
                                        aria-label={`Explore ${category.name}`}
                                    >
                                        Explore
                                        <span aria-hidden>→</span>
                                    </a>

                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                        New
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
