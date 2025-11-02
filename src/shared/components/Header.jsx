import { Search, ShoppingBag, Moon, Menu } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { LogoDark } from './Logo';
import UserDropdown from './UserDropdown';

const Header = ({ onMobileMenuToggle }) => {
    return (
        <div className="relative bg-white border-b border-gray-200 px-4 py-2 lg:px-6">
            <div className="flex items-center justify-between">
                {/* Mobile Menu Button & Logo */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMobileMenuToggle}
                        className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Logo */}
                    {/* <div className="flex items-center gap-3">
                        <LogoDark />
                    </div> */}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Search - Hidden on mobile */}
                    {/* <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent w-48 lg:w-64"
                        />
                    </div> */}

                    {/* Icons */}
                    <div className="flex items-center gap-3">
                        {/* <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <Moon className="w-5 h-5" />
                        </button> */}
                        <NotificationDropdown />
                        <UserDropdown />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
