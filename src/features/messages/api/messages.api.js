import { storageManager } from "../../../shared/utils/storageManager";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || error.error || 'Request failed');
    }
    return response.json();
};

export const messagesApi = {
    // Get all conversations for authenticated user
    getConversations: async ({ unread_only = false, context_type = null } = {}) => {
        // FIX: Get token inside the function call
        const token = storageManager.getAccessToken();

        let url = `${API_BASE_URL}/conversations`;
        const params = new URLSearchParams();

        if (unread_only) {
            params.append('unread_only', 'true');
        }
        if (context_type) {
            params.append('context_type', context_type);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // Get all messages in a conversation
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

    // Send a message in a conversation
    sendMessage: async (conversationId, { message }) => {
        const token = storageManager.getAccessToken();

        const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                message
            })
        });

        return handleResponse(response);
    },

    // Get total unread messages count
    getUnreadCount: async () => {
        const token = storageManager.getAccessToken();

        const response = await fetch(`${API_BASE_URL}/messages/unread-count`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return handleResponse(response);
    },

    // Send typing indicator
    sendTypingIndicator: async (conversationId, { is_typing }) => {
        const token = storageManager.getAccessToken();

        const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/typing`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                is_typing
            })
        });

        return handleResponse(response);
    }
};