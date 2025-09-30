import grainsImg from './assets/categories/grains.png';
import vegetablesImg from './assets/categories/vegetables.png';
import fruitsImg from './assets/categories/fruits.png';
import tubersImg from './assets/categories/tubers.png';
import legumesImg from './assets/categories/legumes.png';
import spicesImg from './assets/categories/spices.png';

import maizeImg from './assets/farmer/maize.png';
import riceImg from './assets/farmer/rice.png';
import tomatoesImg from './assets/farmer/tomatoes.png';
import yamImg from './assets/farmer/yam.png';
import React, { useMemo, useState } from "react";
import { ShoppingCart, Search, Home, User, Wallet, Star, MapPin, CheckCircle2, Plus, Minus, Package, SendHorizonal, Truck, Banknote, Settings, BadgeCheck, Filter, ChevronRight } from "lucide-react";

const colors = { agriGreen: "#003024", freshLime: "#71CB2A", forest: "#07251D", seed: "#F3F8F3", ink: "#333333" };

const CATEGORIES = [
    { id: 1, name: "Grains", img: grainsImg },
    { id: 2, name: "Vegetables", img: vegetablesImg },
    { id: 3, name: "Fruits", img: fruitsImg },
    { id: 4, name: "Tubers", img: tubersImg },
    { id: 5, name: "Legumes", img: legumesImg },
    { id: 6, name: "Spices", img: spicesImg },
];

const PRODUCTS = [
    { id: 1, name: "Maize (50kg)", price: 25000, rating: 4.6, seller: "Ugo Farms", stock: 14, location: "Nsukka", img: maizeImg },
    { id: 2, name: "Yam (10 tubers)", price: 15000, rating: 4.4, seller: "Odogwu Agro", stock: 30, location: "Awka", img: yamImg },
    { id: 3, name: "Rice (50kg)", price: 42000, rating: 4.8, seller: "Delta Rice", stock: 22, location: "Asaba", img: riceImg },
    { id: 4, name: "Tomatoes (crate)", price: 14000, rating: 4.3, seller: "Jos Fresh", stock: 8, location: "Jos", img: tomatoesImg },
];
const formatNaira = (n) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

export default function App() {
    const [role, setRole] = useState("buyer");
    return (
        <div className="min-h-screen w-full" style={{ background: colors.seed }}>
            <Header role={role} onRoleChange={setRole} />
            <main className="max-w-6xl mx-auto p-4 md:p-6">
                {role === "buyer" && <BuyerApp />}
                {role === "seller" && <SellerWeb />}
                {role === "admin" && <AdminWeb />}
            </main>
            <Footer />
        </div>
    );
}

