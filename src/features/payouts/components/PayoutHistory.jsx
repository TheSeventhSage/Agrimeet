// components/PayoutHistory.jsx
import { Download } from 'lucide-react';
import Button from '../../../shared/components/Button';

const PayoutHistory = ({ history }) => {
    const statusConfig = {
        completed: { color: 'text-green-800 bg-green-100', label: 'Completed' },
        processing: { color: 'text-yellow-800 bg-yellow-100', label: 'Processing' },
        failed: { color: 'text-red-800 bg-red-100', label: 'Failed' }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
                <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 text-sm font-medium text-gray-700">Date</th>
                            <th className="text-left py-3 text-sm font-medium text-gray-700">Amount</th>
                            <th className="text-left py-3 text-sm font-medium text-gray-700">Bank Account</th>
                            <th className="text-left py-3 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 text-sm font-medium text-gray-700">Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-4 text-sm text-gray-900">{item.date}</td>
                                <td className="py-4 text-sm font-medium text-gray-900">
                                    ₦{item.amount.toLocaleString()}
                                </td>
                                <td className="py-4 text-sm text-gray-600">{item.bankAccount}</td>
                                <td className="py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[item.status]?.color}`}>
                                        {statusConfig[item.status]?.label || item.status}
                                    </span>
                                </td>
                                <td className="py-4 text-sm text-gray-600">{item.reference}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayoutHistory;