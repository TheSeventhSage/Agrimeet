// COMPLETE REPLACEMENT of kyc.api.js
const API_BASE_URL = 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';
import { storageManager } from '../utils/storageManager';

export const submitKYC = async (formData) => {
    const token = storageManager.getAccessToken();
    if (!token) {
        throw new Error('Authentication required. Please login first.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/buyer/kyc/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: formData
        });

        if (response.status === 401) {
            storageManager.clearAll();
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Submission failed with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('KYC submission error:', error);
        throw error;
    }
};
export const getKYCStatus = async () => {

    const token = storageManager.getAccessToken();
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/seller/kyc/status`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // storageManager.updateLastActivity();
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching KYC status:', error);
    }
    return null;
};