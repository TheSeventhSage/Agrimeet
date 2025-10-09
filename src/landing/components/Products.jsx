// components/home/Products.jsx
import { ShoppingCart } from "lucide-react";
import { addToCart } from "../utils/cartUtils";

/* Mock products — replace with API data */
const MOCK_PRODUCTS = [
    { id: "p1", title: "Organic Spinach (500g)", price: 3.5, image: "/api/placeholder/400/300" },
    { id: "p2", title: "Tomato Basket (1kg)", price: 2.0, image: "/api/placeholder/400/300" },
    { id: "p3", title: "Free-range Eggs (12)", price: 4.5, image: "/api/placeholder/400/300" },
    { id: "p4", title: "Local Honey (250g)", price: 6.0, image: "/api/placeholder/400/300" },
    { id: "p5", title: "Fresh Ginger (250g)", price: 2.8, image: "/api/placeholder/400/300" },
    { id: "p6", title: "Cassava Flour (1kg)", price: 5.0, image: "/api/placeholder/400/300" },
];

const Products = () => {

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                    <a href="/marketplace" className="text-green-600 font-medium">See all products →</a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_PRODUCTS.map((p) => (
                        <div key={p.id} className="bg-white border rounded-2xl shadow-xs p-4 flex flex-col">
                            <div className="w-full aspect-4/3 overflow-hidden rounded-lg mb-3">
                                <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{p.title}</h3>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="text-lg font-bold text-green-600">${p.price.toFixed(2)}</div>
                                    <div className="text-sm text-gray-500">500g</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    // onClick={() => handleAdd(p)}
                                    onClick={() => addToCart({ id: 'p1', title: 'Tomato', price: 2.5, image: '/img/tomato.jpg' }, 1)}
                                    // disabled={loadingId === p.id}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to cart
                                </button>

                                <a href={`/product/${p.id}`} className="px-3 py-2 border rounded-lg text-gray-700">View</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
