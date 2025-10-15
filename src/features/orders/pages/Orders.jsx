// pages/OrdersPage.jsx
import { useState, useEffect } from 'react';
import OrderTabs from '../components/OrderTabs';
import OrdersList from '../components/OrdersList';
import OrderDetails from '../components/OrderDetails';
import OrderAnalytics from '../components/OrderAnalytics';
import InvoiceModal from '../components/InvoiceModal';
import { orderService } from '../api/orderService';
import DashboardLayout from '../../../layouts/DashboardLayout'; // Import your dashboard layout

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});
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
      setOrders(response.orders);
      setOrderStats(response.stats);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // You might want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      setIsLoading(true);
      const order = await orderService.getOrder(orderId);
      setSelectedOrder(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }

      // Refetch orders to get updated counts
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePrintInvoice = async (orderId) => {
    try {
      const order = await orderService.getOrder(orderId);
      setInvoiceOrder(order);
      setShowInvoice(true);
    } catch (error) {
      console.error('Error fetching order for invoice:', error);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const handleExportOrders = () => {
    // Implement export functionality
    console.log('Export orders');
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  if (selectedOrder) {
    return (
      <DashboardLayout> {/* Wrap in dashboard layout */}
        <div className="p-6">
          <OrderDetails
            order={selectedOrder}
            onBack={handleBackToList}
            onUpdateStatus={handleUpdateStatus}
            onPrintInvoice={handlePrintInvoice}
            isLoading={isLoading}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout> {/* Wrap in dashboard layout */}
      <div className="p-6">
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
            onExportOrders={handleExportOrders}
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
          isLoading={!invoiceOrder}
        />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;