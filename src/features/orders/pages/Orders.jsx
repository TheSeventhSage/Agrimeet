// pages/Orders.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import OrderTabs from '../components/OrderTabs';
import OrdersList from '../components/OrdersList';
import OrderDetails from '../components/OrderDetails';
import OrderAnalytics from '../components/OrderAnalytics';
import InvoiceModal from '../components/InvoiceModal';
import orderService from '../api/orderService';


const Orders = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [orderStats, setOrderStats] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoiceOrder, setInvoiceOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isStatsLoading, setIsStatsLoading] = useState(true);
    const [isOrderLoading, setIsOrderLoading] = useState(false);
    const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);
    const [currentFilters, setCurrentFilters] = useState({ status: 'all' });

    // Load initial data
    useEffect(() => {
        loadOrderStats();
        loadOrders();
    }, []);

    // Load orders when tab changes
    useEffect(() => {
        const filters = { ...currentFilters, status: activeTab === 'all' ? 'all' : activeTab };
        setCurrentFilters(filters);
        loadOrders(filters);
    }, [activeTab]);

    const loadOrderStats = async () => {
        try {
            setIsStatsLoading(true);
            const response = await orderService.getOrderStats();
            setOrderStats(response.data);
        } catch (error) {
            console.error('Failed to load order stats:', error);
        } finally {
            setIsStatsLoading(false);
        }
    };

    const loadOrders = async (filters = currentFilters) => {
        try {
            setIsLoading(true);
            const response = await orderService.getOrders(filters);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = async (orderId) => {
        try {
            setIsOrderLoading(true);
            setShowOrderDetails(true);
            const response = await orderService.getOrderById(orderId);
            setSelectedOrder(response.data);
        } catch (error) {
            console.error('Failed to load order details:', error);
        } finally {
            setIsOrderLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setIsOrderLoading(true);
            const response = await orderService.updateOrderStatus(orderId, newStatus);

            // Update the selected order if it's the one being updated
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(response.data);
            }

            // Refresh orders list and stats
            await Promise.all([
                loadOrders(),
                loadOrderStats()
            ]);

        } catch (error) {
            console.error('Failed to update order status:', error);
        } finally {
            setIsOrderLoading(false);
        }
    };

    const handlePrintInvoice = async (orderId) => {
        try {
            setIsInvoiceLoading(true);
            setShowInvoiceModal(true);
            const response = await orderService.generateInvoice(orderId);
            setInvoiceOrder(response.data);
        } catch (error) {
            console.error('Failed to generate invoice:', error);
            setShowInvoiceModal(false);
        } finally {
            setIsInvoiceLoading(false);
        }
    };

    const handleExportOrders = async () => {
        try {
            await orderService.exportOrders(currentFilters);
        } catch (error) {
            console.error('Failed to export orders:', error);
        }
    };

    const handleApplyFilters = (filters) => {
        setCurrentFilters(filters);
        loadOrders(filters);
    };

    const handleBackToOrders = () => {
        setShowOrderDetails(false);
        setSelectedOrder(null);
        // Refresh orders in case status was updated
        loadOrders();
        loadOrderStats();
    };

    const handleCloseInvoice = () => {
        setShowInvoiceModal(false);
        setInvoiceOrder(null);
    };

    const renderTabContent = () => {
        if (showOrderDetails) {
            return (
                <OrderDetails
                    order={selectedOrder}
                    onBack={handleBackToOrders}
                    onUpdateStatus={handleUpdateStatus}
                    onPrintInvoice={handlePrintInvoice}
                    isLoading={isOrderLoading}/>
            );
        }

        switch (activeTab) {
            case 'analytics':
                return (
                    <OrderAnalytics
                        orderStats={orderStats}
                        isLoading={isStatsLoading}
                    />
                );
            default:
                return (
                    <OrdersList
                        orders={orders}
                        isLoading={isLoading}
                        onViewDetails={handleViewDetails}
                        onUpdateStatus={handleUpdateStatus}
                        onPrintInvoice={handlePrintInvoice}
                        onExportOrders={handleExportOrders}
                        onApplyFilters={handleApplyFilters}
                        currentFilters={currentFilters}
                    />
                );
        }
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                    <p className="text-gray-600">
                        {showOrderDetails
                            ? `Order Details - ${selectedOrder?.orderNumber || ''}`
                            : 'Track and manage all customer orders'
                        }
                    </p>
                </div>

                {!showOrderDetails && (
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-600">Total Revenue</div>
                            <div className="text-xl font-bold text-gray-900">
                                ₦{(orderStats.totalRevenue || 0).toLocaleString()}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600">Total Orders</div>
                            <div className="text-xl font-bold text-gray-900">
                                {orderStats.total || 0}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tab Navigation - Hide when viewing order details */}
            {!showOrderDetails && (
                <OrderTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    orderStats={orderStats}
                />
            )}

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {renderTabContent()}
            </div>

            {/* Invoice Modal */}
            <InvoiceModal
                isOpen={showInvoiceModal}
                onClose={handleCloseInvoice}
                order={invoiceOrder}
                isLoading={isInvoiceLoading}
            />
        </DashboardLayout>
    );
};

export default Orders;