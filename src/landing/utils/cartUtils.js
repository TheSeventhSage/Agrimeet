// utils/cartUtils.js
const KEY = "agrimeet_cart_v1";

function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
}
function write(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("agrimeet:cart:updated", { detail: { count: cartCount(cart) } }));
}

export function cartCount(cart = null) {
    const c = (cart || read()).reduce((s, i) => s + (i.qty || 0), 0);
    return c;
}

export function getCart() { return read(); }

export function clearCart() { write([]); }

export function addToCart(product, qty = 1) {
    if (!product || !product.id) throw new Error("Product must have an id");
    const cart = read();
    const idx = cart.findIndex(p => p.id === product.id);
    if (idx === -1) cart.push({ ...product, qty });
    else cart[idx].qty = (cart[idx].qty || 0) + qty;
    write(cart);
    return cart;
}

export function removeFromCart(productId) {
    const cart = read().filter(p => p.id !== productId);
    write(cart);
    return cart;
}

export function updateQty(productId, qty) {
    const cart = read().map(p => p.id === productId ? { ...p, qty: Math.max(0, qty) } : p).filter(p => p.qty > 0);
    write(cart);
    return cart;
}
