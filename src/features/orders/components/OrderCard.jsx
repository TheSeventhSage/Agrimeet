// components/OrderCard.jsx
import { Eye, Edit, Printer } from 'lucide-react';
import Button from '../../../shared/components/Button';
import { STATUS_CONFIG } from '../api/orderService';

const OrderCard = ({ order, onViewDetails, onUpdateStatus, onPrintInvoice }) => {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  
  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Order Number */}
      <td className="py-4 px-6">
        <div>
          <div className="font-medium text-gray-900">{order.orderNumber}</div>
          {!order.read && (
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-1"></span>
          )}
        </div>
      </td>

      {/* Customer */}
      <td className="py-4 px-6">
        <div className="text-gray-900 font-medium">{order.customer.name}</div>
        <div className="text-gray-600 text-sm">{order.customer.phone}</div>
      </td>

      {/* Date */}
      <td className="py-4 px-6 text-gray-700">
        {formatDate(order.orderDate)}
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <div className="flex flex-col space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
          </span>
        </div>
      </td>

      {/* Amount */}
      <td className="py-4 px-6 text-right">
        <div className="text-gray-900 font-semibold">
          {formatCurrency(order.total)}
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