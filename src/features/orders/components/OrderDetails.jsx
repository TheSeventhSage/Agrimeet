// components/OrderDetails.jsx
import { ArrowLeft, MapPin, CreditCard, Truck, Calendar, User, Package, ExternalLink, Printer } from 'lucide-react';
import Button from '../../../shared/components/Button';
import { STATUS_CONFIG } from '../api/orderService';

const OrderDetails = ({ order, onBack, onPrintInvoice }) => {
  if (!order) return null;

  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  // Formatters
  const formatCurrency = (amount) => `₦${Number(amount).toLocaleString()}`;
  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack} className="h-10 w-10 p-0 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Placed on {formatDate(order.orderDate)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onPrintInvoice}>
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Items & Payment */}
        <div className="lg:col-span-2 space-y-6">

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                Order Items ({order.items.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="h-20 w-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Img' }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                        {/* Variant info if available */}
                        {Array.isArray(item.variant) && item.variant.length > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            Variant: {item.variant.join(', ')}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.totalAmount - order.shippingAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatCurrency(order.shippingAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Commission</span>
                <span className="text-red-600">-{formatCurrency(order.commission)}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Earnings</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(order.sellerEarnings)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Payment Status</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery */}
        <div className="space-y-6">

          {/* Customer Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Customer Details
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">
                  {order.customer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                  <p className="text-sm text-gray-500">{order.customer.phone}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex gap-2 text-gray-600 mb-1">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium">Shipping Address</span>
                </div>
                <div className="pl-6 text-sm text-gray-600">
                  {order.customer.address ? (
                    <>
                      <p>{order.customer.address}</p>
                      <p>{order.customer.city}, {order.customer.state}</p>
                      <p>{order.customer.country}</p>
                    </>
                  ) : (
                    <p className="italic text-gray-400">No address provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment Status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
              Fulfillment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Status</label>
                <p className="text-gray-900 capitalize font-medium mt-1">
                  {order.fulfillmentStatus}
                </p>
              </div>

              {order.trackingNumber && (
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Tracking Number</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                      {order.trackingNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;