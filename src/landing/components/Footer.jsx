import { useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { showSuccess, showError } from "../../shared/utils/alert";

const Footer = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        // mock API call
        if (!email || !email.includes("@")) {
            showError("Please enter a valid email address");
            return;
        }

        // simulate success
        setTimeout(() => {
            showSuccess("Thanks! You're subscribed.");
            setEmail("");
        }, 600);
    };

    return (
        <footer className="bg-brand-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-green-400">AgriMeet</h3>
                        <p className="mt-4 text-gray-400">Connecting farmers and buyers for a sustainable agricultural future.</p>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-green-400">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-green-400">
                                <Twitter className="w-6 h-6" />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-green-400">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-green-400">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold">Quick Links</h4>
                        <ul className="mt-4 space-y-2">
                            {["About Us", "Marketplace", "Farmers", "Contact", "FAQ"].map((item) => (
                                <li key={item}><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold">Categories</h4>
                        <ul className="mt-4 space-y-2">
                            {["Vegetables", "Fruits", "Dairy", "Grains", "Meat", "Spices"].map((item) => (
                                <li key={item}><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold">Newsletter</h4>
                        <p className="mt-4 text-gray-400">Subscribe to get updates on new products and features.</p>
                        <form className="mt-4 flex" onSubmit={handleSubscribe}>
                            <label htmlFor="footer-email" className="sr-only">Email</label>
                            <input
                                id="footer-email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                            <button type="submit" className="bg-green-600 px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors">Subscribe</button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} AgriMeet. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
