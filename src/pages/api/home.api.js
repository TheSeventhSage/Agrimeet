// api/home.api.js
import { storageManager } from '../../shared/utils/storageManager'; // Assuming path

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Creates and returns the authorization headers for API requests.
 * @returns {HeadersInit}
 */
const getAuthHeaders = () => {
    const token = storageManager.getAccessToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

/**
 * A robust, centralized response handler.
 * @param {Response} response - The response object from fetch.
 * @returns {Promise<any>}
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            const errorText = await response.text();
            errorData = { message: errorText || 'An unknown error occurred' + e.message };
        }

        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
    }

    if (response.status === 204) {
        return null;
    }
    return response.json();
};

export const api = {
    // --- Existing Functions (Upgraded) ---
    async getAllCategories() {
        try {
            const response = await fetch(`${BASE_URL}/allcategories`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await handleResponse(response);
            return result.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    async getAllProducts(page = 1, perPage = 12, filters = {}) {
        const url = new URL(`${BASE_URL}/allproducts`);
        url.searchParams.append('page', String(page));
        url.searchParams.append('per_page', String(perPage));

        // --- NEW DYNAMIC FILTER BLOCK ---
        // Iterates over the filters object and adds any valid filter to the URL
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                url.searchParams.append(key, String(value));
            }
        });
        // --- END NEW BLOCK ---

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    async getProduct(productId) {
        try {
            const response = await fetch(`${BASE_URL}/seller/products/${productId}/show_product`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Error fetching product:", error);
            throw error;
        }
    },

    async getProductReviews(productId) {
        try {
            const response = await fetch(
                `${BASE_URL}/buyer/allreviews?product_id=${productId}&page=${1}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const data = await handleResponse(response);
            return data;

        } catch (error) {
            // --- NEW CATCH BLOCK ---
            // Check if the error is the 404 "No reviews found"
            if (error.status === 404) {
                // This is the "warning instead of error" you requested
                console.warn(
                    `API Warning: ${error.message || 'No reviews found'}. Returning empty array for reviews.`
                );
                // Return the expected success structure, but empty.
                return { data: [], links: {}, meta: {} };
            }

            // If it's a different error (e.g., 500, 422), re-throw it.
            console.error('Error fetching product reviews:', error);
            throw error;
        }
    },

    /**
     * Submits a new review for a product.
     * POST /buyer/reviews
     */
    async submitReview(reviewData) {
        try {
            const response = await fetch(`${BASE_URL}/buyer/reviews`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(reviewData),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error submitting review:', error);
            throw error;
        }
    },

    /**
     * Likes a specific review.
     * POST /buyer/reviews/{review}/like
     */
    async likeReview(reviewId) {
        try {
            const response = await fetch(`${BASE_URL}/buyer/reviews/${reviewId}/like`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error liking review:', error);
            throw error;
        }
    },

    /**
     * Unlikes a specific review.
     * DELETE /buyer/reviews/{review}/unlike
     */
    async unlikeReview(reviewId) {
        try {
            const response = await fetch(`${BASE_URL}/buyer/reviews/${reviewId}/unlike`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error unliking review:', error);
            throw error;
        }
    },
};