// components/OrderDetails.jsx
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck, Calendar, FileText, Edit3, Printer } from 'lucide-react';
import { useState } from 'react';
import Button from '../../../shared/components/Button';
import { LoadingSpinner } from '../../../shared/components/Loader';
import { STATUS_CONFIG } from '../api/orderService';

const OrderDetails = ({ order, onBack, onUpdateStatus, onPrintInvoice, isLoading }) => {
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  if (isLoading || !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusActions = (currentStatus) => {
    const actions = [];

    switch (currentStatus) {
      case 'pending':
        actions.push('confirmed', 'cancelled');
        break;
      case 'confirmed':
        actions.push('processing', 'cancelled');
        break;
      case 'processing':
        actions.push('shipped', 'cancelled');
        break;
      case 'shipped':
        actions.push('delivered');
        break;
      default:
        break;
    }

    return actions;
  };

  const statusActions = getStatusActions(order.status);

  const handleStatusUpdate = () => {
    if (selectedStatus) {
      onUpdateStatus(order.id, selectedStatus);
      setShowStatusUpdate(false);
      setSelectedStatus('');
    }
  };

  const getStatusTimeline = () => {
    const timeline = [
      { status: 'pending', label: 'Order Placed', completed: true },
      { status: 'confirmed', label: 'Order Confirmed', completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) },
      { status: 'processing', label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(order.status) },
      { status: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(order.status) },
      { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered' }
    ];

    if (order.status === 'cancelled') {
      return [
        { status: 'pending', label: 'Order Placed', completed: true },
        { status: 'cancelled', label: 'Order Cancelled', completed: true, error: true }
      ];
    }

    return timeline;
  };

  const timeline = getStatusTimeline();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
            <p className="text-gray-600">Placed on {formatDate(order.orderDate)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.color}`}>
            {statusConfig.label}
          </span>

          {statusActions.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setShowStatusUpdate(true)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Update Status
            </Button>
          )}

          <Button onClick={() => onPrintInvoice(order.id)}>
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Rest of the OrderDetails component remains the same */}
      {/* ... existing JSX code ... */}
    </div>
  );
};

export default OrderDetails;