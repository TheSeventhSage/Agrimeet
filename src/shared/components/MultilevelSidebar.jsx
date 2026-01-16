import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogoMerge } from './Logo';
import { storageManager } from '../utils/storageManager';

import {
    Home,
    User,
    Package,
    ShoppingCart,
    MessageSquare,
    Wallet,
    Settings,
    ChevronRight,
    Plus,
    Star,
    Users,
    FileCheck,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    ScrollText,
    ShieldCheck,
    HelpCircle,
    ArrowLeftRight,
    Scale,
    HandCoins,
    ShoppingBag,
    X,
} from 'lucide-react';

const MultilevelSidebar = ({ isMobileOpen, onMobileMenuToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState({});
    const user = storageManager.getUserData();

    // Normalize roles
    const userRoles = Array.isArray(user?.roles)
        ? user.roles
        : user?.role
            ? [user.role]
            : [];

    const isAdmin = userRoles.includes('admin');
    const isSeller = userRoles.includes('seller');

    // --- MENU CONFIGURATIONS (Same as before) ---
    const sellerMenuItems = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            path: '/seller/dashboard'
        },
        {
            key: 'products',
            label: 'Products',
            icon: Package,
            hasSubmenu: true,
            submenu: [
                { key: 'all-products', label: 'All Products', icon: Package, path: '/seller/products' },
                { key: 'add-product', label: 'Add Product', icon: Plus, path: '/seller/products/create' },
                { key: 'reviews', label: 'Reviews', icon: Star, path: '/seller/reviews' }
            ]
        },
        {
            key: 'orders',
            label: 'Orders',
            icon: ShoppingCart,
            path: '/seller/orders'
        },
        {
            key: 'wallet',
            label: 'Wallet & Payouts',
            icon: Wallet,
            path: '/seller/wallet'
        },
        {
            key: 'messages',
            label: 'Messages',
            icon: MessageSquare,
            path: '/seller/messages'
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/seller/settings'
        }
    ];

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
            label: 'Seller Management',
            icon: FileCheck,
            path: '/admin/seller'
        },
        {
            key: 'marketplace',
            label: 'Marketplace',
            icon: ShoppingBag,
            hasSubmenu: true,
            submenu: [
                {
                    key: 'product-overview',
                    label: 'Product Overview',
                    icon: Package,
                    path: '/admin/products'
                },
                {
                    key: 'orders',
                    label: 'Order Overview',
                    icon: ShoppingCart,
                    path: '/admin/orders'
                },
            ],
        },
        {
            key: 'finance',
            label: 'Finance',
            icon: DollarSign,
            hasSubmenu: true,
            submenu: [
                {
                    key: 'transactions',
                    label: 'Transactions',
                    icon: ArrowLeftRight,
                    path: '/admin/transactions'
                },
                {
                    key: 'commissions',
                    label: 'Commissions',
                    icon: HandCoins,
                    path: '/admin/commissions'
                }
            ]
        },
        {
            key: 'support',
            label: 'Support & Disputes',
            icon: AlertTriangle,
            hasSubmenu: true,
            submenu: [
                {
                    key: 'disputes',
                    label: 'Dispute Management',
                    icon: AlertTriangle,
                    path: '/admin/disputes'
                },
            ]
        },
        {
            key: 'reports',
            label: 'Reports & Analytics',
            icon: TrendingUp,
            path: '/admin/reports'
        },
        {
            key: 'content-legal',
            label: 'Content & Legal',
            icon: Scale,
            hasSubmenu: true,
            submenu: [
                {
                    key: 'policies',
                    label: 'Privacy Policy',
                    icon: ShieldCheck,
                    path: '/admin/privacy-policy'
                },
                {
                    key: 'terms-of-service',
                    label: 'Terms Of Service',
                    icon: ScrollText,
                    path: '/admin/terms-of-service'
                },
                {
                    key: 'faqs',
                    label: 'FAQs',
                    icon: HelpCircle,
                    path: '/admin/faqs',
                }
            ],
        },
        {
            key: 'settings',
            label: 'Product Settings',
            icon: Settings,
            path: '/admin/settings'
        }
    ];

    const buyerMenuItems = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            path: '/dashboard'
        },
        {
            key: 'orders',
            label: 'My Orders',
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
            key: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/settings'
        }
    ];

    const getMenuItems = () => {
        if (isAdmin) return adminMenuItems;
        if (isSeller) return sellerMenuItems;
        return buyerMenuItems;
    };

    const menuItems = getMenuItems();

    // Helper: Check if path is active
    const isActive = (path) => {
        if (!path) return false;
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Helper: Check if parent has active child
    const isParentActive = (item) => {
        if (!item.submenu) return false;
        return item.submenu.some(sub => isActive(sub.path));
    };

    // Auto-expand menu on load/nav
    useEffect(() => {
        const newExpanded = { ...expandedItems };
        menuItems.forEach(item => {
            if (item.hasSubmenu && isParentActive(item)) {
                newExpanded[item.key] = true;
            }
        });
        setExpandedItems(newExpanded);
    }, [location.pathname]);

    const toggleExpanded = (itemKey) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemKey]: !prev[itemKey]
        }));
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-sidebar-950/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onMobileMenuToggle}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed top-0 left-0 h-full w-64 z-50
                bg-sidebar-950 text-sidebar-300 border-r border-sidebar-900
                transform transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-900 bg-sidebar-950">
                    <LogoMerge className="text-white" />
                    <button
                        onClick={onMobileMenuToggle}
                        className="lg:hidden p-1 hover:bg-sidebar-900 rounded-lg text-sidebar-400"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
                    {menuItems.map((item) => {
                        const active = isActive(item.path);
                        const parentActive = isParentActive(item);
                        const expanded = expandedItems[item.key];

                        return (
                            <div key={item.key} className="mb-1">
                                {/* Parent Item */}
                                <button
                                    onClick={() => {
                                        if (item.hasSubmenu) {
                                            toggleExpanded(item.key);
                                        } else {
                                            navigate(item.path);
                                            if (isMobileOpen) onMobileMenuToggle();
                                        }
                                    }}
                                    className={`
                                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group
                                        ${active && !item.hasSubmenu
                                            ? 'bg-sidebar-800 text-white shadow-lg shadow-sidebar-950/50 border border-sidebar-700/50' // Active Single Item
                                            : parentActive
                                                ? 'bg-sidebar-900/40 text-sidebar-100' // Parent of active child
                                                : 'text-sidebar-200 hover:bg-sidebar-900 hover:text-sidebar-100' // Inactive
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`w-5 h-5 ${active || parentActive
                                            ? 'text-sidebar-400'
                                            : 'text-sidebar-200 group-hover:text-sidebar-400'
                                            }`} />
                                        <span className="font-medium text-sm tracking-wide">{item.label}</span>
                                    </div>
                                    {item.hasSubmenu && (
                                        <ChevronRight
                                            className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-90 text-sidebar-100' : 'text-sidebar-600'
                                                }`}
                                        />
                                    )}
                                </button>

                                {/* Submenu Items */}
                                {item.hasSubmenu && (
                                    <div className={`
                                        overflow-hidden transition-all duration-300 ease-in-out space-y-1
                                        ${expanded ? 'max-h-96 mt-1 opacity-100' : 'max-h-0 opacity-0'}
                                    `}>
                                        {item.submenu.map((subItem) => {
                                            const isSubActive = isActive(subItem.path);
                                            return (
                                                <button
                                                    key={subItem.key}
                                                    onClick={() => {
                                                        navigate(subItem.path);
                                                        if (isMobileOpen) onMobileMenuToggle();
                                                    }}
                                                    className={`
                                                        w-full flex items-center gap-3 px-3 py-2 pl-11 rounded-lg text-sm transition-colors duration-150 relative
                                                        ${isSubActive
                                                            ? 'text-sidebar-100 bg-sidebar-800/50 font-medium'
                                                            : 'text-sidebar-200 hover:text-sidebar-200 hover:bg-sidebar-900/30'
                                                        }
                                                    `}
                                                >
                                                    {/* Active Indicator Line/Dot */}
                                                    {isSubActive && (
                                                        <div className="absolute left-4 w-1.5 h-1.5 rounded-full bg-sidebar-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                                    )}

                                                    <span>{subItem.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* User Info Footer */}
                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-sidebar-900 bg-sidebar-950">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 bg-sidebar-800 rounded-full flex items-center justify-center border border-sidebar-700 shadow-inner">
                            <span className="text-sm font-bold text-sidebar-200">
                                {user?.data?.first_name?.charAt(0) || user?.user?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-sidebar-100 truncate">
                                {user?.data?.first_name || user?.user || 'User'}
                            </p>
                            <p className="text-xs text-sidebar-500 truncate capitalize">
                                {isAdmin ? 'Administrator' : isSeller ? 'Seller Account' : 'Customer'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MultilevelSidebar;