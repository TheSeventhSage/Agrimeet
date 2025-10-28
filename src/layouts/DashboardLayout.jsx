import { useState } from 'react';
import MultilevelSidebar from '../shared/components/MultilevelSidebar';
import Header from '../shared/components/Header';

const DashboardLayout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Sidebar */}
            <MultilevelSidebar isMobileOpen={isMobileMenuOpen} onMobileMenuToggle={toggleMobileMenu} />

            {/* Main Content - Offset by sidebar width */}
            <div className="ml-0 lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
                {/* Header */}
                <Header onMobileMenuToggle={toggleMobileMenu} />

                {/* Content */}
                <div className="flex-1 p-3 sm:p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
