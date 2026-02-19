// components/OrderDetails.jsx
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  User,
  Package,
  Printer,
  ShieldCheck,
  Receipt,
  Phone,
  Box
} from 'lucide-react';
import Button from '../../../shared/components/Button';

// Helper to handle status colors based on your API values
const getStatusColor = (status, type = 'default') => {
  const colors = {
    paid: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    unfulfilled: 'bg-orange-100 text-orange-800 border-orange-200',
    fulfilled: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    open: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const OrderDetails = ({ order, onBack, onPrintInvoice }) => {
  if (!order) return null;

  console.log(order)

  // Formatters
  const formatCurrency = (amount) => `₦${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack} className="h-10 w-10 p-0 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
              {order.read && (
                <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 border border-gray-200">
                  Read
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onPrintInvoice(order)}>
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
        </div>
      </div>

      {/* --- STATUS OVERVIEW GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Payment Status */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Payment Status</p>
            <div className={`mt-2 inline-flex px-2.5 py-1 rounded-md text-sm font-medium border ${getStatusColor(order.payment_status)}`}>
              {order.payment_status}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Paid At</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(order.paid_at)}</p>
          </div>
        </div>

        {/* Fulfillment Status */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Fulfillment</p>
            <div className={`mt-2 inline-flex px-2.5 py-1 rounded-md text-sm font-medium border ${getStatusColor(order.fulfillment_status)}`}>
              {order.fulfillment_status}
            </div>
          </div>
          <Truck className="w-8 h-8 text-gray-200" />
        </div>

        {/* Order Status */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Order State</p>
            <div className={`mt-2 inline-flex px-2.5 py-1 rounded-md text-sm font-medium border ${getStatusColor(order.order_status)}`}>
              {order.order_status}
            </div>
          </div>
          <Package className="w-8 h-8 text-gray-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- LEFT COLUMN (ITEMS & FINANCIALS) --- */}
        <div className="lg:col-span-2 space-y-6">

          {/* Order Items Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-auto">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-gray-500" />
                Order Items ({Object.values(order.items).length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {Object.values(order.items).map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-10">
                    {/* Thumbnail */}
                    <div className="h-20 w-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Img' }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 w-[80%] sm:w-full">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          {/* Variants */}
                          {item.variant_attributes && item.variant_attributes.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {item.variant_attributes.map((attr, idx) => (
                                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                  {attr}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Item Specific Status */}
                          <div className="mt-2">
                            <span className={`text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded border ${getStatusColor(item.fulfillment_status)}`}>
                              {item.fulfillment_status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatCurrency(item.total_price)}</p>
                          <p className="text-sm text-gray-500">{item.quantity} x {formatCurrency(item.unit_price)}</p>
                        </div>
                      </div>

                      {/* Item Financial Breakdown (Micro view) */}
                      <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between gap-4 text-xs text-gray-500">
                        <div className="flex flex-col md:flex-row">
                          <span>Platform Fee:</span>
                          <span className="text-red-600 font-medium">-
                            {formatCurrency(item.platform_commission_amount)}
                            <span className="text-gray-400 ml-1">({Number(item.platform_commission_rate)}%)</span>
                          </span>

                        </div>
                        <div className="flex flex-col md:flex-row gap-1">
                          <span>Your Earnings:</span>
                          <span className="text-green-600 font-bold">{formatCurrency(item.seller_earnings)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Financial Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-gray-500" />
              Financial Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Payment Side */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Paid</p>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Items Total</span>
                  <span>{formatCurrency(Number(order.total_amount) - Number(order.shipping_amount) + Number(order.shipping_discount))}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping Cost</span>
                  <span>{formatCurrency(order.shipping_amount)}</span>
                </div>

                {Number(order.shipping_discount) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Shipping Discount</span>
                    <span>-{formatCurrency(order.shipping_discount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Order Value</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>

              {/* Seller Earnings Side */}
              <div className="space-y-3 md:border-l md:pl-8 border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seller Net (You)</p>

                <div className="flex justify-between text-sm text-gray-600">
                  <span className="text-[14px]">Commission <br /> Deducted</span>
                  <span className="text-red-500">-{formatCurrency(order.total_commission)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span className="text-[14px]">Shipping <br /> Revenue</span>
                  {/* Assuming seller gets shipping fee, if not, logic changes based on platform rules */}
                  <span>{formatCurrency(Number(order.shipping_amount) - Number(order.shipping_discount))}</span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center bg-green-50 -mx-4 px-4 py-2 rounded-lg mt-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-base text-green-900">Total Earnings</span>
                    <span className="text-xs text-green-700">Sent to Wallet</span>
                  </div>
                  <span className="text-sm font-bold text-green-700">{formatCurrency(order.total_seller_earnings)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (CUSTOMER & LOGISTICS) --- */}
        <div className="space-y-6">

          {/* Customer Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Customer Details
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border border-brand-200">
                  {order.customer_fullname?.charAt(0) || 'G'}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{order.customer_fullname || 'Guest'}</p>
                  <p className="text-sm text-gray-500">ID: {order.user_id}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-sm font-medium text-gray-900">{order.customer_phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Delivery Address</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {order.customer_address}<br />
                      {order.customer_address_2 && <span>{order.customer_address_2}<br /></span>}
                      {order.customer_city}, {order.customer_state}<br />
                      {order.customer_country}
                    </p>
                    {order.customer_default_delivery_address && (
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        <ShieldCheck className="w-3 h-3" /> Default Address
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics / Delivery Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
              Logistics Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Courier Service</label>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-medium text-gray-900">{order.courier_name || 'N/A'}</span>
                  <span className="text-xs text-gray-400 font-mono">{order.courier_code}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-50">
                <label className="text-xs text-gray-500 uppercase font-bold">Tracking Number</label>
                <div className="mt-1">
                  {order.tracking_number ? (
                    <span className="font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm border border-blue-100 block text-center">
                      {order.tracking_number}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Not generated yet</span>
                  )}
                </div>
              </div>

              {/* Technical Request Token (If needed for support) */}
              {order.shipping_request_token && (
                <div className="pt-2 border-t border-gray-50">
                  <label className="text-[10px] text-gray-400 uppercase">Request Token</label>
                  <p className="text-[10px] text-gray-300 font-mono break-all leading-tight mt-1">
                    {order.shipping_request_token}
                  </p>
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