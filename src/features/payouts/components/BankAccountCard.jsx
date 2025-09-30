// components/BankAccountCard.jsx
import React from 'react';
import Button from '../../../shared/components/Button';

const BankAccountCard = ({ account }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{account.bankName}</h4>
                {/* {account.isDefault && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Default
                    </span>
                )} */}
            </div>
            <div className="space-y-2 text-sm">
                <p className="text-gray-600">Account Number: {account.accountNumber}</p>
                <p className="text-gray-600">Account Name: {account.accountName}</p>
            </div>
            <div className="flex space-x-2 mt-4">
                {/* <Button variant="outline" size="sm">
                    Set as Default
                </Button> */}
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Remove
                </Button>
            </div>
        </div>
    );
};

export default BankAccountCard;