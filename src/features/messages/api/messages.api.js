import { storageManager } from "../../../shared/utils/storageManager";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        // Capture the full error body to handle specific cases like 400
        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
        const error = new Error(errorData.message || errorData.error || 'Request failed');
        error.data = errorData;
        error.status = response.status;
        throw error;
    }
    return response.json();
};

export const messagesApi = {
    // Initialize or Retrieve Admin Conversation
    initiateAdminChat: async () => {
        const token = storageManager.getAccessToken();
        try {
            const response = await fetch(`${API_BASE_URL}/seller/conversations/admin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: "Start of support conversation"
                })
            });

            return await handleResponse(response);
        } catch (error) {
            // FIX: specific handling for the "Conversation already exists" 400 case
            if (error.status === 400 && error.data) {
                // The backend returns { conversation: {...}, error: "..." }
                // We must return ONLY the conversation object to the UI
                if (error.data.conversation) {
                    return error.data.conversation;
                }
                return error.data;
            }
            throw error;
        }
    },

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

export const adminMessagesApi = {
    // Initialize or Retrieve Admin Conversation
    initiateAdminChat: async () => {
        const token = storageManager.getAccessToken();
        try {
            const response = await fetch(`${API_BASE_URL}/seller/conversations/admin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: "Start of support conversation"
                })
            });

            return await handleResponse(response);
        } catch (error) {
            // SPECIFIC HANDLER: "Conversation already exists" (400)
            // Backend returns: { error: "...", conversation: { ... } }
            if (error.status === 400 && error.data && error.data.conversation) {
                return error.data.conversation;
            }
            throw error;
        }
    },

    // Get messages (Reuses standard endpoint but isolated for Admin usage)
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

    // Send message
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
    },

    // Send typing indicator
    sendTyping: async (conversationId, is_typing) => {
        const token = storageManager.getAccessToken();
        await fetch(`${API_BASE_URL}/conversations/${conversationId}/typing`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ is_typing })
        });
    }
};