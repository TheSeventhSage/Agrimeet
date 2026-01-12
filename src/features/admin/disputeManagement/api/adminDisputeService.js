import { api } from '../../../../shared/utils/apiClient';

/**
 * Get all disputes with optional filters
 * @param {object} filters - Filter options (search, status, etc.)
 * @returns {Promise} - List of disputes
 */
export const getAllDisputes = async (filters = {}) => {
    try {
        const params = {};

        // Map component filters to API params if needed
        if (filters.search) {
            params.search = filters.search;
        }

        // Note: The provided swagger definition lists a simple array response.
        // If the backend supports pagination/filtering query params not shown in swagger,
        // they can be passed here.
        if (filters.status && filters.status !== 'all') {
            params.status = filters.status;
        }

        const response = await api.get('/admin/disputes', { params });
        return response;
    } catch (error) {
        console.error('Error fetching disputes:', error);
        throw error;
    }
};

/**
 * Get a single dispute by ID
 * @param {number} id - Dispute ID
 * @returns {Promise} - Dispute details
 */
export const getDisputeById = async (id) => {
    try {
        const response = await api.get(`/admin/disputes/${id}`);
        return response;
    } catch (error) {
        console.error(`Error fetching dispute ${id}:`, error);
        throw error;
    }
};

/**
 * Settle or reject a dispute
 * @param {number} id - Dispute ID
 * @param {object} data - Payload containing resolution and status
 * @param {string} data.resolution - Resolution details
 * @param {string} data.status - 'settled' or 'rejected'
 * @returns {Promise} - Result message and updated dispute
 */
export const settleDispute = async (id, data) => {
    try {
        const response = await api.post(`/admin/disputes/${id}/settle`, data);
        return response;
    } catch (error) {
        console.error(`Error settling dispute ${id}:`, error);
        throw error;
    }
};

export default {
    getAllDisputes,
    getDisputeById,
    settleDispute
};