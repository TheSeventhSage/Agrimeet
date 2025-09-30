// components/OrderCard.jsx
import { MoreVertical, Eye, Printer, Edit3 } from 'lucide-react';
import Button from '../../../shared/components/Button';
import { STATUS_CONFIG } from '../api/orderService';

const OrderCard = ({ order, onViewDetails, onPrintInvoice }) => {

    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

    const formatCurrency = (amount) => {
        return `₦${amount.toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            {/* Order Number */}
            <td className="py-4 px-6">
                <div>
                    <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                </div>
            </td>

            {/* Customer */}
            <td className="py-4 px-6">
                <div>
                    <p className="font-medium text-gray-900">{order.customer.name}</p>
                    <p className="text-sm text-gray-500">{order.customer.email}</p>
                </div>
            </td>

            {/* Date */}
            <td className="py-4 px-6">
                <div>
                    <p className="text-gray-900">{formatDate(order.orderDate)}</p>
                    {order.trackingNumber && (
                        <p className="text-xs text-gray-500 font-mono">{order.trackingNumber}</p>
                    )}
                </div>
            </td>

            {/* Status */}
            <td className="py-4 px-6">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig.badgeColor}`}></span>
                    {statusConfig.label}
                </span>
            </td>

            {/* Amount */}
            <td className="py-4 px-6 text-right">
                <div>
                    <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                </div>
            </td>

            {/* Actions */}
            <td className="py-4 px-6">
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(order.id)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPrintInvoice(order.id)}
                    >
                        <Printer className="w-4 h-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
};

export default OrderCard;