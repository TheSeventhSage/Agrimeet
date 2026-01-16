import { useState } from 'react';
import { LogoMerge } from './Logo';
import { storageManager } from '../utils/storageManager';
import Button from './Button';

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
    HandCoins,
    X,
    MessageCircle,
    Star,
    Users,
    Bell,
    FileCheck,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    ScrollText,
    ShieldCheck,
    HelpCircle,
    ArrowLeftRight,
    Scale,
    ShoppingBag,

} from 'lucide-react';

const MultilevelSidebar = ({ isMobileOpen, onMobileMenuToggle }) => {
    const [expandedItems, setExpandedItems] = useState({});
    const user = storageManager.getUserData();
    console.log(user);

    const toggleExpanded = (itemKey) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemKey]: !prev[itemKey]
        }));
    };

    // Normalize roles to handle both 'role' (string) and 'roles' (array)
    const userRoles = (() => {
        if (!user) return [];

        // Check data.roles first
        if (user.data?.roles) {
            return Array.isArray(user.data.roles) ? user.data.roles : [user.data.roles];
        }

        // Check top-level roles
        if (user.roles) {
            return Array.isArray(user.roles) ? user.roles : [user.roles];
        }

        // Check data.role as fallback
        if (user.data?.role) {
            return [user.data.role];
        }

        return [];
    })();

    console.log(userRoles);

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
            key: 'communication',
            label: 'Communication',
            icon: MessageCircle, // or MessagesSquare
            hasSubmenu: true,
            submenu: [
                {
                    key: 'messages',
                    label: 'Messages',
                    icon: MessageSquare,
                    path: '/messages'
                },
                {
                    key: 'reviews',
                    label: 'Reviews',
                    icon: Star, // or ThumbsUp
                    path: '/reviews'
                },
                {
                    key: 'notifications',
                    label: 'Notifications',
                    icon: Bell,
                    path: '/notifications'
                },
            ],
        },
        {
            key: 'kyc',
            label: 'KYC Details',
            icon: FileText,
            path: '/kyc/status',
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
                    className="fixed inset-0 bg-[rgba(0,0,0,.8)] z-40 lg:hidden"
                    onClick={onMobileMenuToggle}
                />
            )}

            {/* Sidebar */}
            <div className={` flex flex-col
                w-64 bg-sidebar-900 text-white h-screen fixed left-0 top-0 z-50
                transform transition-transform duration-300 ease-in-out overflow-auto
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                shadow-xl lg:shadow-none
            `}>
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-brand-100">
                    <div className="pe-4 py-1 lg:hidden">
                        <LogoMerge classNameMain="py-0 w-full gap-1" />
                    </div>
                    <button
                        onClick={onMobileMenuToggle}
                        className="p-2 hover:bg-sidebar-800 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    {/* <Button conbined=>
                    <X className="w-5 h-5" />
                </Button> */}
                </div>

                {/* Logo */}
                <div className="pe-2 ps-5 py-6 border-b border-gray-50 hidden lg:block">
                    <LogoMerge />
                </div>

                {/* Menu Items */}
                <nav className="my-6 grow-1">
                    {(isAdmin ? adminMenuItems : menuItems).map((item) => (
                        <div key={item.key}>
                            {/* Main Menu Item */}
                            <button
                                onClick={() => handleItemClick(item)}
                                className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-sidebar-800 transition-colors cursor-pointer"
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
                                            className="w-full flex items-center gap-3 px-12 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
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
                <div className=" p-6 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">{user?.data?.first_name?.charAt(0) + user?.data?.first_name?.charAt(1).toUpperCase() || 'SA'}</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user?.data?.first_name || user.user || 'User'}</p>
                            <p className="text-xs text-gray-400">
                                {isAdmin ? 'Admin' : isSeller ? 'Seller' : 'User'}
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default MultilevelSidebar;
