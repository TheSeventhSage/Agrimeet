import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Button from '../../../shared/components/Button';
import Modal from '../../../shared/components/Modal'; // Reuse existing Modal
import { LoadingSpinner } from '../../../shared/components/Loader';

// Fail-safe: Default props to prevent crashes
const WithdrawFunds = ({ balance = 0, bankAccounts = [], onWithdraw, isLoading }) => {
    // Restore original state structure
    const [formData, setFormData] = useState({
        amount: '',
        bankAccountId: ''
    });

    // NEW: Modal state for feedback (Replaces alerts)
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    // Fail-safe: Ensure bankAccounts is an array
    const accounts = Array.isArray(bankAccounts) ? bankAccounts : [];
    const safeBalance = Number(balance) || 0;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.amount && formData.bankAccountId) {
            const withdrawalAmount = parseFloat(formData.amount);

            // ---------------------------------------------------------
            // OBJECTIVE 3: Duplicate Wallet Balance Check
            // ---------------------------------------------------------
            // Defensive validation to prevent submission if funds are insufficient.
            // This happens before the API request to save resources and avoid race conditions.
            if (withdrawalAmount > safeBalance) {
                setModalConfig({
                    isOpen: true,
                    title: 'Insufficient Funds',
                    message: `You cannot withdraw ₦${withdrawalAmount.toLocaleString()} because it exceeds your available balance of ₦${safeBalance.toLocaleString()}.`,
                    color: { text: 'text-red-600', bg: 'bg-red-100', }
                });

                console.log(modalConfig);

                return; // Gracefully block submission
            }

            try {
                // Submit withdrawal using original signature (amount, accountId)
                await onWithdraw(withdrawalAmount, parseInt(formData.bankAccountId));

                // ---------------------------------------------------------
                // OBJECTIVE 1: Success Feedback
                // ---------------------------------------------------------

                setModalConfig({
                    isOpen: true,
                    title: 'Withdrawal Successful',
                    message: `Your withdrawal of ₦${withdrawalAmount.toLocaleString()} has been processed. Your updated balance will be reflected after admin approval.`,
                    color: { text: 'text-sidebar-600', bg: 'bg-sidebar-100', }
                });

                // Clear form on success
                setFormData({ amount: '', bankAccountId: '' });

            } catch (error) {
                // ---------------------------------------------------------
                // OBJECTIVE 2: Replace Alerts (Error Case)
                // ---------------------------------------------------------
                setModalConfig({
                    isOpen: true,
                    title: 'Withdrawal Failed',
                    message: 'There was an issue processing your withdrawal. Please try again.',
                    color: { text: 'text-amber-600', bg: 'bg-amber-100', }
                });
            }
        }
    };

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Withdraw Funds</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Withdrawal Form */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount to Withdraw
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₦</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    className="pl-8 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm h-10 border"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Available Balance: <span className="font-medium text-gray-900">₦{safeBalance.toLocaleString()}</span>
                            </p>
                        </div>

                        {/* Restored Select Element */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Bank Account
                            </label>
                            <select
                                value={formData.bankAccountId}
                                onChange={(e) => handleInputChange('bankAccountId', e.target.value)}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm h-10 border px-3"
                            >
                                <option value="">Select a bank account</option>
                                {accounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.bankName} - {account.accountNumber}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full justify-center"
                            loading={isLoading}
                            disabled={!formData.amount || !formData.bankAccountId || isLoading}
                        >
                            Withdraw Funds
                        </Button>
                    </form>
                </div>

                {/* Restored Withdrawal Information */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4">Withdrawal Information</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Processing Time:</span>
                            <span className="font-medium">1-3 Business Days</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Minimum Withdrawal:</span>
                            <span className="font-medium">₦1,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Transaction Fee:</span>
                            <span className="font-medium">₦25</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Daily Limit:</span>
                            <span className="font-medium">₦500,000</span>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            💡 Withdrawals are processed on business days. Weekend requests will be processed on the next business day.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal Component for Feedback */}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                titleColor={modalConfig.color}
                size='sm'
            >
                <div className="text-gray-600">
                    {modalConfig.message}
                </div>
            </Modal>
        </div>
    );
};

export default WithdrawFunds;