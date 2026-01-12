// pages/OrdersPage.jsx
import { useState, useEffect } from 'react';
import OrderTabs from '../components/OrderTabs';
import OrdersList from '../components/OrdersList';
import OrderDetails from '../components/OrderDetails';
import { orderService } from '../api/orderService';
import DashboardLayout from '../../../layouts/DashboardLayout';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  // Fetch orders when tab or page changes
  useEffect(() => {
    fetchOrders(pagination.current_page);
  }, [activeTab, pagination.current_page]);

  // Reset page to 1 when tab changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, current_page: 1 }));
  }, [activeTab]);

  const fetchOrders = async (page) => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrders({
        status: activeTab,
        page: page
      });

      setOrders(response.data);

      if (response.meta) {
        setPagination({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total
        });
      }
    } catch (error) {
      console.error('Failed to load orders', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setPagination(prev => ({ ...prev, current_page: newPage }));
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      setIsLoading(true);
      const details = await orderService.getOrderDetails(orderId);
      setSelectedOrder(details);
    } catch (error) {
      console.error('Error fetching details', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">

        {!selectedOrder && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-gray-500 mt-1">Manage and track your customer orders</p>
            </div>
          </div>
        )}

        {selectedOrder ? (
          <OrderDetails
            order={selectedOrder}
            onBack={() => setSelectedOrder(null)}
            onUpdateStatus={() => fetchOrders(pagination.current_page)}
          />
        ) : (
          <>
            <OrderTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <OrdersList
              orders={orders}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
              onPageChange={handlePageChange}
              pagination={pagination}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;