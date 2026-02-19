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

export const reviewsApi = {
    // Get all reviews for authenticated seller (Base endpoint)
    getReviews: async (page = 1) => {
        let url = `${API_BASE_URL}/seller/reviews`;
        const params = new URLSearchParams();
        params.append('page', page);

        const response = await fetch(`${url}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    },

    // Search reviews (Global Search & Date Range)
    searchReviews: async ({ search_global, start_date, end_date, page = 1 }) => {
        let url = `${API_BASE_URL}/seller/review_search`;
        const params = new URLSearchParams();

        if (search_global) params.append('search_global', search_global);
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        params.append('page', page);

        const response = await fetch(`${url}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    },

    // Filter reviews (Product, Category, Status)
    filterReviews: async ({ product_name, category_name, review_status, page = 1 }) => {
        let url = `${API_BASE_URL}/seller/review_filter`;
        const params = new URLSearchParams();

        if (product_name) params.append('product_name', product_name);
        if (category_name) params.append('category_name', category_name);
        if (review_status) params.append('review_status', review_status);
        params.append('page', page);

        const response = await fetch(`${url}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    },

    // Reply to a review (and optionally set status)
    replyToReview: async (reviewId, replyText, status = null) => {
        const payload = { review_reply: replyText };
        if (status) payload.review_status = status;

        const response = await fetch(`${API_BASE_URL}/seller/reviews/${reviewId}/reply`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        return handleResponse(response);
    },

    // Edit a review reply
    editReply: async (reviewId, replyText, status = null) => {
        const payload = {
            review_reply: replyText,
            _method: 'PUT',
        };
        if (status) payload.review_status = status;

        const response = await fetch(`${API_BASE_URL}/seller/reviews/${reviewId}/reply`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        return handleResponse(response);
    },

    // Delete a review reply
    deleteReply: async (reviewId) => {
        const response = await fetch(`${API_BASE_URL}/seller/reviews/${reviewId}/reply`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    },

    // Mark review as pending
    markAsPending: async (reviewId) => {
        const response = await fetch(`${API_BASE_URL}/seller/reviews/${reviewId}/pending`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    },

    // Delete a review completely
    deleteReview: async (reviewId) => {
        const response = await fetch(`${API_BASE_URL}/seller/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.status === 204) return true; // 204 No Content
        return handleResponse(response);
    },

    // Get review statistics (Keep if used elsewhere, or rely on search endpoint stats)
    getReviewStats: async () => {
        const response = await fetch(`${API_BASE_URL}/seller/reviews/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    }
};