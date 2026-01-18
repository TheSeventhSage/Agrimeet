// layouts/DashboardLayout.jsx
import { useState } from 'react';
import MultilevelSidebar from '../shared/components/MultilevelSidebar';
import Header from '../shared/components/Header';
import BackgroundArt from '../shared/components/BackgroundArt';

const DashboardLayout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        // BACKGROUND TUNE UP: 
        // Changed to 'bg-green-50/60' for a fresher, organic feel that rhymes with the sidebar
        <div className="min-h-screen relative isolate bg-brand-50/30">

            {/* MINIMAL ART: 
                - Variant='minimal' removes the busy fruits/leaves.
                - Opacity-15 makes the color 'come out a bit more' as requested.
            */}
            <BackgroundArt
                variant="minimal"
                className="opacity-15 pointer-events-none fixed inset-0 -z-10"
            />

            {/* Fixed Sidebar */}
            <MultilevelSidebar isMobileOpen={isMobileMenuOpen} onMobileMenuToggle={toggleMobileMenu} />

            {/* Main Content */}
            <div className="ml-0 lg:ml-64 flex flex-col min-h-screen transition-all duration-300 relative z-0">
                <Header onMobileMenuToggle={toggleMobileMenu} />

                <div className="flex-1 p-3 sm:p-2 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;