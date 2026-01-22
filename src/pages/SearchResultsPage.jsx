// src/pages/SearchResultsPage.jsx

import Navbar from './components/Navbar'; // Adjust path if needed
import SearchProductGrid from './components/SearchProductGrid'; // Import the new component
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

const SearchResultsPage = () => {
    // This component is now much simpler.
    // It just provides the page layout (Navbar, content area, Footer).
    // The SearchProductGrid component handles all the logic for fetching and displaying results.

    return (
        <div className="">
            <Navbar />

            {/* Main Content */}
            <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8" id="products">
                    {/* Use the new, self-contained search component */}
                    <SearchProductGrid />
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100">
                <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* ... (Your existing footer content) ... */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Contact Us
                            </h4>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>hello@agrimeet.com</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>123 Farm Lane, AgriTown</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 mt-8 pt-8 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            © {new Date().getFullYear()} AgriMeet. All rights reserved.
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="/terms" className="hover:text-green-600">
                                Terms
                            </a>
                            <a href="/privacy-policy" className="hover:text-green-600">
                                Privacy
                            </a>
                            <a href="/faqs" className="hover:text-green-600">
                                FAQ's
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SearchResultsPage;