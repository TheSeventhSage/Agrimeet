// services/orderService.js
import { showSuccess } from '../../../shared/utils/alert';

// Mock API delay function
const mockApiDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Order status configurations
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
};

export const STATUS_CONFIG = {
    [ORDER_STATUS.PENDING]: {
        label: 'Pending',
        color: 'text-orange-800 bg-orange-100',
        badgeColor: 'bg-orange-500'
    },
    [ORDER_STATUS.CONFIRMED]: {
        label: 'Confirmed',
        color: 'text-blue-800 bg-blue-100',
        badgeColor: 'bg-blue-500'
    },
    [ORDER_STATUS.PROCESSING]: {
        label: 'Processing',
        color: 'text-purple-800 bg-purple-100',
        badgeColor: 'bg-purple-500'
    },
    [ORDER_STATUS.SHIPPED]: {
        label: 'Shipped',
        color: 'text-indigo-800 bg-indigo-100',
        badgeColor: 'bg-indigo-500'
    },
    [ORDER_STATUS.DELIVERED]: {
        label: 'Delivered',
        color: 'text-green-800 bg-green-100',
        badgeColor: 'bg-green-500'
    },
    [ORDER_STATUS.CANCELLED]: {
        label: 'Cancelled',
        color: 'text-red-800 bg-red-100',
        badgeColor: 'bg-red-500'
    },
    [ORDER_STATUS.REFUNDED]: {
        label: 'Refunded',
        color: 'text-gray-800 bg-gray-100',
        badgeColor: 'bg-gray-500'
    }
};

// Mock orders data
const generateMockOrders = () => [
    {
        id: 'ORD-2024-001',
        orderNumber: '#ORD-2024-001',
        customer: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+234 801 234 5678'
        },
        items: [
            {
                id: 1,
                name: 'Premium Wireless Headphones',
                quantity: 2,
                price: 45000,
                image: '/api/placeholder/60/60'
            },
            {
                id: 2,
                name: 'Smartphone Case',
                quantity: 1,
                price: 8500,
                image: '/api/placeholder/60/60'
            }
        ],
        subtotal: 98500,
        tax: 7880,
        shipping: 2500,
        total: 108880,
        status: ORDER_STATUS.PROCESSING,
        paymentMethod: 'Card',
        paymentStatus: 'paid',
        shippingAddress: {
            street: '123 Lagos Street',
            city: 'Lagos',
            state: 'Lagos State',
            country: 'Nigeria',
            zipCode: '100001'
        },
        trackingNumber: 'TRK123456789',
        orderDate: '2024-01-15',
        estimatedDelivery: '2024-01-20',
        notes: 'Handle with care - fragile items'
    },
    {
        id: 'ORD-2024-002',
        orderNumber: '#ORD-2024-002',
        customer: {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+234 802 345 6789'
        },
        items: [
            {
                id: 3,
                name: 'Gaming Mouse',
                quantity: 1,
                price: 25000,
                image: '/api/placeholder/60/60'
            }
        ],
        subtotal: 25000,
        tax: 2000,
        shipping: 1500,
        total: 28500,
        status: ORDER_STATUS.DELIVERED,
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'paid',
        shippingAddress: {
            street: '456 Abuja Avenue',
            city: 'Abuja',
            state: 'FCT',
            country: 'Nigeria',
            zipCode: '900001'
        },
        trackingNumber: 'TRK987654321',
        orderDate: '2024-01-10',
        estimatedDelivery: '2024-01-15',
        deliveredDate: '2024-01-14',
        notes: null
    },
    {
        id: 'ORD-2024-003',
        orderNumber: '#ORD-2024-003',
        customer: {
            name: 'Mike Johnson',
            email: 'mike.j@example.com',
            phone: '+234 803 456 7890'
        },
        items: [
            {
                id: 4,
                name: 'Bluetooth Speaker',
                quantity: 1,
                price: 32000,
                image: '/api/placeholder/60/60'
            },
            {
                id: 5,
                name: 'Phone Charger',
                quantity: 2,
                price: 5000,
                image: '/api/placeholder/60/60'
            }
        ],
        subtotal: 42000,
        tax: 3360,
        shipping: 2000,
        total: 47360,
        status: ORDER_STATUS.SHIPPED,
        paymentMethod: 'Card',
        paymentStatus: 'paid',
        shippingAddress: {
            street: '789 Port Harcourt Road',
            city: 'Port Harcourt',
            state: 'Rivers State',
            country: 'Nigeria',
            zipCode: '500001'
        },
        trackingNumber: 'TRK456789123',
        orderDate: '2024-01-12',
        estimatedDelivery: '2024-01-18',
        notes: 'Deliver to office reception'
    }
];

