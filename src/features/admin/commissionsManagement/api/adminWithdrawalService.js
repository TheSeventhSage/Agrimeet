import { api } from '../../../../shared/utils/apiClient';

/**
 * Get all withdrawal requests (Admin)
 * @param {object} params - Filter params { page, status: 'pending'|'processing'|'completed'|'rejected' }
 * @returns {Promise} - Paginated list of withdrawals
 */
export const getWithdrawals = async (params = {}) => {
    try {
        const response = await api.get('/admin/withdrawals', { params });
        return response;
    } catch (error) {
        console.error('Error fetching withdrawals:', error);
        throw error;
    }
};

/**
 * Approve a seller withdrawal request
 * @param {number} id - The transaction ID
 * @returns {Promise} - Success response
 */
export const approveWithdrawal = async (id) => {
    try {
        // Note: Using 'withdrawl' as specified in the provided API endpoint definition
        const response = await api.post(`/admin/withdrawl/${id}/approve`);
        return response;
    } catch (error) {
        console.error('Error approving withdrawal:', error);
        throw error;
    }
};

/**
 * Reject a seller withdrawal request
 * @param {number} id - The transaction ID
 * @returns {Promise} - Success response
 */
export const rejectWithdrawal = async (id) => {
    try {
        // Note: Using 'withdrawl' as specified in the provided API endpoint definition
        const response = await api.post(`/admin/withdrawl/${id}/reject`);
        return response;
    } catch (error) {
        console.error('Error rejecting withdrawal:', error);
        throw error;
    }
};

export default {
    getWithdrawals,
    approveWithdrawal,
    rejectWithdrawal
};