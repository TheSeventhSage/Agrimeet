import { useState } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import Button from "../../shared/components/Button";
import SimpleCart from "./SimpleCart";


const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigation = [
        { name: "Home", href: "#" },
        { name: "Marketplace", href: "#marketplace" },
        { name: "Farmers", href: "#farmers" },
        { name: "About", href: "#about" },
        { name: "Contact", href: "#contact" },
    ];

    return (
        <header className="bg-white shadow-xs sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <a href="#" className="inline-flex items-center gap-2">
                            <span className="rounded-md w-9 h-9 bg-green-600 flex items-center justify-center text-white font-bold">A</span>
                            <span className="text-2xl font-bold text-green-600">AgriMeet</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex md:items-center md:space-x-8" aria-label="Primary">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    {/* Right side actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button aria-label="Search" className="p-2 text-gray-600 hover:text-green-600">
                            <Search className="w-5 h-5" />
                        </button>

                        <SimpleCart />

                        <Button size="sm" className="px-3 py-1">Sign In</Button>
                        <Button variant="primary" size="sm" className="px-3 py-1">Sign Up</Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen((s) => !s)}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="p-2 text-gray-600"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <nav
                    id="mobile-menu"
                    className={`md:hidden mt-2 transition-all origin-top ${isMenuOpen ? "block" : "hidden"}`}
                    aria-label="Mobile"
                >
                    <div className="px-2 pt-2 pb-3 bg-white border-t space-y-1">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium rounded-md"
                            >
                                {item.name}
                            </a>
                        ))}

                        <div className="pt-4 space-y-2">
                            <Button className="w-full">Sign In</Button>
                            <Button variant="primary" className="w-full">Sign Up</Button>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
