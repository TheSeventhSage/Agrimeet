// components/WithdrawFunds.jsx
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Button from '../../../shared/components/Button';
import LoadingSpinner from '../../../shared/components/Loading';

const WithdrawFunds = ({ balance, bankAccounts, onWithdraw, isLoading }) => {
    const [formData, setFormData] = useState({
        amount: '',
        bankAccountId: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.amount && formData.bankAccountId) {
            onWithdraw(parseFloat(formData.amount), parseInt(formData.bankAccountId));
            setFormData({ amount: '', bankAccountId: '' });
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

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
                                <span className="absolute left-3 top-3 text-gray-500">₦</span>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    placeholder="0.00"
                                    min="100"
                                    max={balance}
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Available: ₦{balance.toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Bank Account
                            </label>
                            <select
                                value={formData.bankAccountId}
                                onChange={(e) => handleInputChange('bankAccountId', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                required
                            >
                                <option value="">Choose bank account</option>
                                {bankAccounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.bankName} - {account.accountNumber} {account.isDefault && '(Default)'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !formData.amount || !formData.bankAccountId}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <ArrowUpRight className="w-4 h-4 mr-2" />
                                    Withdraw Funds
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Withdrawal Info */}
                <div className="bg-gray-50 rounded-lg p-6">
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
        </div>
    );
};

export default WithdrawFunds;