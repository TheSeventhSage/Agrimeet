// admin/api/adminCommissionService.js
import { api } from '../../../../shared/utils/apiClient';

/**
 * Get commission overview statistics
 * @param {string} period - 'today', 'week', 'month', 'year', 'all'
 * @returns {Promise} - Overview statistics
 */
export const getCommissionOverview = async (period = 'month') => {
    try {
        const response = await api.get('/admin/commissions/overview', {
            query: { period }
        });
        return response;
    } catch (error) {
        console.error('Error fetching commission overview:', error);
        throw error;
    }
};

/**
 * Get daily commission breakdown for charts
 * @param {number} days - Number of days to look back (default 30)
 * @returns {Promise} - Daily breakdown data
 */
export const getDailyBreakdown = async (days = 30) => {
    try {
        const response = await api.get('/admin/commissions/daily-breakdown', {
            query: { days }
        });
        return response;
    } catch (error) {
        console.error('Error fetching daily breakdown:', error);
        throw error;
    }
};

/**
 * Get commission breakdown by seller
 * @param {object} params - { period, payout_status }
 * @returns {Promise} - Seller commission breakdown
 */
export const getCommissionBySeller = async (params = {}) => {
    try {
        const response = await api.get('/admin/commissions/by-seller', {
            query: {
                period: params.period || 'month',
                payout_status: params.payout_status
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching seller commissions:', error);
        throw error;
    }
};

/**
 * Get list of pending seller payouts
 * @returns {Promise} - List of pending payouts
 */
export const getPendingPayouts = async () => {
    try {
        const response = await api.get('/admin/commissions/pending-payouts');
        return response;
    } catch (error) {
        console.error('Error fetching pending payouts:', error);
        throw error;
    }
};

/**
 * Mark commission records as paid
 * @param {object} data - { commission_ids: number[], seller_id: number (optional) }
 * @returns {Promise} - Success response
 */
export const markAsPaid = async (data) => {
    try {
        const response = await api.post('/admin/commissions/mark-as-paid', data);
        return response;
    } catch (error) {
        console.error('Error marking commissions as paid:', error);
        throw error;
    }
};

/**
 * Get current commission settings
 * @returns {Promise} - Commission settings
 */
export const getCommissionSettings = async () => {
    try {
        const response = await api.get('/admin/commissions/settings');
        return response;
    } catch (error) {
        console.error('Error fetching commission settings:', error);
        throw error;
    }
};

/**
 * Update commission settings
 * @param {object} settings - { commission_enabled, default_commission_rate, minimum_payout, payout_schedule }
 * @returns {Promise} - Updated settings
 */
export const updateCommissionSettings = async (settings) => {
    try {
        const response = await api.put('/admin/commissions/settings', settings);
        return response;
    } catch (error) {
        console.error('Error updating commission settings:', error);
        throw error;
    }
};

export default {
    getCommissionOverview,
    getDailyBreakdown,
    getCommissionBySeller,
    getPendingPayouts,
    markAsPaid,
    getCommissionSettings,
    updateCommissionSettings
};