import { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import WalletTabs from '../components/WalletTabs';
import WalletOverview from '../components/WalletOverview';
import WithdrawFunds from '../components/WithdrawFunds';
import BankAccounts from '../components/BankAccounts';
import PayoutHistory from '../components/PayoutHistory';
import { showSuccess, showError } from '../../../shared/utils/alert';

const Wallet = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);

    // Mock data - in real app, this would come from API context or store
    const [walletData, setWalletData] = useState({
        balance: 0,
        currency: 'NGN',
        pendingBalance: 0,
        totalEarnings: 0
    });

    const [bankAccounts, setBankAccounts] = useState([
        // {
        //     id: 1,
        //     bankName: 'Guaranty Trust Bank',
        //     accountNumber: '•••• •••• •••• 1234',
        //     accountName: 'John Doe',
        //     isDefault: true
        // },
        // {
        //     id: 2,
        //     bankName: 'First Bank',
        //     accountNumber: '•••• •••• •••• 5678',
        //     accountName: 'John Doe',
        //     isDefault: false
        // }
    ]);

    const [payoutHistory, setPayoutHistory] = useState([
        // {
        //     id: 1,
        //     date: '2024-01-15',
        //     amount: 5000.00,
        //     status: 'completed',
        //     bankAccount: 'GTB •••• 1234',
        //     reference: 'PAY-2024-0015'
        // },
        // {
        //     id: 2,
        //     date: '2024-01-10',
        //     amount: 7500.00,
        //     status: 'processing',
        //     bankAccount: 'First Bank •••• 5678',
        //     reference: 'PAY-2024-0010'
        // }
    ]);

    const handleWithdraw = async (amount, bankAccountId) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update wallet balance
            setWalletData(prev => ({
                ...prev,
                balance: prev.balance - amount
            }));

            // Add to payout history
            const bankAccount = bankAccounts.find(acc => acc.id === bankAccountId);
            const newPayout = {
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                amount,
                status: 'processing',
                bankAccount: `${bankAccount.bankName} •••• ${bankAccount.accountNumber.slice(-4)}`,
                reference: `PAY-${Date.now()}`
            };

            setPayoutHistory(prev => [newPayout, ...prev]);

            showSuccess(`Successfully withdrew ₦${amount.toLocaleString()}! Processing may take 1-3 days.`);
        } catch (error) {
            showError('Withdrawal failed. Please try again.');
            console.error('Withdrawal error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBankAccount = async (accountData) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newAccount = {
                id: Date.now(),
                ...accountData,
                accountNumber: `•••• •••• •••• ${accountData.accountNumber.slice(-4)}`
            };

            setBankAccounts(prev => [...prev, newAccount]);
            showSuccess('Bank account added successfully!');
        } catch (error) {
            showError('Failed to add bank account. Please try again.');
            console.error('Bank account addition error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <WalletOverview data={walletData} />;
            case 'withdraw':
                return (
                    <WithdrawFunds
                        balance={walletData.balance}
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
                return <PayoutHistory history={payoutHistory} />;
            default:
                return <WalletOverview data={walletData} />;
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

export default Wallet;