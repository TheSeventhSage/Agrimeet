import { storageManager } from "../../../shared/utils/storageManager";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth token from localStorage
const token = storageManager.getAccessToken();

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || error.error || 'Request failed');
    }
    return response.json();
};

export const earningsApi = {
    // Get seller earnings overview
    getEarningsOverview: async ({ period = 'all' } = {}) => {
        let url = `${API_BASE_URL}/seller/earnings/overview`;
        const params = new URLSearchParams();

        if (period) {
            params.append('period', period);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    },

    // Get seller earnings history
    getEarningsHistory: async ({ page = 1, per_page = 15 } = {}) => {
        let url = `${API_BASE_URL}/seller/earnings/history`;
        const params = new URLSearchParams();

        params.append('page', page);
        params.append('per_page', per_page);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    },

    // Get monthly earnings trend
    getMonthlyEarningsTrend: async ({ months = 12 } = {}) => {
        let url = `${API_BASE_URL}/seller/earnings/monthly-trend`;
        const params = new URLSearchParams();

        if (months) {
            params.append('months', months);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    },

    // --- Wallet Management Endpoints ---

    // Get current wallet balance
    getWalletBalance: async () => {
        const url = `${API_BASE_URL}/seller/wallet/balance`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    },

    // Request withdrawal from wallet
    requestWithdrawal: async ({ amount }) => {
        const url = `${API_BASE_URL}/seller/wallet/withdraw`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ amount })
        });

        return handleResponse(response);
    }
};