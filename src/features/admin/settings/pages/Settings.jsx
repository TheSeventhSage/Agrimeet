import { useState } from 'react';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import { LayoutGrid, Briefcase, Scale, Ticket, Tags } from 'lucide-react';

// Import the tab components
import UnitsTab from '../components/UnitsTab';
import BusinessTypesTab from '../components/BusinessTypesTab';
import CategoriesTab from '../components/CategoriesTab';
import ProductAttributes from '../components/ProductAttributes';
// import CouponsTab from '../components/Coupons';

const tabs = [
    { id: 'units', label: 'Measurement Units', icon: Scale },
    { id: 'businessTypes', label: 'Business Types', icon: Briefcase },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'attributes', label: 'Product Attributes', icon: Tags },
    // { id: 'coupons', label: 'Coupons', icon: Ticket },
];

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'units':
                return <UnitsTab />;
            case 'businessTypes':
                return <BusinessTypesTab />;
            case 'categories':
                return <CategoriesTab />;
            case 'attributes':
                return <ProductAttributes />;
            // case 'coupons':
            //     return <CouponsTab />
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <div className="p-2 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">
                        Manage core platform settings, units, and categories.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                                ${activeTab === tab.id
                                    ? 'text-brand-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                            {/* Simple non-animated underline */}
                            {activeTab === tab.id && (
                                <div
                                    className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-600"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content (no animation) */}
                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminSettings;