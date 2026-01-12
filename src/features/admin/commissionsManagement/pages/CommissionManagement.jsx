// admin/commission/CommissionManagement.jsx
import { useState } from 'react';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import { BarChart3, CreditCard, Users, Settings } from 'lucide-react';

// Sub-components
import CommissionOverview from '../components/CommissionOverview';
import PayoutsList from '../components/PayoutsList';
import SellerReports from '../components/SellerReports';
import CommissionSettings from '../components/CommissionSettings';

const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'payouts', label: 'Payouts', icon: CreditCard },
    { id: 'sellers', label: 'Seller Reports', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
];

const CommissionManagement = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <CommissionOverview />;
            case 'payouts':
                return <PayoutsList />;
            case 'sellers':
                return <SellerReports />;
            case 'settings':
                return <CommissionSettings />;
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Commission Management</h1>
                    <p className="text-gray-600 mt-2">Manage earnings, payouts, and platform commission rates.</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap
                                ${activeTab === tab.id ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {renderTabContent()}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CommissionManagement;