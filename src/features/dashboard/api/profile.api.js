// modules/auth/api/profile.api.js
import { api, getErrorMessage } from '../../../shared/utils/apiClient';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';

/**
 * Get user profile details
 * @param {number} userId - The user ID
 * @returns {Promise} User profile data
 */
export const getUserProfile = async (userId) => {
    try {
        const response = await api.get(`/buyer/users/${userId}`);
        return response;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Update user profile
 * @param {number} userId - The user ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} Updated profile data
 */
export const updateUserProfile = async (userId, profileData) => {
    try {
        const response = await api.put(`/buyer/users/${userId}`, profileData);
        return response;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error(getErrorMessage(error));
    }
};


/**
 * Upload profile photo
 * @param {number} userId - The user ID
 * @param {File} photoFile - The photo file to upload
 * @returns {Promise} Updated profile data with new photo URL
 */
export const uploadProfilePhoto = async (userId, photoFile) => {
    try {
        const formData = new FormData();
        formData.append('profile_photo', photoFile);

        const response = await api.upload(`/buyer/users/${userId}/photo`, formData);
        return response;
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        
        // Special handling for file upload errors
        if (error.response?.status === 413) {
            throw new Error('Photo file is too large. Please choose a smaller file.');
        }
        
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Delete profile photo
 * @param {number} userId - The user ID
 * @returns {Promise} Success response
 */
export const deleteProfilePhoto = async (userId) => {
    try {
        const response = await api.delete(`/buyer/users/${userId}/photo`);
        return response;
    } catch (error) {
        console.error('Error deleting profile photo:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Fetch all business types
 * @returns {Promise} List of business types
 */
export const getBusinessTypes = async () => {
    try {
        const response = await api.get('/allbusinesstypes');
        console.log(response.data.data);
        
        return response?.data?.data || [];
    } catch (error) {
        console.error('Error fetching business types:', error);
        throw new Error(getErrorMessage(error));
    }
};
