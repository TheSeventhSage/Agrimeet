// components/OrderTabs.jsx
import { Package, AlertCircle, Clock, CheckCircle, List } from 'lucide-react';

const OrderTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        {
            id: 'all',
            label: 'All Orders',
            icon: List,
            color: 'text-gray-600'
        },
        {
            id: 'unpaid',
            label: 'Unpaid',
            icon: AlertCircle,
            color: 'text-red-600'
        },
        {
            id: 'unfulfilled',
            label: 'Unfulfilled',
            icon: Clock,
            color: 'text-yellow-600'
        },
        {
            id: 'open',
            label: 'Open (Paid/Unfulfilled)',
            icon: Package,
            color: 'text-blue-600'
        },
        {
            id: 'closed',
            label: 'Closed (Completed)',
            icon: CheckCircle,
            color: 'text-green-600'
        }
    ];

    return (
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <div className="flex space-x-2 min-w-max pb-1">
                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center px-4 py-3 rounded-t-lg text-sm font-medium transition-all duration-200 whitespace-nowrap border-b-2 ${isActive
                                ? 'border-brand-600 text-brand-600 bg-brand-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <IconComponent className={`w-4 h-4 mr-2 ${isActive ? 'text-brand-600' : tab.color}`} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTabs;