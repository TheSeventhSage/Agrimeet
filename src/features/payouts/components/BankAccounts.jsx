import React from 'react';
import { AlertCircle } from 'lucide-react';
import BankAccountCard from './BankAccountCard';
import { useNavigate } from 'react-router-dom';

const BankAccounts = ({ accounts }) => {
    const navigate = useNavigate();
    const bankAccounts = [accounts];
    console.log(bankAccounts)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Linked Bank Account</h3>
                <button
                    onClick={() => navigate('/settings/profile')}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                    Update in Profile
                </button>
            </div>

            {bankAccounts && bankAccounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bankAccounts.map((account) => (
                        <BankAccountCard key={account.id} account={account} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-gray-900 font-medium mb-1">No Bank Account Linked</h4>
                    <p className="text-gray-500 text-sm mb-4">Please update your seller profile with your bank details.</p>
                    <button
                        onClick={() => navigate('/settings/profile')}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600"
                    >
                        Go to Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default BankAccounts;