function Header({ role, onRoleChange }) {
    return (
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full" style={{ background: colors.freshLime }} />
                    <span className="font-semibold">AGRIMEET – Mid-Fi Prototype</span>
                </div>
                <nav className="flex gap-1 text-sm">
                    {[
                        { id: "buyer", label: "Buyer (Mobile)" },
                        { id: "seller", label: "Seller (Web)" },
                        { id: "admin", label: "Admin (Web)" },
                    ].map(t => (
                        <button key={t.id}
                            onClick={() => onRoleChange(t.id)}
                            className={`px-3 py-2 rounded-full border ${role === t.id ? "text-white" : "bg-white hover:bg-gray-50"}`}
                            style={{ background: role === t.id ? colors.agriGreen : undefined }}>
                            {t.label}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
}
function Footer() {
    return (
        <footer className="border-t bg-white">
            <div className="max-w-6xl mx-auto p-4 text-xs text-gray-500 flex items-center justify-between">
                <span>© AGRIMEET • Buyer flow, Seller/Admin dashboards, KYC, Paystack & Flutterwave mocks.</span>
                <span style={{ color: colors.agriGreen }}>UI Kit Tokens</span>
            </div>
        </footer>
    );
}

/* ================= Buyer (Mobile) ================= */
function BuyerApp() {
    const [tab, setTab] = useState("home");
    const [cart, setCart] = useState([]);
    const [query, setQuery] = useState("");
    const [detailId, setDetailId] = useState(null);
    const [showPaystack, setShowPaystack] = useState(false);
    const [showFlutterwave, setShowFlutterwave] = useState(false);

    const filtered = useMemo(() => PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())), [query]);
    const selected = PRODUCTS.find(p => p.id === detailId) || null;

    const addToCart = (p) => setCart(c => {
        const i = c.findIndex(x => x.id === p.id);
        if (i >= 0) { const copy = [...c]; copy[i].qty += 1; return copy; }
        return [...c, { ...p, qty: 1 }];
    });
    const inc = (id) => setCart(c => c.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
    const dec = (id) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
    const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

    return (
        <div className="mx-auto w-full max-w-sm">
            <div className="sticky top-[57px] z-30 bg-white/80 backdrop-blur rounded-b-lg border px-3 py-2 flex gap-2 items-center">
                <Search className="h-5 w-5 text-gray-500" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search produce, e.g. maize" className="w-full outline-none text-sm bg-transparent" />
                <button className="text-xs px-2 py-1 rounded-full border hidden sm:block" style={{ borderColor: colors.freshLime, color: colors.agriGreen }}>
                    <Filter className="inline h-3 w-3 mr-1" />Filters
                </button>
            </div>

            {tab === "home" && !selected && (
                <div className="space-y-4 pt-4">
                    <Banner />
                    <CategoryGrid />
                    <Section title="Popular crops" actionLabel="See all">
                        <div className="grid grid-cols-2 gap-3">
                            {filtered.map(p => (
                                <ProductCard key={p.id} p={p} onOpen={() => setDetailId(p.id)} onAdd={() => addToCart(p)} />
                            ))}
                        </div>
                    </Section>
                </div>
            )}

            {selected && (<ProductDetail p={selected} onClose={() => setDetailId(null)} onAdd={() => addToCart(selected)} />)}

            {tab === "orders" && <OrdersPlaceholder />}
            {tab === "wallet" && <WalletPlaceholder />}
            {tab === "profile" && <ProfilePlaceholder onGotoKYC={() => setTab("kyc")} />}
            {tab === "kyc" && <KYCForm onBack={() => setTab("profile")} />}

            <div className="sticky bottom-16 sm:bottom-0 z-30">
                <div className="mx-auto max-w-sm">
                    <div className="m-3 rounded-2xl shadow-lg border bg-white p-3 flex items-center justify-between">
                        <div className="text-sm">Cart • {cart.length} items</div>
                        <div className="font-semibold">{formatNaira(total)}</div>
                        <button className="ml-3 px-3 py-2 rounded-full text-white" style={{ background: colors.agriGreen }} onClick={() => setTab("cart")}>View</button>
                    </div>
                </div>
            </div>

            <nav className="fixed left-0 right-0 bottom-0 border-t bg-white">
                <div className="mx-auto max-w-sm grid grid-cols-5 text-xs">
                    <Tab icon={<Home />} label="Home" active={tab === "home"} onClick={() => setTab("home")} />
                    <Tab icon={<Search />} label="Search" active={false} onClick={() => setTab("home")} />
                    <Tab icon={<Package />} label="Orders" active={tab === "orders"} onClick={() => setTab("orders")} />
                    <Tab icon={<Wallet />} label="Wallet" active={tab === "wallet"} onClick={() => setTab("wallet")} />
                    <Tab icon={<User />} label="Profile" active={tab === "profile" || tab === "kyc"} onClick={() => setTab("profile")} />
                </div>
            </nav>

            {tab === "cart" && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end">
                    <div className="bg-white w-full max-w-sm mx-auto rounded-t-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Your Cart</h3>
                            <button className="text-sm" onClick={() => setTab("home")}>Close</button>
                        </div>
                        <div className="space-y-3 max-h-80 overflow-auto">
                            {cart.map(item => (
                                <div className="flex gap-3 items-center" key={item.id}>
                                    <img src={item.img} className="h-14 w-14 object-cover rounded" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">{item.name}</div>
                                        <div className="text-xs text-gray-500">{formatNaira(item.price)}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1 rounded-full border" onClick={() => dec(item.id)}><Minus className="h-4 w-4" /></button>
                                        <span>{item.qty}</span>
                                        <button className="p-1 rounded-full border" onClick={() => inc(item.id)}><Plus className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            ))}
                            {!cart.length && <div className="text-sm text-gray-500">Your cart is empty.</div>}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="font-semibold">{formatNaira(total)}</div>
                            <button className="px-4 py-2 rounded-full text-white" style={{ background: colors.agriGreen }} onClick={() => setTab("checkout")}>Checkout</button>
                        </div>
                    </div>
                </div>
            )}

            {tab === "checkout" && (
                <Checkout total={total} onClose={() => setTab("home")} onPaystack={() => setShowPaystack(true)} onFlutterwave={() => setShowFlutterwave(true)} />
            )}
            {showPaystack && (<PaystackModal amount={total} onClose={() => setShowPaystack(false)} />)}
            {showFlutterwave && (<FlutterwaveModal amount={total} onClose={() => setShowFlutterwave(false)} />)}
        </div>
    );
}

function Banner() {
    return (
        <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${colors.agriGreen}, ${colors.forest})` }}>
            <div className="text-sm opacity-90">AGRIMEET</div>
            <div className="text-lg font-semibold">Farming pays more when buyers find you directly.</div>
            <div className="mt-2 flex gap-2 text-xs">
                <span className="px-2 py-1 bg-white/10 rounded-full">Verified buyers</span>
                <span className="px-2 py-1 bg-white/10 rounded-full">Secure payments</span>
                <span className="px-2 py-1 bg-white/10 rounded-full">Fair prices</span>
            </div>
        </div>
    );
}
function CategoryGrid() {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Browse categories</h3>
                <a href="#" className="text-xs" style={{ color: colors.agriGreen }}>See all</a>
            </div>
            <div className="grid grid-cols-4 gap-3">
                {CATEGORIES.map(c => (
                    <div key={c.id} className="flex flex-col items-center gap-2">
                        <img src={c.img} alt={c.name} className="h-14 w-14 rounded-xl object-cover border" />
                        <div className="text-xs text-center">{c.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Section({ title, actionLabel, children }) {
    return (
        <section className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">{title}</h3>
                {actionLabel && <a href="#" className="text-xs" style={{ color: colors.agriGreen }}>{actionLabel}</a>}
            </div>
            {children}
        </section>
    );
}
function ProductCard({ p, onOpen, onAdd }) {
    return (
        <div className="rounded-xl overflow-hidden border bg-white hover:shadow-md transition">
            <div className="aspect-[4/3] w-full bg-gray-100">
                <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-3 space-y-1">
                <div className="text-sm font-medium line-clamp-2">{p.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</div>
                <div className="flex items-center justify-between">
                    <div className="font-semibold" style={{ color: colors.agriGreen }}>{formatNaira(p.price)}</div>
                    <div className="text-xs flex items-center gap-1"><Star className="h-3 w-3" /> {p.rating}</div>
                </div>
                <div className="pt-2 flex gap-2">
                    <button onClick={onOpen} className="flex-1 px-3 py-2 rounded-full border">Details</button>
                    <button onClick={onAdd} className="flex-1 px-3 py-2 rounded-full text-white" style={{ background: colors.agriGreen }}>Add</button>
                </div>
            </div>
        </div>
    );
}
function ProductDetail({ p, onClose, onAdd }) {
    return (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center justify-center p-3">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
                <div className="relative aspect-[4/3] bg-gray-100">
                    <img src={p.img} className="h-full w-full object-cover" />
                    <button className="absolute top-2 right-2 px-3 py-1 text-xs rounded-full bg-white/80" onClick={onClose}>Close</button>
                </div>
                <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold" style={{ color: colors.ink }}>{p.name}</h3>
                            <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location} • Stock {p.stock}</div>
                        </div>
                        <div className="font-semibold" style={{ color: colors.agriGreen }}>{formatNaira(p.price)}</div>
                    </div>
                    <div className="text-xs text-gray-600">Grown with care, graded for export. Moisture &lt; 12%. Delivery in 48–72h.</div>
                    <div className="pt-2 flex gap-2">
                        <button className="flex-1 px-3 py-2 rounded-full border">Message seller</button>
                        <button onClick={onAdd} className="flex-1 px-3 py-2 rounded-full text-white" style={{ background: colors.agriGreen }}>
                            <ShoppingCart className="inline h-4 w-4 mr-1" /> Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
function OrdersPlaceholder() {
    return (
        <div className="pt-6 space-y-3">
            <h3 className="font-semibold">Orders</h3>
            <div className="rounded-xl border bg-white p-4 flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium">#A-2031 • Processing</div>
                    <div className="text-xs text-gray-500">Maize 2 × • Placed 2d ago</div>
                </div>
                <Truck className="h-5 w-5 text-gray-500" />
            </div>
            <div className="rounded-xl border bg-white p-4 flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium">#A-1982 • Delivered</div>
                    <div className="text-xs text-gray-500">Rice 1 × • Delivered 6d ago</div>
                </div>
                <CheckCircle2 className="h-5 w-5" style={{ color: colors.freshLime }} />
            </div>
        </div>
    );
}
function WalletPlaceholder() {
    return (
        <div className="pt-6 space-y-3">
            <h3 className="font-semibold">Wallet</h3>
            <div className="rounded-2xl p-5 text-white" style={{ background: colors.agriGreen }}>
                <div className="opacity-80 text-xs">Available balance</div>
                <div className="text-2xl font-semibold">{formatNaira(42500)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button className="rounded-xl border bg-white p-3 text-sm flex items-center justify-center gap-2"><Banknote className="h-4 w-4" /> Fund</button>
                <button className="rounded-xl border bg-white p-3 text-sm flex items-center justify-center gap-2"><SendHorizonal className="h-4 w-4" /> Withdraw</button>
            </div>
        </div>
    );
}
function ProfilePlaceholder({ onGotoKYC }) {
    return (
        <div className="pt-6 space-y-3">
            <h3 className="font-semibold">Profile</h3>
            <div className="rounded-xl border bg-white p-4">
                <div className="font-medium">Amos</div>
                <div className="text-xs text-gray-500">+234 81 0000 0000 • Awka</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <button onClick={onGotoKYC} className="rounded-xl border bg-white p-3 flex items-center justify-center gap-2"><BadgeCheck className="h-4 w-4" /> KYC</button>
                <button className="rounded-xl border bg-white p-3 flex items-center justify-center gap-2"><Settings className="h-4 w-4" /> Settings</button>
            </div>
        </div>
    );
}
function Tab({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`h-14 flex flex-col items-center justify-center ${active ? "" : "text-gray-500"}`} style={{ color: active ? colors.agriGreen : undefined }}>
            <div className="h-5 w-5">{icon}</div>
            <span className="text-[10px]">{label}</span>
        </button>
    );
}
function Checkout({ total, onClose, onPaystack, onFlutterwave }) {
    return (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur flex items-center justify-center p-3">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
                <div className="p-4 border-b font-semibold">Checkout</div>
                <div className="p-4 space-y-3 text-sm">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Address</div>
                        <div className="rounded-xl border p-3">No. 10 Market Rd, Awka</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Delivery</div>
                        <div className="flex gap-2">
                            <button className="px-3 py-2 rounded-full border bg-white">Standard</button>
                            <button className="px-3 py-2 rounded-full border">Express</button>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Payment</div>
                        <div className="grid grid-cols-4 gap-2">
                            <button className="px-3 py-2 rounded-xl border bg-white text-xs">Wallet</button>
                            <button className="px-3 py-2 rounded-xl border bg-white text-xs" onClick={onPaystack}>Paystack</button>
                            <button className="px-3 py-2 rounded-xl border bg-white text-xs" onClick={onFlutterwave}>Flutterwave</button>
                            <button className="px-3 py-2 rounded-xl border bg-white text-xs">Transfer</button>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t flex items-center justify-between">
                    <div className="font-semibold">{formatNaira(total)}</div>
                    <button className="px-4 py-2 rounded-full text-white" style={{ background: colors.agriGreen }} onClick={onClose}>Place order</button>
                </div>
            </div>
        </div>
    );
}
function KYCForm({ onBack }) {
    return (
        <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">KYC Verification</h3>
                <button className="text-sm" style={{ color: colors.agriGreen }} onClick={onBack}>Back</button>
            </div>
            <div className="rounded-2xl border bg-white p-4 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                    <Field label="Full name" placeholder="Surname First" />
                    <Field label="BVN (optional)" placeholder="11 digits" />
                    <Field label="NIN" placeholder="National Identification Number" />
                    <Field label="Date of birth" placeholder="YYYY-MM-DD" />
                    <Field label="Address" placeholder="House / Street / City" />
                    <div>
                        <div className="text-xs text-gray-500 mb-1">ID Document</div>
                        <div className="rounded-xl border border-dashed p-6 text-center text-sm">Drop or click to upload (JPEG/PNG/PDF)</div>
                    </div>
                </div>
                <button className="px-4 py-2 rounded-full text-white" style={{ background: colors.agriGreen }}>Submit for review</button>
            </div>
        </div>
    );
}
function Field({ label, placeholder }) {
    return (
        <label className="text-sm">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <input placeholder={placeholder} className="w-full rounded-xl border px-3 py-2" />
        </label>
    );
}
function PaystackModal({ amount, onClose }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="font-semibold">Pay with Paystack</div>
                    <button className="text-sm" onClick={onClose}>Close</button>
                </div>
                <div className="p-4 space-y-3 text-sm">
                    <div className="rounded-xl border p-3">Amount: <span className="font-semibold">{formatNaira(amount)}</span></div>
                    <label className="text-sm"><div className="text-xs text-gray-500 mb-1">Card number</div><input className="w-full rounded-xl border px-3 py-2" placeholder="XXXX XXXX XXXX XXXX" /></label>
                    <div className="grid grid-cols-2 gap-2">
                        <label className="text-sm"><div className="text-xs text-gray-500 mb-1">Expiry</div><input className="w-full rounded-xl border px-3 py-2" placeholder="MM/YY" /></label>
                        <label className="text-sm"><div className="text-xs text-gray-500 mb-1">CVV</div><input className="w-full rounded-xl border px-3 py-2" placeholder="***" /></label>
                    </div>
                    <button className="w-full px-4 py-2 rounded-full text-white" style={{ background: colors.agriGreen }}>Pay {formatNaira(amount)}</button>
                    <div className="text-[10px] text-gray-500 text-center">Prototype mock of Paystack modal for UI/UX review.</div>
                </div>
            </div>
        </div>
    );
}
function FlutterwaveModal({ amount, onClose }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="font-semibold">Pay with Flutterwave</div>
                    <button className="text-sm" onClick={onClose}>Close</button>
                </div>
                <div className="p-4 space-y-3 text-sm">
                    <div className="rounded-xl border p-3">Amount: <span className="font-semibold">{formatNaira(amount)}</span></div>
                    <label className="text-sm"><div className="text-xs text-gray-500 mb-1">Card number</div><input className="w-full rounded-xl border px-3 py-2" placeholder="XXXX XXXX XXXX XXXX" /></label>
                    <div className="grid grid-cols-2 gap-2">
                        <label className="text-sm"><div className="text-xs text-gray-500 mb-1">Expiry</div><input className="w-full rounded-xl border px-3 py-2" placeholder="MM/YY" /></label>
                        <label className="text-sm"><div className="text-xs text-gray-500 mb-1">CVV</div><input className="w-full rounded-xl border px-3 py-2" placeholder="***" /></label>
                    </div>
                    <button className="w-full px-4 py-2 rounded-full text-white" style={{ background: colors.agriGreen }}>Pay {formatNaira(amount)}</button>
                    <div className="text-[10px] text-gray-500 text-center">Prototype mock of Flutterwave modal for UI/UX review.</div>
                </div>
            </div>
        </div>
    );
}

/* ================= Seller (Web) ================= */
function SellerWeb() {
    return (
        <div className="grid md:grid-cols-[220px_1fr] gap-4">
            <aside className="rounded-2xl p-4 text-sm text-white" style={{ background: colors.forest }}>
                <div className="font-semibold mb-4">Seller</div>
                <ul className="space-y-2">
                    {["Dashboard", "Products", "Orders", "Messages", "Analytics", "Payouts", "KYC", "Settings"].map(t => (
                        <li key={t} className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2">
                            <span>{t}</span><ChevronRight className="h-4 w-4 opacity-60" />
                        </li>
                    ))}
                </ul>
            </aside>
            <section className="space-y-4">
                <div className="grid md:grid-cols-3 gap-3">
                    <KPI title="Sales Today" value={formatNaira(850000)} />
                    <KPI title="Orders" value={42} />
                    <KPI title="Balance" value={formatNaira(230000)} />
                </div>
                <div className="rounded-2xl border bg-white p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Products</h3>
                        <button className="px-3 py-2 rounded-full text-white" style={{ background: colors.agriGreen }}>+ Add Product</button>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-[640px] w-full text-sm">
                            <thead>
                                <tr className="bg-[var(--seed)]" style={{ "--seed": colors.seed }}>
                                    {['Image', 'Name', 'SKU', 'Stock', 'Price', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {PRODUCTS.map(p => (
                                    <tr key={p.id} className="odd:bg-white even:bg-[var(--seed)]" style={{ "--seed": "#fafdfb" }}>
                                        <td className="px-3 py-2"><img src={p.img} className="h-10 w-10 rounded object-cover" /></td>
                                        <td className="px-3 py-2 font-medium">{p.name}</td>
                                        <td className="px-3 py-2">SKU-{p.id}</td>
                                        <td className="px-3 py-2">{p.stock}</td>
                                        <td className="px-3 py-2">{formatNaira(p.price)}</td>
                                        <td className="px-3 py-2"><span className="px-2 py-1 rounded-full text-xs" style={{ background: colors.seed, color: colors.agriGreen }}>Active</span></td>
                                        <td className="px-3 py-2 space-x-2"><button className="px-2 py-1 rounded border">Edit</button><button className="px-2 py-1 rounded border">Hide</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
function KPI({ title, value }) {
    return (
        <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${colors.agriGreen}, ${colors.forest})` }}>
            <div className="text-xs opacity-80">{title}</div>
            <div className="text-xl font-semibold">{value}</div>
        </div>
    );
}

/* ================= Admin (Web) ================= */
function AdminWeb() {
    const [showKyc, setShowKyc] = useState(false);
    return (
        <div className="grid md:grid-cols-[240px_1fr] gap-4">
            <aside className="rounded-2xl p-4 text-sm text-white" style={{ background: colors.agriGreen }}>
                <div className="font-semibold mb-4">Admin</div>
                <ul className="space-y-2">
                    {['Dashboard', 'Users', 'Sellers (KYC)', 'Products', 'Orders', 'Transactions', 'Disputes', 'Reports'].map(t => (
                        <li key={t} className="flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2">
                            <span>{t}</span><ChevronRight className="h-4 w-4 opacity-80" />
                        </li>
                    ))}
                </ul>
            </aside>
            <section className="space-y-4">
                <div className="grid md:grid-cols-3 gap-3">
                    <KPI title="Total GMV" value={formatNaira(422000000)} />
                    <KPI title="Active Users" value={"18,240"} />
                    <div className="rounded-2xl p-4 bg-yellow-50 border text-yellow-800">
                        <div className="text-xs">Pending KYC</div>
                        <div className="text-xl font-semibold">24</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border bg-white p-4">
                        <div className="font-semibold mb-2">KYC Approvals</div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-none">
                                <div className="text-sm">Seller #{100 + i} • ID uploaded</div>
                                <div className="space-x-2">
                                    <button className="px-2 py-1 rounded border" onClick={() => setShowKyc(true)}>View</button>
                                    <button className="px-2 py-1 rounded border">Reject</button>
                                    <button className="px-2 py-1 rounded text-white" style={{ background: colors.agriGreen }}>Approve</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border bg-white p-4">
                        <div className="font-semibold mb-2">Product Moderation</div>
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-none">
                                <div className="text-sm">New listing • Photos & description</div>
                                <div className="space-x-2">
                                    <button className="px-2 py-1 rounded border">Reject</button>
                                    <button className="px-2 py-1 rounded text-white" style={{ background: colors.agriGreen }}>Approve</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {showKyc && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
                    <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden">
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="font-semibold">KYC Review – Seller #123</div>
                            <button className="text-sm" onClick={() => setShowKyc(false)}>Close</button>
                        </div>
                        <div className="p-4 grid md:grid-cols-2 gap-4">
                            <div className="rounded-xl border p-3">
                                <div className="text-xs text-gray-500 mb-2">ID Document</div>
                                <div className="h-48 bg-gray-100 rounded" />
                            </div>
                            <div className="space-y-2 text-sm">
                                <Field label="Full name" placeholder="Ugochukwu Ani" />
                                <Field label="NIN" placeholder="1234-5678-9012" />
                                <Field label="Address" placeholder="No. 10 Market Rd, Awka" />
                                <div className="pt-2 space-x-2">
                                    <button className="px-3 py-2 rounded border">Reject</button>
                                    <button className="px-3 py-2 rounded text-white" style={{ background: colors.agriGreen }}>Approve</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

