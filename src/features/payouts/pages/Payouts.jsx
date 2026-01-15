import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import WalletTabs from '../components/WalletTabs';
import WalletOverview from '../components/WalletOverview';
import WithdrawFunds from '../components/WithdrawFunds';
import BankAccounts from '../components/BankAccounts';
import PayoutHistory from '../components/PayoutHistory';
import { earningsApi } from '../api/payouts.api';
import { storageManager } from '../../../shared/utils/storageManager';

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

    const userDetails = storageManager.getUserData();
    const userBankAccount = {
        id: 1 || userDetails.data.seller.bank_id,
        accountNumber: userDetails.data.seller.bank_account_number || 1234567890,
        accountName: userDetails.data.seller.name_on_account || 'Agrimeet Seller',
        bankName: userDetails.data.seller.bank_name || 'AGM Bank',
    }

    // Fetch data when component mounts or filter changes
    useEffect(() => {
        fetchDashboardData();
    }, [timeFilter]);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch all required data in parallel including the new wallet balance
            const [overviewRes, historyRes, trendRes, walletRes] = await Promise.all([
                earningsApi.getEarningsOverview({ period: timeFilter }),
                earningsApi.getEarningsHistory({ page: 1, per_page: 15 }),
                earningsApi.getMonthlyEarningsTrend({ months: 12 }),
                earningsApi.getWalletBalance()
            ]);

            // Merge wallet balance into overview data so WalletOverview can access it
            const combinedOverview = {
                ...(overviewRes.data || overviewRes),
                wallet_balance: walletRes.data?.wallet_balance || 0,
                currency: walletRes.data?.currency || 'NGN'
            };

            setBankAccounts(userBankAccount)
            setOverviewData(combinedOverview);
            setHistory(historyRes.data || []);
            setTrend(trendRes || []);

        } catch (err) {
            console.error('Error fetching payouts data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    console.log(bankAccounts)

    const handleWithdraw = async (amount) => {
        try {
            setIsLoading(true);
            // Consume the withdrawal endpoint
            await earningsApi.requestWithdrawal({ amount });

            // Refresh data to show updated balance
            await fetchDashboardData();

            // Reset tab to overview or show success message if needed
            // setActiveTab('overview'); 
        } catch (err) {
            console.error('Withdrawal failed:', err);
            alert(err.message || 'Failed to process withdrawal');
        } finally {
            setIsLoading(false);
        }
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
                        // Pass the actual wallet balance instead of paid_payouts
                        balance={overviewData?.wallet_balance || 0}
                        bankAccounts={[bankAccounts]}
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