// api/orderService.js
const API_BASE_URL = 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';
import { storageManager } from "../../../pages/utils/storageManager.js";

export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    badgeColor: 'bg-yellow-500'
  },
  processing: {
    label: 'Processing',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeColor: 'bg-purple-500'
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    badgeColor: 'bg-blue-500'
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 border-green-200',
    badgeColor: 'bg-green-500'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 border-red-200',
    badgeColor: 'bg-red-500'
  }
};

// Helper function to get auth token
const getAuthToken = () => {
  try {
    return storageManager.getAccessToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Map frontend status to API status parameters
const mapStatusToApiFilters = (status) => {
  switch (status) {
    case 'pending':
      return { unpaid: 'true' };
    case 'processing':
      return { unfulfilled: 'true' };
    case 'shipped':
      return { open: 'true' };
    case 'delivered':
      return { closed: 'true' };
    case 'all':
    default:
      // Load all orders by setting all status filters to true
      return {
        unfulfilled: 'true',
        unpaid: 'true',
        open: 'true',
        closed: 'true'
      };
  }
};

// Transform API order to frontend format
const transformOrderData = (apiOrder) => {
  // Determine the status based on payment and fulfillment status
  let status = 'pending';
  if (apiOrder.payment_status === 'paid') {
    if (apiOrder.fulfillment_status === 'unfulfilled') {
      status = 'processing';
    } else if (apiOrder.fulfillment_status === 'fulfilled') {
      status = apiOrder.delivered_at ? 'delivered' : 'shipped';
    }
  }
  if (apiOrder.cancelled_at) {
    status = 'cancelled';
  }

  return {
    id: apiOrder.id,
    orderNumber: apiOrder.order_number,
    status: status,
    fulfillmentStatus: apiOrder.fulfillment_status,
    paymentStatus: apiOrder.payment_status,
    total: apiOrder.total_amount,
    subtotal: apiOrder.total_amount - (apiOrder.delivery_price || 0),
    shipping: apiOrder.delivery_price || 0,
    tax: 0,
    orderDate: apiOrder.created_at,
    trackingNumber: apiOrder.tracking_number,
    paidAt: apiOrder.paid_at,
    cancelledAt: apiOrder.cancelled_at,
    deliveredAt: apiOrder.delivered_at,

    // Customer data transformation
    customer: {
      name: apiOrder.customer_fullname,
      phone: apiOrder.customer_phone,
      email: '', // API doesn't provide email
    },

    // Shipping address
    shippingAddress: {
      street: apiOrder.customer_address,
      street2: apiOrder.customer_address_2,
      city: apiOrder.customer_city,
      state: apiOrder.customer_state,
      zipCode: apiOrder.customer_postal_code,
      country: apiOrder.customer_country,
      isDefault: apiOrder.customer_default_delivery_address
    },

    // Items transformation
    items: apiOrder.items?.map(item => ({
      id: item.id,
      name: item.name,
      price: item.unit_price,
      quantity: item.quantity,
      total: item.total_price,
      variantId: item.variant_id,
      sellerId: item.seller_id,
      thumbnail: item.thumbnail,
      variantAttributes: item.variant_attributes || []
    })) || [],

    // Payment method (default to Card for paid orders)
    paymentMethod: apiOrder.payment_status === 'paid' ? 'Card' : 'Pending',

    notes: '',
    read: apiOrder.read,
    discountCode: apiOrder.discount_code
  };
};

// Calculate order statistics from orders array
const calculateOrderStats = (orders) => {
  const stats = {
    total: orders.length,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  };

  orders.forEach(order => {
    stats[order.status] = (stats[order.status] || 0) + 1;
    if (order.paymentStatus === 'paid') {
      stats.totalRevenue += order.total;
    }
  });

  return stats;
};

export const orderService = {
  // Get all orders with pagination and filters
  async getOrders(filters = {}) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const queryParams = new URLSearchParams();

      // Add status filters based on API parameters
      const statusFilters = mapStatusToApiFilters(filters.status || 'all');
      Object.entries(statusFilters).forEach(([key, value]) => {
        queryParams.append(key, value);
      });

      // Add other filters
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.dateFrom) {
        queryParams.append('date_from', filters.dateFrom);
      }
      if (filters.dateTo) {
        queryParams.append('date_to', filters.dateTo);
      }
      if (filters.paymentMethod) {
        queryParams.append('payment_method', filters.paymentMethod);
      }
      if (filters.minAmount) {
        queryParams.append('min_amount', filters.minAmount);
      }
      if (filters.maxAmount) {
        queryParams.append('max_amount', filters.maxAmount);
      }

      // Always include page parameter
      queryParams.append('page', filters.page || '1');

      const response = await fetch(
        `${API_BASE_URL}/seller/orders?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed');
        }
        if (response.status === 404) {
          throw new Error('No seller found for authenticated user');
        }
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();

      // Transform API data to match frontend format
      const transformedOrders = data.data.map(transformOrderData);
      const stats = calculateOrderStats(transformedOrders);

      return {
        orders: transformedOrders,
        stats: stats,
        pagination: data.meta,
        links: data.links
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get single order details
  async getOrder(orderId) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
        `${API_BASE_URL}/seller/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error(`Failed to fetch order: ${response.status}`);
      }

      const data = await response.json();
      return transformOrderData(data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
        `${API_BASE_URL}/seller/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Get order statistics (calculated from orders)
  async getOrderStats(filters = {}) {
    try {
      // Get orders and calculate stats
      const { stats } = await this.getOrders(filters);
      return stats;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
};