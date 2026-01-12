// shared/utils/apiClient.js
import { createFetchClient } from '@zayne-labs/callapi'; // Changed from callApi to createFetchClient
import { storageManager } from './storageManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';

/**
 * Create a configured CallApi instance with default options
 * This can be reused across your entire application
 */
export const apiClient = createFetchClient({ // Changed from callApi to createFetchClient
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    retryAttempts: 2, // Use retryAttempts instead of retry.maxRetries
    retryDelay: 1000, // 1 second between retries
    retryStatusCodes: [408, 500, 502, 503, 504], // Use retryStatusCodes instead of retry.retryOn
    throwOnError: true, // It's often good practice to throw errors for consistent handling in calling functions.
    // Request interceptor - runs before every request
    onRequest: (context) => {
        const token = storageManager.getAccessToken();

        if (!context.request) context.request = {};
        const currentHeaders = context.request.headers || {};
        const isHeadersInstance = typeof currentHeaders?.set === 'function';

        if (token) {
            if (isHeadersInstance) {
                currentHeaders.set('Authorization', `Bearer ${token}`);
                context.request.headers = currentHeaders;
            } else {
                context.request.headers = {
                    ...currentHeaders,
                    Authorization: `Bearer ${token}`,
                };
            }
        } else {
            context.request.headers = currentHeaders;
        }
    },
    // Response interceptor - runs after every successful response
    onResponse: (context) => { // Changed response to context
        // You can transform the response data here if needed
        // For example, extract just the data property, but CallApi already provides `data` directly
        return context;
    },
    // Error interceptor - runs when request fails
    onResponseError: async (context) => { // Changed error to context
        console.error('API Error:', context.error); // Access error details via context.error

        // Handle 401 Unauthorized - session expired
        if (context.response?.status === 401) {
            storageManager.clearAll();
            // Redirect will happen in clearAll()
        }

        // Handle 403 Forbidden
        if (context.response?.status === 403) {
            console.error('Access forbidden');
        }

        // Handle 404 Not Found
        if (context.response?.status === 404) {
            console.error('Resource not found');
        }

        // Handle 422 Validation Errors
        if (context.response?.status === 422) {
            const errors = context.error?.errorData?.errors || {}; // Access errorData from context.error
            console.error('Validation errors:', errors);
        }

        // Handle 500 Server Errors
        if (context.response?.status >= 500) {
            console.error('Server error occurred');
        }

        // Re-throw the original error so it can be caught by the calling function
        // If throwOnError is true on the client, you don't need to re-throw here.
        // However, if you perform custom error handling and then want to re-throw,
        // you would re-throw `context.error.originalError` or a new `Error` instance.
        throw context.error; // Throw the CallApi error object
    },
});

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
    /**
     * GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} config - Additional config options
     * @returns {Promise} Response data
     */
    get: (endpoint, config = {}) => {
        return apiClient(endpoint, { // Call the apiClient instance directly
            method: 'GET',
            ...config,
        });
    },

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} config - Additional config options
     * @returns {Promise} Response data
     */
    post: (endpoint, data, config = {}) => {
        return apiClient(endpoint, { // Call the apiClient instance directly
            method: 'POST',
            body: data,
            ...config,
        });
    },

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} config - Additional config options
     * @returns {Promise} Response data
     */
    put: (endpoint, data, config = {}) => {
        return apiClient(endpoint, { // Call the apiClient instance directly
            method: 'PUT',
            body: data,
            ...config,
        });
    },

    /**
     * PATCH request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} config - Additional config options
     * @returns {Promise} Response data
     */
    patch: (endpoint, data, config = {}) => {
        return apiClient(endpoint, { // Call the apiClient instance directly
            method: 'PATCH',
            body: data,
            ...config,
        });
    },

    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} config - Additional config options
     * @returns {Promise} Response data
     */
    delete: (endpoint, config = {}) => {
        return apiClient(endpoint, { // Call the apiClient instance directly
            method: 'DELETE',
            ...config,
        });
    },

    /**
     * Upload file(s)
     * @param {string} endpoint - API endpoint
     * @param {FormData} formData - FormData with file(s)
     * @param {Object} config - Additional config options
     * @returns {Promise} Response data
     */
    upload: (endpoint, formData, config = {}) => {
        return apiClient(endpoint, { // Call the apiClient instance directly
            method: 'POST',
            body: formData,
            // CallApi automatically sets Content-Type for FormData
            ...config,
        });
    },
};

/**
 * Helper function to handle API errors consistently
 * @param {Error} error - The error object from CallApi
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
    // Check for validation errors (422)
    // CallApi's ValidationError has error.name === 'ValidationError' and error.errorData
    if (error.name === 'ValidationError') {
        const errors = error.errorData || {}; // CallApi validation errors are in errorData
        // Assuming your validation error structure for 422
        // You might need to adjust this based on the actual structure of error.errorData from your backend
        if (Array.isArray(errors) && errors.length > 0) {
            return errors[0].message || 'Validation failed';
        }
        return 'Validation failed.';
    }

    // Check for HTTP errors (which also have a response)
    if (error.name === 'HTTPError') {
        // Check for custom error message from API
        if (error.errorData?.message) { // Access errorData from the HTTPError object
            return error.errorData.message;
        }

        // Check for generic error property
        if (error.errorData?.error) {
            return error.errorData.error;
        }

        // Status-based messages
        switch (error.response?.status) {
            case 401:
                return 'Session expired. Please login again.';
            case 403:
                return 'You do not have permission to perform this action.';
            case 404:
                return 'The requested resource was not found.';
            case 413: // Specific for file upload error
                return 'Photo file is too large. Please choose a smaller file.';
            case 500:
                return 'Server error. Please try again later.';
            case 503:
                return 'Service unavailable. Please try again later.';
            default:
                return error.message || 'An unexpected error occurred.';
        }
    }

    // Network errors (e.g., TypeError, AbortError for timeout)
    if (error.name === 'TypeError' || error.name === 'AbortError') { // AbortError for timeouts in CallApi
        return 'Network error or request timed out. Please check your connection.';
    }

    // Generic fallback for any other unexpected errors
    return error.message || 'An unexpected error occurred.';
};

export default apiClient;