class OrderService {
    constructor() {
        this.orders = generateMockOrders();
    }

    // Get all orders with optional filtering
    async getOrders(filters = {}) {
        await mockApiDelay(800);

        let filteredOrders = [...this.orders];

        // Apply status filter
        if (filters.status && filters.status !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === filters.status);
        }

        // Apply search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredOrders = filteredOrders.filter(order =>
                order.orderNumber.toLowerCase().includes(searchTerm) ||
                order.customer.name.toLowerCase().includes(searchTerm) ||
                order.customer.email.toLowerCase().includes(searchTerm)
            );
        }

        // Apply date filter
        if (filters.dateFrom || filters.dateTo) {
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.orderDate);
                const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
                const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

                if (fromDate && orderDate < fromDate) return false;
                if (toDate && orderDate > toDate) return false;
                return true;
            });
        }

        return {
            success: true,
            data: filteredOrders,
            total: filteredOrders.length
        };
    }

    // Get single order by ID
    async getOrderById(orderId) {
        await mockApiDelay(500);

        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        return {
            success: true,
            data: order
        };
    }

    // Update order status
    async updateOrderStatus(orderId, newStatus) {
        await mockApiDelay(1000);

        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
            throw new Error('Order not found');
        }

        const order = this.orders[orderIndex];
        const oldStatus = order.status;

        // Update the order
        this.orders[orderIndex] = {
            ...order,
            status: newStatus,
            ...(newStatus === ORDER_STATUS.DELIVERED && {
                deliveredDate: new Date().toISOString().split('T')[0]
            })
        };

        showSuccess(`Order ${order.orderNumber} status updated from ${STATUS_CONFIG[oldStatus]?.label} to ${STATUS_CONFIG[newStatus]?.label}`);

        return {
            success: true,
            data: this.orders[orderIndex]
        };
    }

    // Generate invoice data
    async generateInvoice(orderId) {
        await mockApiDelay(800);

        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        return {
            success: true,
            data: {
                ...order,
                invoiceNumber: `INV-${order.id}`,
                invoiceDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        };
    }

    // Get order statistics
    async getOrderStats() {
        await mockApiDelay(600);

        const stats = {
            total: this.orders.length,
            pending: this.orders.filter(o => o.status === ORDER_STATUS.PENDING).length,
            processing: this.orders.filter(o => o.status === ORDER_STATUS.PROCESSING).length,
            shipped: this.orders.filter(o => o.status === ORDER_STATUS.SHIPPED).length,
            delivered: this.orders.filter(o => o.status === ORDER_STATUS.DELIVERED).length,
            cancelled: this.orders.filter(o => o.status === ORDER_STATUS.CANCELLED).length,
            totalRevenue: this.orders
                .filter(o => o.paymentStatus === 'paid')
                .reduce((sum, order) => sum + order.total, 0)
        };

        return {
            success: true,
            data: stats
        };
    }

    // Cancel order
    async cancelOrder(orderId, reason) {
        await mockApiDelay(1200);

        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
            throw new Error('Order not found');
        }

        const order = this.orders[orderIndex];

        if ([ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(order.status)) {
            throw new Error('Cannot cancel this order');
        }

        this.orders[orderIndex] = {
            ...order,
            status: ORDER_STATUS.CANCELLED,
            cancellationReason: reason,
            cancelledDate: new Date().toISOString().split('T')[0]
        };

        showSuccess(`Order ${order.orderNumber} has been cancelled successfully`);

        return {
            success: true,
            data: this.orders[orderIndex]
        };
    }

    // Export orders to CSV
    async exportOrders(filters = {}) {
        await mockApiDelay(1500);

        const { data: orders } = await this.getOrders(filters);

        // Create CSV content
        const headers = [
            'Order Number',
            'Customer Name',
            'Email',
            'Total Amount',
            'Status',
            'Order Date',
            'Payment Method'
        ];

        const csvContent = [
            headers.join(','),
            ...orders.map(order => [
                order.orderNumber,
                `"${order.customer.name}"`,
                order.customer.email,
                order.total,
                STATUS_CONFIG[order.status]?.label,
                order.orderDate,
                order.paymentMethod
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showSuccess('Orders exported successfully');

        return {
            success: true,
            message: 'Orders exported successfully'
        };
    }
}

// Create singleton instance
const orderService = new OrderService();
export default orderService;