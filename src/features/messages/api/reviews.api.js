import { storageManager } from "../../../shared/utils/storageManager";

const API_BASE_URL = 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';

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
    // Get all reviews for authenticated seller
    getReviews: async (// { page = 1, rating = null } = {}
    ) => {
        let url = `${API_BASE_URL}/seller/reviews`;
        // const params = new URLSearchParams();

        // if (page) {
        //     params.append('page', page.toString());
        // }
        // if (rating) {
        //     params.append('rating', rating.toString());
        // }

        // if (params.toString()) {
        //     url += `?${params.toString()}`;
        // }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const result = await handleResponse(response);

        // Transform the data to match what the component expects
        return {
            data: result.data.map(review => ({
                ...review,
                comment: review.review_comment, // Map review_comment to comment
                buyer_name: review.user?.name || 'Anonymous'
            })),
            average_rating: result.average_rating,
            total_reviews: result.total_reviews,
            ratings_count: result.ratings_count,
            pagination: result.pagination
        };
    },

    // Reply to a review
    replyToReview: async (reviewId, { review_reply, review_status = 'approved' }) => {
        const response = await fetch(`${API_BASE_URL}/seller/reviews/${reviewId}/reply`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                review_reply,
                review_status
            })
        });

        return handleResponse(response);
    },

    // Edit a review reply
    editReply: async (reviewId, { review_reply }) => {
        const response = await fetch(`${API_BASE_URL}/seller/reviews/${reviewId}/reply`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                review_reply
            })
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
        const response = await fetch(`${API_BASE_URL}/seller/reviews/${reviewId}/mark-pending`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    }
};