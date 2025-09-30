// components/cart/CartModal.jsx
import { useCart } from "./CartProvider";
import { X, Trash } from "lucide-react";

const formatCurrency = (n) => `$${n.toFixed(2)}`;

const CartModal = ({ open, onClose }) => {
    const { items, updateQty, removeFromCart, subtotal, clearCart } = useCart();

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
            <div className="w-full md:w-2/3 lg:w-1/2 bg-white rounded-t-xl md:rounded-xl p-4 md:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Your Cart</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} aria-label="Close cart" className="text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="max-h-[50vh] overflow-y-auto divide-y">
                    {items.length === 0 && <div className="py-8 text-center text-gray-500">Your cart is empty.</div>}
                    {items.map((it) => (
                        <div key={it.id} className="py-4 flex items-center gap-4">
                            <img src={it.image} alt={it.title} className="w-16 h-16 rounded-md object-cover" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-gray-900">{it.title}</div>
                                        <div className="text-sm text-gray-500">{formatCurrency(it.price)}</div>
                                    </div>
                                    <button onClick={() => removeFromCart(it.id)} className="text-gray-500">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="mt-2 flex items-center gap-2">
                                    <button
                                        onClick={() => updateQty(it.id, Math.max(0, it.qty - 1))}
                                        className="px-2 py-1 border rounded-md"
                                        aria-label={`Decrease ${it.title}`}
                                    >
                                        -
                                    </button>
                                    <div className="px-3">{it.qty}</div>
                                    <button
                                        onClick={() => updateQty(it.id, it.qty + 1)}
                                        className="px-2 py-1 border rounded-md"
                                        aria-label={`Increase ${it.title}`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">Subtotal</div>
                        <div className="text-lg font-semibold">{formatCurrency(subtotal)}</div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => { clearCart(); onClose(); }}
                            className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                        <button
                            onClick={() => { /* replace with real checkout flow */ alert('Proceeding to checkout (mock)'); }}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartModal;
