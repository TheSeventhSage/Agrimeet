import { useState } from 'react';
import { LogoMerge } from './Logo';
import { storageManager } from '../../pages/utils/storageManager';

import {
    Home,
    User,
    Package,
    ShoppingCart,
    MessageSquare,
    BarChart3,
    Wallet,
    FileText,
    Settings,
    ChevronRight,
    Plus,
    Eye,
    Edit,
    Menu,
    X,
    Users,
    Shield,
    FileCheck,
    DollarSign,
    AlertTriangle,
    TrendingUp
} from 'lucide-react';

const MultilevelSidebar = ({ isMobileOpen, onMobileMenuToggle }) => {
    const [expandedItems, setExpandedItems] = useState({});
    const user = storageManager.getUserData();

    const toggleExpanded = (itemKey) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemKey]: !prev[itemKey]
        }));
    };

    // Normalize roles to handle both 'role' (string) and 'roles' (array)
    const userRoles = user?.roles 
        ? (Array.isArray(user.roles) ? user.roles : [user.roles])
        : (user?.role ? [user.role] : []);
    
    // Check if user is admin or seller
    const isAdmin = userRoles.includes('admin');
    const isSeller = userRoles.includes('seller');

    // Admin menu items
    const adminMenuItems = [
        {
            key: 'admin-dashboard',
            label: 'Dashboard',
            icon: Home,
            path: '/admin/dashboard'
        },
        {
            key: 'user-management',
            label: 'User Management',
            icon: Users,
            path: '/admin/users'
        },
        {
            key: 'seller-approval',
            label: 'Seller Approval',
            icon: FileCheck,
            path: '/admin/seller-approval'
        },
        {
            key: 'product-moderation',
            label: 'Product Moderation',
            icon: Package,
            path: '/admin/products'
        },
        {
            key: 'transactions',
            label: 'Transactions',
            icon: DollarSign,
            path: '/admin/transactions'
        },
        {
            key: 'disputes',
            label: 'Dispute Management',
            icon: AlertTriangle,
            path: '/admin/disputes'
        },
        {
            key: 'reports',
            label: 'Reports & Analytics',
            icon: TrendingUp,
            path: '/admin/reports'
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/settings'
        },
    ];

    // Seller menu items
    const menuItems = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            path: '/dashboard'
        },
        {
            key: 'products',
            label: 'Products',
            icon: Package,
            hasSubmenu: true,
            submenu: [
                {
                    key: 'view-products',
                    label: 'View Products',
                    icon: Eye,
                    path: '/products'
                },
                {
                    key: 'add-product',
                    label: 'Add Product',
                    icon: Plus,
                    path: '/products/add'
                },
            ],
        },
        {
            key: 'orders',
            label: 'Orders',
            icon: ShoppingCart,
            path: '/orders'
        },
        {
            key: 'messages',
            label: 'Messages',
            icon: MessageSquare,
            path: '/messages'
        },
        {
            key: 'analytics',
            label: 'Analytics',
            icon: BarChart3,
            path: '/analytics'
        },
        {
            key: 'payouts',
            label: 'Payouts',
            icon: Wallet,
            path: '/payouts'
        },
        {
            key: 'kyc',
            label: 'KYC',
            icon: FileText,
            path: '/kyc'
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/settings'
        },
    ];

    const handleItemClick = (item) => {
        if (item.hasSubmenu) {
            toggleExpanded(item.key);
        } else {
            window.location.href = item.path;
            // Close mobile menu on navigation
            onMobileMenuToggle();
        }
    };

    const handleSubmenuClick = (subItem) => {
        window.location.href = subItem.path;
        // Close mobile menu on navigation
        onMobileMenuToggle();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileMenuToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`
                w-64 bg-sidebar-900 text-white h-screen fixed left-0 top-0 z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                shadow-xl lg:shadow-none
            `}>
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-brand-800">
                    <h1 className="text-lg font-bold text-brand-400">Agrimeet</h1>
                    <button
                        onClick={onMobileMenuToggle}
                        className="p-2 hover:bg-sidebar-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Logo */}
                <div className="pe-2 ps-5 py-6 border-b border-gray-50 hidden lg:block">
                    <LogoMerge />
                </div>

                {/* Menu Items */}
                <nav className="mt-6">
                    {(isAdmin ? adminMenuItems : menuItems).map((item) => (
                        <div key={item.key}>
                            {/* Main Menu Item */}
                            <button
                                onClick={() => handleItemClick(item)}
                                className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-sidebar-800 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                {item.hasSubmenu && (
                                    <ChevronRight
                                        className={`w-4 h-4 transition-transform ${expandedItems[item.key] ? 'rotate-90' : ''
                                            }`}
                                    />
                                )}
                            </button>

                            {/* Submenu */}
                            {item.hasSubmenu && expandedItems[item.key] && (
                                <div className="bg-sidebar-800">
                                    {item.submenu.map((subItem) => (
                                        <button
                                            key={subItem.key}
                                            onClick={() => handleSubmenuClick(subItem)}
                                            className="w-full flex items-center gap-3 px-12 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            <subItem.icon className="w-4 h-4" />
                                            <span>{subItem.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">JD</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-400">
                                {isAdmin ? 'Admin' : isSeller ? 'Seller' : 'User'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MultilevelSidebar;
