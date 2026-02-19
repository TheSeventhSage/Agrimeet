// src/pages/SearchResultsPage.jsx

import Navbar from './components/Navbar';
import SearchProductGrid from './components/SearchProductGrid';
import Footer from './components/Footer'

const SearchResultsPage = () => {
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
            <Footer />
        </div>
    );
};

export default SearchResultsPage;