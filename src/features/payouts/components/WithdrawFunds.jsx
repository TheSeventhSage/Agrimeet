import { useState, useEffect } from 'react';
import { ArrowUpRight, AlertCircle } from 'lucide-react';
import Button from '../../../shared/components/Button';
import { useNavigate } from 'react-router-dom';

const WithdrawFunds = ({ balance, bankAccounts, onWithdraw, isLoading }) => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');

    // Get the profile bank account
    const accounts = bankAccounts;
    const profileBankAccount = accounts && accounts.length > 0 ? accounts[0] : null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (amount && profileBankAccount) {
            onWithdraw(parseFloat(amount));
            setAmount('');
        }
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
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₦</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                                    placeholder="0.00"
                                    min="100"
                                    max={balance}
                                    required
                                    disabled={!profileBankAccount}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-xs">
                                <span className="text-gray-500">Min: ₦100</span>
                                <span className={balance < parseFloat(amount || 0) ? "text-red-500 font-medium" : "text-gray-500"}>
                                    Available: ₦{parseFloat(balance).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Destination Bank
                            </label>
                            {profileBankAccount ? (
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed">
                                    <div className="font-medium">{profileBankAccount.bankName}</div>
                                    <div className="text-sm text-gray-500">
                                        {profileBankAccount.accountNumber} • {profileBankAccount.accountName}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-yellow-800">No Bank Account Linked</h4>
                                            <p className="text-xs text-yellow-700 mt-1">
                                                You need to update your profile with bank details before you can withdraw.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/settings/profile')}
                                                className="text-xs font-semibold text-yellow-800 underline mt-2 hover:text-yellow-900"
                                            >
                                                Go to Profile Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            loading={isLoading}
                            disabled={!amount || !profileBankAccount || parseFloat(amount) > balance}
                            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            {isLoading ? 'Processing...' : 'Withdraw Funds'}
                        </Button>
                    </form>
                </div>

                {/* Withdrawal Information */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4">Withdrawal Information</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Processing Time:</span>
                            <span className="font-medium">1-3 Business Days</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Minimum Withdrawal:</span>
                            <span className="font-medium">₦100</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Transaction Fee:</span>
                            <span className="font-medium">₦0</span>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            💡 Withdrawals are processed on business days using the bank details in your profile.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawFunds;