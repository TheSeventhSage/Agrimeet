// components/OrderTabs.jsx
import { Package, Clock, Truck, CheckCircle, BarChart3, FileText } from 'lucide-react';

const OrderTabs = ({ activeTab, onTabChange, orderStats = {} }) => {
    const tabs = [
        {
            id: 'all',
            label: 'All Orders',
            icon: Package,
            count: orderStats.total || 0
        },
        {
            id: 'pending',
            label: 'Pending',
            icon: Clock,
            count: orderStats.pending || 0,
            color: 'text-orange-600'
        },
        {
            id: 'processing',
            label: 'Processing',
            icon: Package,
            count: orderStats.processing || 0,
            color: 'text-purple-600'
        },
        {
            id: 'shipped',
            label: 'Shipped',
            icon: Truck,
            count: orderStats.shipped || 0,
            color: 'text-blue-600'
        },
        {
            id: 'delivered',
            label: 'Delivered',
            icon: CheckCircle,
            count: orderStats.delivered || 0,
            color: 'text-green-600'
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart3
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-1 mb-6 overflow-x-auto">
            <div className="flex space-x-1 min-w-max">
                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive
                                    ? 'bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-md transform scale-105'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <IconComponent className={`w-4 h-4 mr-2 ${tab.color || ''}`} />
                            <span>{tab.label}</span>
                            {tab.count !== undefined && (
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold ${isActive
                                        ? 'bg-white bg-opacity-20 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTabs;