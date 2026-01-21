// api/orderService.js
import { storageManager } from "../../../shared/utils/storageManager.js";

const API_BASE_URL = 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';

export const STATUS_CONFIG = {
  // Payment Status Colors
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800 border-green-200' },
  unpaid: { label: 'Unpaid', color: 'bg-red-100 text-red-800 border-red-200' },

  // Fulfillment Status Colors
  fulfilled: { label: 'Fulfilled', color: 'bg-green-100 text-green-800 border-green-200' },
  unfulfilled: { label: 'Unfulfilled', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },

  // Order Status Colors
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  processed: { label: 'Processed', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
  intransit: { label: 'In Transit', color: 'bg-orange-100 text-orange-800 border-orange-200' },
};

const getAuthToken = () => {
  try {
    return storageManager.getAccessToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Strict mapping based on user documentation
const mapStatusToApiFilters = (status) => {
  switch (status) {
    case 'unpaid':
      return { unpaid: 'true' };
    case 'unfulfilled':
      return { unfulfilled: 'true' };
    case 'open':
      return { open: 'true' }; // Paid but not fulfilled
    case 'closed':
      return { closed: 'true' }; // Paid and fulfilled
    case 'all':
    default:
      return {};
  }
};

const transformOrderData = (apiOrder) => {
  if (!apiOrder) return null;

  return {
    id: apiOrder.id,
    orderNumber: apiOrder.order_number,

    // Triple Status
    paymentStatus: apiOrder.payment_status || 'unpaid',
    orderStatus: apiOrder.order_status || 'pending',
    fulfillmentStatus: apiOrder.fulfillment_status || 'unfulfilled',

    orderDate: apiOrder.created_at,
    paidAt: apiOrder.paid_at,

    // Financials
    totalAmount: parseFloat(apiOrder.total_amount || 0),
    shippingAmount: parseFloat(apiOrder.shipping_amount || 0),
    sellerEarnings: parseFloat(apiOrder.total_seller_earnings || 0),
    commission: parseFloat(apiOrder.total_commission || 0),

    // Customer Info
    customer: {
      name: apiOrder.customer_fullname || 'Guest Customer',
      phone: apiOrder.customer_phone || 'N/A',
      address: apiOrder.customer_address,
      city: apiOrder.customer_city,
      state: apiOrder.customer_state,
      country: apiOrder.customer_country,
    },

    // Shipping Info
    trackingNumber: apiOrder.tracking_number,
    courierName: apiOrder.courier_name,

    // Items
    items: Array.isArray(apiOrder.items) ? apiOrder.items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: parseFloat(item.unit_price || 0),
      total: parseFloat(item.total_price || 0),
      image: item.thumbnail,
      variant: item.variant_attributes
    })) : []
  };
};

export const orderService = {
  async getOrders(params = {}) {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication token not found');

      const queryParams = new URLSearchParams();

      // Apply Tab Filter
      if (params.status && params.status !== 'all') {
        const statusFilters = mapStatusToApiFilters(params.status);
        Object.entries(statusFilters).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
      }

      // Apply Pagination
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }

      const response = await fetch(`${API_BASE_URL}/seller/orders?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized');
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const jsonResponse = await response.json();

      return {
        data: jsonResponse.data.map(transformOrderData),
        meta: jsonResponse.meta
      };

    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getOrderDetails(orderId) {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch order details');

      const jsonResponse = await response.json();
      return jsonResponse.data;

    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, data) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to update status');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

async downloadInvoice(orderId) {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Fix: Explicitly ask for PDF so the server knows (and for clarity)
          'Accept': 'application/pdf', 
        }
      });

      if (!response.ok) {
         if (response.status === 404) throw new Error('Invoice not found');
         if (response.status === 401) throw new Error('Unauthorized');
         // Try to parse JSON error if possible, otherwise generic error
         try {
            const errJson = await response.json();
            throw new Error(errJson.error || 'Failed to generate invoice');
         } catch (e) {
            throw new Error('Failed to generate invoice');
         }
      }

      // Fix: Return BLOB, do NOT try to parse as JSON
      return await response.blob();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }
};

