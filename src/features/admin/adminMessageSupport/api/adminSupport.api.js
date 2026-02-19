import { storageManager } from "../../../../shared/utils/storageManager";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Standardized response handler consistent with your other files
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
        const error = new Error(errorData.message || errorData.error || 'Request failed');
        error.data = errorData;
        error.status = response.status;
        throw error;
    }
    return response.json();
};

export const adminSupportApi = {
    // 1. Get All Conversations (Admin View)
    getConversations: async () => {
        const token = storageManager.getAccessToken();
        const response = await fetch(`${API_BASE_URL}/conversations`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // 2. Get Messages for a specific conversation
    getMessages: async (conversationId) => {
        const token = storageManager.getAccessToken();
        const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // 3. Send Message as Admin
    sendMessage: async (conversationId, message) => {
        const token = storageManager.getAccessToken();
        const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        return handleResponse(response);
    }
};