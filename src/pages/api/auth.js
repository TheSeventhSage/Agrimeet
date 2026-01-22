const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { storageManager } from '../../shared/utils/storageManager';
import { showError } from '../../shared/utils/alert'; // ADD IMPORT

// Token management (UNCHANGED)
export const tokenManager = {
    setTokens: (accessToken, refreshToken) => {
        storageManager.setTokens(accessToken, refreshToken);
    },
    getAccessToken: () => storageManager.getAccessToken(),
    getRefreshToken: () => {
        const tokens = storageManager.getTokens();
        return tokens ? tokens.refresh_token : null;
    },
    clearTokens: () => {
        storageManager.clearAll();
    },
    isAuthenticated: () => !!storageManager.getAccessToken(),
    getAuthHeaders: () => ({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(storageManager.getAccessToken() && { 'Authorization': `Bearer ${storageManager.getAccessToken()}` })
    })
};

// Token refresh
const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenManager.getRefreshToken()}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            tokenManager.setTokens(data.access_token, data.refresh_token);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }

    // DON'T auto-redirect - let caller handle gracefully
    return false;
};

// API request
const apiRequest = async (url, options = {}) => {
    try {
        let response = await fetch(url, {
            ...options,
            headers: {
                ...tokenManager.getAuthHeaders(),
                ...options.headers
            }
        });

        // If token expired, try to refresh ONCE
        if (response.status === 401 && tokenManager.getRefreshToken()) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                // Retry original request with new token
                response = await fetch(url, {
                    ...options,
                    headers: {
                        ...tokenManager.getAuthHeaders(),
                        ...options.headers
                    }
                });
            } else {
                storageManager.clearAll();
                throw new Error('SESSION_EXPIRED');
            }
        }

        return response;
    } catch (error) {
        if (error.message === 'SESSION_EXPIRED') {
            throw error;
        }
        throw new Error('NETWORK_ERROR');
    }
};

// Async operation wrapper with error boundaries
export const withAsyncErrorHandling = async (asyncFn, context = 'operation') => {
    try {
        return await asyncFn();
    } catch (error) {
        console.error(`${context} failed:`, error);

        if (error.message === 'SESSION_EXPIRED') {
            showError('Your session has expired. Please login again.');
            // Don't redirect immediately - let caller decide when to redirect
        } else if (error.message === 'NETWORK_ERROR') {
            showError('Network error. Please check your connection.');
        }

        throw error; // Re-throw for caller handling
    }
};

// Auth API functions
export const authApi = {
    register: async (userData) => {
        return withAsyncErrorHandling(async () => {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (!response.ok) throw data;

            if (data.access_token) {
                tokenManager.setTokens(data.access_token, data.refresh_token);
            }
            return data;
        }, 'Registration');
    },

    login: async (credentials) => {
        return withAsyncErrorHandling(async () => {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            if (!response.ok) throw data;

            if (data.access_token) {
                tokenManager.setTokens(data.access_token, data.refresh_token);
            }
            return data;
        }, 'Login');
    },

    verifyOtp: async (verificationData) => {
        return withAsyncErrorHandling(async () => {
            const response = await apiRequest(`${BASE_URL}/auth/verify-code`, {
                method: 'POST',
                body: JSON.stringify(verificationData)
            });

            const data = await response.json();
            if (!response.ok) throw data;

            if (data.access_token) {
                tokenManager.setTokens(data.access_token, data.refresh_token);
            }
            return data;
        }, 'OTP verification');
    },

    resendOtp: async (email) => {
        return withAsyncErrorHandling(async () => {
            const response = await fetch(`${BASE_URL}/auth/resend-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        }, 'OTP resend');
    },

    forgotPassword: async (email) => {
        return withAsyncErrorHandling(async () => {
            const response = await fetch(`${BASE_URL}/auth/forget_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        }, 'Password reset request');
    },

    resetPassword: async (resetData) => {
        return withAsyncErrorHandling(async () => {
            const response = await fetch(`${BASE_URL}/auth/reset_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(resetData)
            });

            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        }, 'Password reset');
    },

    logout: async () => {
        return withAsyncErrorHandling(async () => {
            try {
                await apiRequest(`${BASE_URL}/auth/logout`, { method: 'POST' });
            } catch (error) {
                console.error('Logout API error:', error);
            } finally {
                tokenManager.clearTokens();
            }
        }, 'Logout');
    }


};

// General API helper
export const api = {
    get: (url) => withAsyncErrorHandling(() => apiRequest(url), `GET ${url}`),
    post: (url, data) => withAsyncErrorHandling(() => apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(data)
    }), `POST ${url}`),
    put: (url, data) => withAsyncErrorHandling(() => apiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    }), `PUT ${url}`),
    delete: (url) => withAsyncErrorHandling(() => apiRequest(url, {
        method: 'DELETE'
    }), `DELETE ${url}`)
};