import { useState, useEffect } from 'react';
import { Banknote, Save } from 'lucide-react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { getBanks } from '../../../pages/api/profile.api';

const BankDetailsForm = ({ initialData, onSave, isSubmitting }) => {
    const [banks, setBanks] = useState([]);
    const [formData, setFormData] = useState({
        bank_name: initialData.bank_name || '',
        bank_account_number: initialData.bank_account_number || '',
        bank_code: initialData.bank_code || '',
        name_on_account: initialData.name_on_account || '',
    });

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const bankList = await getBanks();
                setBanks(bankList);
            } catch (err) {
                console.error('Failed to load banks');
            }
        };
        fetchBanks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'bank_name') {
            const selectedBank = banks.find(b => b.name === value);
            setFormData(prev => ({
                ...prev,
                bank_name: value,
                bank_code: selectedBank ? selectedBank.code : ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Bank Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Banknote className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            name="bank_name"
                            value={formData.bank_name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                            required
                        >
                            <option value="">Select a bank</option>
                            {banks.map(bank => (
                                <option key={bank.id} value={bank.name}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <Input
                    label="Bank Account Number"
                    name="bank_account_number"
                    type="text"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    icon={Banknote}
                    placeholder="Enter account number"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Name on Account"
                    name="name_on_account"
                    value={formData.name_on_account}
                    onChange={handleChange}
                    icon={Banknote}
                    placeholder="Enter account name"
                    required
                />
                <Input
                    label="Bank Code"
                    name="bank_code"
                    value={formData.bank_code}
                    icon={Banknote}
                    disabled={true}
                    className="bg-gray-50"
                />
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" loading={isSubmitting} icon={Save}>
                    Update Bank Details
                </Button>
            </div>
        </form>
    );
};

export default BankDetailsForm;