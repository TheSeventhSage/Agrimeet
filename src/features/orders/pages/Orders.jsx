import { useState, useEffect } from 'react';
import OrderTabs from '../components/OrderTabs';
import OrdersList from '../components/OrdersList';
import OrderDetails from '../components/OrderDetails';
import OrderAnalytics from '../components/OrderAnalytics';
import InvoiceModal from '../components/InvoiceModal';
import { orderService } from '../api/orderService';
import DashboardLayout from '../../../layouts/DashboardLayout';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});

  // Invoice Modal State
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  // Fetch orders when tab, filters, or page changes
  useEffect(() => {
    fetchOrders();
  }, [activeTab, filters, pagination.current_page]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const apiFilters = {
        ...filters,
        status: activeTab === 'all' ? '' : activeTab,
        page: pagination.current_page
      };

      const response = await orderService.getOrders(apiFilters);

      // Handle response structure (adjust based on your actual API response)
      setOrders(response.data || []);
      setOrderStats(response.stats || {});
      if (response.meta) {
        setPagination({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      setIsLoading(true);
      const order = await orderService.getOrderDetails(orderId);
      setSelectedOrder(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, { status });

      // Update local state to reflect change immediately
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }

      // Optional: Refetch to get updated server-side calculations
      // fetchOrders(); 
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePrintInvoice = async (orderOrId) => {
    // 1. Input Validation
    if (!orderOrId) {
      console.error("Invalid argument passed to handlePrintInvoice");
      showError("Unable to generate invoice: Missing order information.");
      return;
    }

    try {
      // Use a specific loading state if available, or general isLoading
      setIsLoading(true);
      let orderToPrint = null;

      // 2. Determine if Input is Object (from Details) or ID (from List)
      if (typeof orderOrId === 'object' && orderOrId !== null) {
        // We have the object, but let's ensure it has an ID
        if (!orderOrId.id) throw new Error("Invalid order data structure.");
        orderToPrint = orderOrId;
      }
      else if (typeof orderOrId === 'number' || typeof orderOrId === 'string') {
        // We have an ID, fetch the full details to ensure fresh data for the invoice
        try {
          orderToPrint = await orderService.getOrderDetails(orderOrId);
        } catch (fetchError) {
          throw new Error("Failed to retrieve fresh order details from server.");
        }
      }
      else {
        throw new Error("Invalid order identifier format.");
      }

      // 3. Final Data Integrity Check
      if (!orderToPrint) {
        throw new Error("Order data is missing or could not be loaded.");
      }

      // 4. Success State Updates
      setInvoiceOrder(orderToPrint);
      setShowInvoice(true);

    } catch (error) {
      console.error('Invoice Generation Error:', error);

      // 5. User-Friendly Error Messaging
      let userMessage = "Failed to load invoice.";

      if (error.message.includes('Network')) {
        userMessage = "Network error. Please check your internet connection.";
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        userMessage = "Order details could not be found.";
      } else if (error.message) {
        userMessage = error.message;
      }

      showError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };


  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  // --- RENDER VIEW: DETAILS ---
  if (selectedOrder) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6">
          <OrderDetails
            order={selectedOrder}
            onBack={handleBackToList}
            onUpdateStatus={handleUpdateStatus}
            onPrintInvoice={handlePrintInvoice} // Correctly passed here
            isLoading={isLoading}
          />

          {/* Invoice Modal available in Details View */}
          <InvoiceModal
            isOpen={showInvoice}
            onClose={() => setShowInvoice(false)}
            order={invoiceOrder}
          />
        </div>
      </DashboardLayout>
    );
  }

  // --- RENDER VIEW: LIST ---
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Manage and track your customer orders</p>
        </div>

        <OrderTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          orderStats={orderStats || {}}
        />

        {activeTab === 'analytics' ? (
          <OrderAnalytics
            orderStats={orderStats}
            isLoading={!orderStats}
          />
        ) : (
          <OrdersList
            orders={orders}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            onPrintInvoice={handlePrintInvoice}
            onApplyFilters={handleApplyFilters}
            onPageChange={handlePageChange}
            pagination={pagination}
            currentFilters={filters}
          />
        )}

        <InvoiceModal
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
          order={invoiceOrder}
        />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;