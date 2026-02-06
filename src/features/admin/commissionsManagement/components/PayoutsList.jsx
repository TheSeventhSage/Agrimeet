// admin/commission/components/PayoutsList.jsx
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import adminCommissionService from '../api/adminCommissionService';
import { showSuccess, showError } from '../../../../shared/utils/alert';
import ConfirmationModal from '../../../../shared/components/ConfirmationModal';

const PayoutsList = () => {
    const [payouts, setPayouts] = useState([]);
    const [selectedPayouts, setSelectedPayouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        loadPayouts();
    }, []);

    const loadPayouts = async () => {
        try {
            setIsLoading(true);
            const response = await adminCommissionService.getPendingPayouts();
            setPayouts(response.data.data || response.data || []);
            setSelectedPayouts([]);
        } catch (error) {
            showError('Failed to load pending payouts');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsPaid = async () => {
        if (selectedPayouts.length === 0) return;

        try {
            await adminCommissionService.markAsPaid({ commission_ids: selectedPayouts });
            showSuccess('Payouts marked as paid');
            loadPayouts();
        } catch (error) {
            showError('Failed to process payouts');
        }
    };

    const toggleSelection = (id) => {
        setSelectedPayouts(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAll = (e) => {
        setSelectedPayouts(e.target.checked ? payouts.map(p => p.id) : []);
    };

    const handleConfirmModal = () => {
        setShowConfirm((prevState) => prevState === false ? prevState = true : prevState = false); 
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Pending Payouts</h3>
                    <p className="text-sm text-gray-500">Select payouts to mark them as paid</p>
                </div>
                <button
                    onClick={handleConfirmModal}
                    disabled={selectedPayouts.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg cursor-pointer hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Paid ({selectedPayouts.length})
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 w-4">
                                    <input
                                        type="checkbox"
                                        onChange={toggleAll}
                                        checked={payouts.length > 0 && selectedPayouts.length === payouts.length}
                                        className="rounded-sm border-gray-300 text-brand-600 focus:ring-brand-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Seller</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Period</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                            ) : payouts.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No pending payouts</td></tr>
                            ) : (
                                payouts.map((payout) => (
                                    <tr key={payout.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedPayouts.includes(payout.id)}
                                                onChange={() => toggleSelection(payout.id)}
                                                className="rounded-sm border-gray-300 text-brand-600 focus:ring-brand-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{payout.seller_name}</div>
                                            <div className="text-sm text-gray-500">{payout.seller_email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">${payout.amount}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(payout.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Pending
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={handleConfirmModal}
                onConfirm={handleMarkAsPaid}
                message={`Mark ${selectedPayouts.length} payouts as paid?`}
                title='Mark this payout(s) paid?'
                type="info"
            />
        </div>
    );
};

export default PayoutsList;