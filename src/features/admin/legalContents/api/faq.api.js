import { storageManager } from '../../../../shared/utils/storageManager';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthToken = () => {
    return storageManager.getAccessToken() || '';
};

const getAuthHeaders = (isJson = true) => {
    const headers = {
        Authorization: `Bearer ${getAuthToken()}`,
        Accept: 'application/json',
    };
    if (isJson) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

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

    if (response.status === 204) return null;
    return response.json();
};

const buildQueryString = (params = {}) => {
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    return queryString ? `?${queryString}` : '';
};

export const faqApi = {
    /**
     * List all FAQs with pagination
     */
    async getAll(params = {}) {
        const qs = buildQueryString(params);
        const res = await fetch(`${BASE_URL}/admin/faqs${qs}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Get a specific FAQ by ID
     */
    async getById(id) {
        const res = await fetch(`${BASE_URL}/admin/faqs/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Create a new FAQ
     */
    async create(data) {
        const res = await fetch(`${BASE_URL}/admin/faqs`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    /**
     * Update an existing FAQ
     */
    async update(id, data) {
        const res = await fetch(`${BASE_URL}/admin/faqs/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    /**
     * Delete an FAQ
     */
    async delete(id) {
        const res = await fetch(`${BASE_URL}/admin/faqs/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Publish a specific FAQ
     */
    async publish(id) {
        const res = await fetch(`${BASE_URL}/admin/faqs/${id}/publish`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Unpublish a specific FAQ
     */
    async unpublish(id) {
        const res = await fetch(`${BASE_URL}/admin/faqs/${id}/unpublish`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Reorder FAQs
     * @param {Array<{id: number, order: number}>} items 
     */
    async reorder(items) {
        const res = await fetch(`${BASE_URL}/admin/faqs/reorder`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ faqs: items }),
        });
        return handleResponse(res);
    }
};