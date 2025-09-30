// components/AddBankAccountModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../../../shared/components/Button';
import LoadingSpinner from '../../../shared/components/Loading';

const AddBankAccountModal = ({ isOpen, onClose, onAdd }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        accountName: '',
        isDefault: false
    });

    const banks = [
        'Access Bank',
        'Guaranty Trust Bank',
        'First Bank',
        'United Bank for Africa',
        'Zenith Bank',
        'Ecobank',
        'Fidelity Bank',
        'Stanbic IBTC',
        'Union Bank',
        'Wema Bank'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            onAdd(formData);
            onClose();
        } catch (error) {
            console.error('Failed to add bank account');
            console.error('Failed to add bank account', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0">
            <div className="bg-white rounded-lg w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Add Bank Account</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Name
                        </label>
                        <select
                            value={formData.bankName}
                            onChange={(e) => handleInputChange('bankName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select Bank</option>
                            {banks.map((bank) => (
                                <option key={bank} value={bank}>{bank}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Number
                        </label>
                        <input
                            type="text"
                            value={formData.accountNumber}
                            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                            placeholder="Enter account number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Name
                        </label>
                        <input
                            type="text"
                            value={formData.accountName}
                            onChange={(e) => handleInputChange('accountName', e.target.value)}
                            placeholder="Enter account name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="defaultAccount"
                            checked={formData.isDefault}
                            onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                        <label htmlFor="defaultAccount" className="ml-2 text-sm text-gray-700">
                            Set as default account for withdrawals
                        </label>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? <LoadingSpinner size="sm" /> : 'Add Account'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBankAccountModal;