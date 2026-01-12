// components/WalletTabs.jsx
import { Wallet, ArrowUpRight, Landmark, History } from 'lucide-react';

const WalletTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'overview', label: 'Wallet Overview', icon: Wallet },
        { id: 'withdraw', label: 'Withdraw Funds', icon: ArrowUpRight },
        { id: 'banks', label: 'Bank Accounts', icon: Landmark },
        { id: 'history', label: 'Earnings History', icon: History }
    ];

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-1 mb-6 overflow-auto">
            <div className="flex space-x-1">
                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-brand-100 text-brand-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <IconComponent className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default WalletTabs;