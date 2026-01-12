import { storageManager } from '../../../../shared/utils/storageManager'; // Adjust path as needed

const BASE_URL = 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';

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

export const privacyPolicyApi = {
    /**
     * List all privacy policies with pagination
     * @param {object} params - { page, per_page }
     */
    async getAll(params = {}) {
        const queryString = buildQueryString(params);
        const res = await fetch(`${BASE_URL}/admin/privacy-policies${queryString}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Get a specific privacy policy by ID
     */
    async get(id) {
        const res = await fetch(`${BASE_URL}/admin/privacy-policies/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Create a new privacy policy
     * @param {object} data - { content, is_published, published_at }
     */
    async create(data) {
        const res = await fetch(`${BASE_URL}/admin/privacy-policies`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    /**
     * Update an existing privacy policy
     */
    async update(id, data) {
        const res = await fetch(`${BASE_URL}/admin/privacy-policies/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    /**
     * Delete a privacy policy
     */
    async delete(id) {
        const res = await fetch(`${BASE_URL}/admin/privacy-policies/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Publish a specific policy
     */
    async publish(id) {
        const res = await fetch(`${BASE_URL}/admin/privacy-policies/${id}/publish`, {
            method: 'POST', // Spec says POST
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Unpublish a specific policy
     */
    async unpublish(id) {
        const res = await fetch(`${BASE_URL}/admin/privacy-policies/${id}/unpublish`, {
            method: 'POST', // Spec says POST
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    }
};