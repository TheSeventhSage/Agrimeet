import { api } from '../../../../shared/utils/apiClient';

/**
 * Get all orders (Admin)
 * @param {object} params - Filter params { page, ... }
 * @returns {Promise} - Paginated list of orders
 */
export const getOrders = async (query = {}) => {
    try {
        const response = await api.get('/admin/orders', { query });
        return response;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

/**
 * Update order details (Payment Status)
 * @param {number} orderId - The Order ID
 * @param {string} paymentStatus - 'pending'|'paid'|'failed'|'refunded'
 * @returns {Promise} - Updated order data
 */
export const updateOrderPaymentStatus = async (orderId, paymentStatus) => {
    try {
        const response = await api.put(`/admin/orders/${orderId}`, {
            query: paymentStatus
        });
        return response;
    } catch (error) {
        console.error('Error updating order payment status:', error);
        throw error;
    }
};

/**
 * Update individual item fulfillment status
 * @param {number} orderId - The Order ID
 * @param {number} productId - The Product ID
 * @param {string} status - 'unfulfilled'|'fulfilled'|'cancelled'
 * @returns {Promise} - Success response
 */
export const updateItemFulfillment = async (orderId, productId, status) => {
    try {
        const response = await api.put(`/admin/orders/${orderId}/items/${productId}/fulfillment`, {
            query: status
        });
        return response;
    } catch (error) {
        console.error('Error updating item fulfillment:', error);
        throw error;
    }
};

/**
 * [TEST ONLY] Manually mark order as delivered and credit seller wallets
 * @param {number} orderId - The Order ID
 * @returns {Promise} - Success response with credited details
 */
export const testMarkOrderDelivered = async (orderId) => {
    try {
        const response = await api.post(`/admin/orders/${orderId}/test-deliver`);
        return response;
    } catch (error) {
        console.error('Error marking order as delivered:', error);
        throw error;
    }
};

const adminOrderService = {
    getOrders,
    updateOrderPaymentStatus,
    updateItemFulfillment,
    testMarkOrderDelivered
};

export default adminOrderService;