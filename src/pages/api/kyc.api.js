// kyc.api.js
const API_BASE_URL = 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';
import { storageManager } from '../../shared/utils/storageManager';

// 1. MAIN SUBMISSION (Step 1)
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
                // Content-Type is set automatically for FormData
            },
            body: formData
        });

        if (response.status === 401) {
            storageManager.clearAll();
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Submission failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('KYC submission error:', error);
        throw error;
    }
};

// 2. UPDATE COORDINATES (Step 2)
export const updateSellerLocation = async (latitude, longitude) => {
    const token = storageManager.getAccessToken();
    if (!token) throw new Error('Authentication required.');

    try {
        const response = await fetch(`${API_BASE_URL}/seller/update-location`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ latitude, longitude })
        });

        if (!response.ok) throw new Error('Failed to update location coordinates');
        return await response.json();
    } catch (error) {
        console.error('Location update error:', error);
        // We return null instead of throwing so the flow can continue if strictly necessary, 
        // but ideally this should succeed.
        return null;
    }
};

// 3. VALIDATE ADDRESS / GENERATE TRACKING (Step 3)
export const validateSellerAddress = async (sellerId) => {
    const token = storageManager.getAccessToken();
    if (!token) throw new Error('Authentication required.');

    try {
        const response = await fetch(`${API_BASE_URL}/seller/kyc/validate-seller-address`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ seller_id: sellerId })
        });

        if (!response.ok) throw new Error('Address validation failed');
        return await response.json();
    } catch (error) {
        console.error('Address validation error:', error);
        throw error;
    }
};

// EXISTING STATUS CHECK
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
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Get KYC status error:', error);
        return null;
    }
};

export const getBusinessTypes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/allbusinesstypes`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch business types');
        }

        // console.log(await response.json())
        return await response.json();
    } catch (error) {
        console.error('Error fetching business types:', error);
        return []; // Return empty array on failure so the app doesn't crash
    }
};

export const getBanks = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/banks`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to fetch banks');

        const result = await response.json();
        // Return the data array directly
        return result.status === 'success' ? result.data : [];
    } catch (error) {
        console.error('Error fetching banks:', error);
        return [];
    }
};