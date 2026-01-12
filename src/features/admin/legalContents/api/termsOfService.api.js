// api/termsOfService.api.js
import { storageManager } from '../../../../shared/utils/storageManager';

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

export const termsOfServiceApi = {
    /**
     * Get all terms of service with pagination
     */
    async getAll(params = {}) {
        const qs = buildQueryString(params);
        const res = await fetch(`${BASE_URL}/admin/terms-of-services${qs}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Get a specific terms of service by ID
     */
    async getById(id) {
        const res = await fetch(`${BASE_URL}/admin/terms-of-services/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Create new terms of service
     */
    async create(data) {
        const res = await fetch(`${BASE_URL}/admin/terms-of-services`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    /**
     * Update existing terms of service
     */
    async update(id, data) {
        const res = await fetch(`${BASE_URL}/admin/terms-of-services/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    /**
     * Delete terms of service
     */
    async delete(id) {
        const res = await fetch(`${BASE_URL}/admin/terms-of-services/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Publish specific terms of service
     */
    async publish(id) {
        const res = await fetch(`${BASE_URL}/admin/terms-of-services/${id}/publish`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Unpublish specific terms of service
     */
    async unpublish(id) {
        const res = await fetch(`${BASE_URL}/admin/terms-of-services/${id}/unpublish`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    }
};