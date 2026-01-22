const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Legal API Service
 * Handles all legal content endpoints (Privacy Policy, Terms of Service, FAQs)
 */
export const legalApi = {
    /**
     * Get published privacy policy
     * @returns {Promise<Object>} Privacy policy data
     */
    getPrivacyPolicy: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/legal/privacy-policy`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching privacy policy:', error);
            throw error;
        }
    },

    /**
     * Get published terms of service
     * @returns {Promise<Object>} Terms of service data
     */
    getTermsOfService: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/legal/terms-of-service`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching terms of service:', error);
            throw error;
        }
    },

    /**
     * Get all published FAQs
     * @returns {Promise<Array>} Array of FAQ items
     */
    getFaqs: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/legal/faqs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            throw error;
        }
    },
};