// components/cart/SimpleCart.jsx
import React, { useEffect, useState } from "react";
import { getCart, cartCount, removeFromCart, updateQty, clearCart } from "../utils/cartUtils";
import { ShoppingCart, Trash } from "lucide-react";

/*
Usage:
- Put <SimpleCart /> in your Header (or anywhere).
- Call addToCart({ id, title, price, image }, qty) from product buttons.
*/

const fmt = n => `$${Number(n || 0).toFixed(2)}`;

export default function SimpleCart() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(getCart());
    const [count, setCount] = useState(cartCount(items));

    useEffect(() => {
        const handler = (e) => {
            const c = getCart();
            setItems(c);
            setCount(cartCount(c));
            if (e?.detail?.count === 0) setOpen(false);
        };
        // initial sync
        handler();
        window.addEventListener("agrimeet:cart:updated", handler);
        return () => window.removeEventListener("agrimeet:cart:updated", handler);
    }, []);

    const subtotal = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0);

    return (
        <div className="relative">
            {/* Cart button */}
            <button
                onClick={() => setOpen(v => !v)}
                className="relative inline-flex items-center p-2 bg-white border rounded-md shadow-xs hover:bg-gray-50"
                aria-expanded={open}
                aria-label="Open cart"
            >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {count}
                    </span>
                )}
            </button>

            {/* Simple drawer (no portal) */}
            <div className={`origin-top-right absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-40 transform transition-all ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Your Cart</h4>
                        <button onClick={() => { clearCart(); setItems([]); setCount(0); }} className="text-sm text-red-500">Clear</button>
                    </div>

                    <div className="max-h-56 overflow-y-auto divide-y">
                        {items.length === 0 && <div className="py-6 text-center text-gray-500">No items yet.</div>}
                        {items.map(it => (
                            <div key={it.id} className="py-3 flex items-start gap-3">
                                <img src={it.image || "/api/placeholder/80/80"} alt={it.title} className="w-12 h-12 rounded-md object-cover" />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium text-sm">{it.title}</div>
                                            <div className="text-xs text-gray-500">{fmt(it.price)}</div>
                                        </div>
                                        <button onClick={() => { removeFromCart(it.id); const c = getCart(); setItems(c); setCount(cartCount(c)); }} className="text-gray-400">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2">
                                        <button onClick={() => { updateQty(it.id, (it.qty || 1) - 1); const c = getCart(); setItems(c); setCount(cartCount(c)); }} className="px-2 py-1 border rounded-sm">-</button>
                                        <div className="px-3 text-sm">{it.qty || 1}</div>
                                        <button onClick={() => { updateQty(it.id, (it.qty || 1) + 1); const c = getCart(); setItems(c); setCount(cartCount(c)); }} className="px-2 py-1 border rounded-sm">+</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 border-t pt-3">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-sm text-gray-600">Subtotal</div>
                            <div className="font-semibold">{fmt(subtotal)}</div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => { /* replace with real checkout */ alert('Checkout (mock)'); }} className="flex-1 px-3 py-2 bg-green-600 text-white rounded-sm">Checkout</button>
                            <button onClick={() => { setOpen(false); }} className="px-3 py-2 border rounded-sm">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
