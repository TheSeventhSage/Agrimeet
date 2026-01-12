import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import WalletTabs from '../components/WalletTabs';
import WalletOverview from '../components/WalletOverview';
import WithdrawFunds from '../components/WithdrawFunds';
import BankAccounts from '../components/BankAccounts';
import PayoutHistory from '../components/PayoutHistory';
import { earningsApi } from '../api/payouts.api'; // Assumed filename based on previous context

const Payouts = () => {
    // Component states
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data states
    const [overviewData, setOverviewData] = useState();
    const [history, setHistory] = useState([]);
    const [trend, setTrend] = useState([]);

    // Filter states
    const [timeFilter, setTimeFilter] = useState('all');

    // Mock bank accounts (keeping existing logic)
    const [bankAccounts, setBankAccounts] = useState([
        {
            id: 1,
            bankName: 'Guaranty Trust Bank',
            accountNumber: '•••• •••• •••• 1234',
            accountName: 'John Doe',
            isDefault: true
        }
    ]);

    // Fetch data when component mounts or filter changes
    useEffect(() => {
        fetchDashboardData();
    }, [timeFilter]);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch all required data in parallel
            // Note: History is fetched with a limit of 15 for the history tab, 
            // WalletOverview will slice what it needs.
            const [overviewRes, historyRes, trendRes] = await Promise.all([
                earningsApi.getEarningsOverview({ period: timeFilter }),
                earningsApi.getEarningsHistory({ page: 1, per_page: 15 }),
                earningsApi.getMonthlyEarningsTrend({ months: 6 })
            ]);

            setOverviewData(overviewRes.data || overviewRes);
            setHistory(historyRes.data || []);
            setTrend(trendRes.data || []);

        } catch (err) {
            console.error('Error fetching payouts data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdraw = (amount) => {
        console.log('Withdrawing:', amount);
        // Implement withdrawal logic here
    };

    const handleAddBankAccount = (account) => {
        setBankAccounts([...bankAccounts, { ...account, id: Date.now() }]);
    };

    const renderTabContent = () => {
        if (isLoading && !overviewData && history.length === 0) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                </div>
            );
        }

        switch (activeTab) {
            case 'withdraw':
                return (
                    <WithdrawFunds
                        balance={overviewData.paid_payouts}
                        bankAccounts={bankAccounts}
                        onWithdraw={handleWithdraw}
                        isLoading={isLoading}
                    />
                );
            case 'banks':
                return (
                    <BankAccounts
                        accounts={bankAccounts}
                        onAddAccount={handleAddBankAccount}
                        isLoading={isLoading}
                    />
                );
            case 'history':
                return <PayoutHistory history={history} />;
            default:
                return (
                    <WalletOverview
                        overviewData={overviewData}
                        trend={trend}
                        history={history}
                        timeFilter={timeFilter}
                        onTimeFilterChange={setTimeFilter}
                        loading={isLoading}
                        error={error}
                        onRetry={fetchDashboardData}
                    />
                );
        }
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Wallet & Payouts</h1>
                    <p className="text-gray-600">Manage your earnings and withdrawals</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <WalletTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                {renderTabContent()}
            </div>
        </DashboardLayout>
    );
};

export default Payouts;