// components/BankAccounts.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../shared/components/Button';
import BankAccountCard from './BankAccountCard';
import AddBankAccountModal from './AddBankAccountModal';

const BankAccounts = ({ accounts, onAddAccount, isLoading }) => {
    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddAccount = (accountData) => {
        onAddAccount(accountData);
        setShowAddModal(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Linked Bank Accounts</h3>
                <Button onClick={() => setShowAddModal(true)} disabled={isLoading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Account
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map((account) => (
                    <BankAccountCard key={account.id} account={account} />
                ))}
            </div>

            <AddBankAccountModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddAccount}
            />
        </div>
    );
};

export default BankAccounts;