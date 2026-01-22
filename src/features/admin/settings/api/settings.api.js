import { storageManager } from '../../../../shared/utils/storageManager'; // Adjust this path

// Use the same BASE_URL as your existing admin.api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthToken = () => {
    return storageManager.getAccessToken() || '';
};

/**
 * Builds the standard headers for authorized requests.
 * @param {boolean} isJson - Whether to set Content-Type for JSON.
 */
const getAuthHeaders = (isJson = true) => {
    const headers = {
        Authorization: `Bearer ${getAuthToken()}`,
        Accept: 'application/json', // Always accept JSON
    };
    if (isJson) {
        headers['Content-Type'] = 'application/json';
    }
    // For FormData (isJson = false), we let the browser set the Content-Type
    // with the correct multipart boundary.
    return headers;
};

/**
 * Handles and normalizes all fetch responses.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { message: 'An unknown error occurred.' };
        }
        const error = new Error(errorData.message || `Error ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
    }

    if (response.status === 204) return null; // Handle 204 (No Content)
    return response.json();
};

/**
 * Builds a query string from an object, filtering out null/undefined/empty.
 */
const buildQueryString = (params = {}) => {
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    return queryString ? `?${queryString}` : '';
};

/**
 * Safely extracts readable error messages from API responses.
 */
export const getErrorMessage = (error) => {
    if (error?.data?.errors) {
        // Handle 422 Validation Errors (Laravel)
        return Object.values(error.data.errors).flat().join(' ');
    }
    if (error?.data?.message) return error.data.message;
    if (error?.message) return error.message;
    return 'Something went wrong. Please try again.';
};


// ------------------------------
// --- Measurement Units API ---
// ------------------------------
export const unitsApi = {
    async getAll() {
        const res = await fetch(`${BASE_URL}/admin/units`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res); // Expects { data: [...] }
    },

    async create(data) {
        const res = await fetch(`${BASE_URL}/admin/units`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    async update(id, data) {
        const res = await fetch(`${BASE_URL}/admin/units/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    async delete(id) {
        const res = await fetch(`${BASE_URL}/admin/units/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res); // Will likely be 204 No Content
    },
};

// ------------------------------
// --- Business Types API ---
// ------------------------------
export const businessTypesApi = {
    async getAll() {
        const res = await fetch(`${BASE_URL}/admin/business_types`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res); // Expects { data: [...] }
    },

    async create(data) {
        const res = await fetch(`${BASE_URL}/admin/business_types`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    async update(id, data) {
        const res = await fetch(`${BASE_URL}/admin/business_types/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    async delete(id) {
        const res = await fetch(`${BASE_URL}/admin/business_types/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },
};

// ------------------------------
// --- Categories API ---
// ------------------------------
export const categoriesApi = {
    /**
     * Get categories. Supports filters and pagination.
     * @param {object} params - e.g., { page, per_page, name, parent_id }
     */
    async getAll(params = {}) {
        // Set default per_page if page is requested
        if (params.page && !params.per_page) {
            params.per_page = 12; // Default page size
        }

        const queryString = buildQueryString(params);
        const res = await fetch(`${BASE_URL}/admin/categories${queryString}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res); // Expects { data: [...], meta: {...} }
    },

    async getSubcategories(parentId) {
        const res = await fetch(`${BASE_URL}/admin/subcategories/${parentId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    async getOne(id) {
        const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Creates a new category. Uses FormData for image upload.
     * @param {FormData} formData - Must be a FormData object.
     */
    async create(formData) {
        const res = await fetch(`${BASE_URL}/admin/categories`, {
            method: 'POST',
            headers: getAuthHeaders(false), // Not JSON
            body: formData,
        });
        return handleResponse(res);
    },

    /**
     * Updates a category. Uses FormData for image upload and _method: 'PUT'.
     * @param {number|string} id - The ID of the category to update.
     * @param {FormData} formData - Must be a FormData object with _method: 'PUT' appended.
     */
    async update(id, formData) {
        // API uses POST with _method=PUT for multipart/form-data updates
        formData.append('_method', 'PUT');

        const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
            method: 'POST', // <-- Note: POST, not PUT
            headers: getAuthHeaders(false), // Not JSON
            body: formData,
        });
        return handleResponse(res);
    },

    async delete(id) {
        const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },
};

// ------------------------------
// --- Coupons API ---
// ------------------------------
export const couponsApi = {
    /**
     * Get all coupons (Assumed endpoint, supports pagination)
     * @param {object} params - e.g., { page, per_page, code }
     */
    async getAll(params = {}) {
        if (params.page && !params.per_page) {
            params.per_page = 12; // Default page size
        }
        const queryString = buildQueryString(params);
        // Assuming this endpoint exists as it's required for management
        const res = await fetch(`${BASE_URL}/buyer/coupons${queryString}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res); // Expects { data: [...], meta: {...} }
    },

    /**
     * Create a new coupon
     * @param {object} data - Coupon data
     */
    async create(data) {
        const res = await fetch(`${BASE_URL}/admin/coupons`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    /**
     * Update an existing coupon
     * @param {number|string} id - Coupon ID
     * @param {object} data - Coupon data to update
     */
    async update(id, data) {
        const res = await fetch(`${BASE_URL}/admin/coupons/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    /**
     * Delete a coupon
     * @param {number|string} id - Coupon ID
     */
    async delete(id) {
        const res = await fetch(`${BASE_URL}/admin/coupons/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },
};

export const productAttributeApi = {

    async list(params) {
        const res = await fetch(`${BASE_URL}/seller/product-attributes`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },
    async get(id) {
        const res = await fetch(`${BASE_URL}/admin/product-attributes/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },
    async create(data) {
        const res = await fetch(`${BASE_URL}/admin/product-attributes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },
    async update(id, data) {
        const res = await fetch(`${BASE_URL}/admin/product-attributes/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },
    async delete(id) {
        const res = await fetch(`${BASE_URL}/admin/product-attributes/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (res.status === 204) return true;
        return handleResponse(res);
    }
}