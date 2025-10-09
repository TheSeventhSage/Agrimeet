// utils/storageManager.js - Simplified
export const storageManager = {
    KEYS: {
        USER_DATA: 'user_data',
        AUTH_TOKENS: 'auth_tokens',
        VERIFICATION_STATUS: 'verification_status',
    },

    // User data
    setUserData: (userData) => {
        localStorage.setItem(storageManager.KEYS.USER_DATA, JSON.stringify(userData));
    },

    getUserData: () => {
        const data = localStorage.getItem(storageManager.KEYS.USER_DATA);
        return data ? JSON.parse(data) : null;
    },

    // Tokens
    setTokens: (accessToken, refreshToken, roles) => {
        localStorage.setItem(storageManager.KEYS.AUTH_TOKENS, JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            role: roles,
        }));
    },

    getTokens: () => {
        const tokens = localStorage.getItem(storageManager.KEYS.AUTH_TOKENS);
        return tokens ? JSON.parse(tokens) : null;
    },

    getAccessToken: () => {
        const tokens = storageManager.getTokens();
        return tokens ? tokens.access_token : null;
    },

    // Verification status
    setVerificationStatus: (status) => {
        localStorage.setItem(storageManager.KEYS.VERIFICATION_STATUS, status);
    },

    getVerificationStatus: () => {
        return localStorage.getItem(storageManager.KEYS.VERIFICATION_STATUS) || 'unverified';
    },

    isEmailVerified: () => {
        return storageManager.getVerificationStatus() === 'verified';
    },

    // Clear all
    clearAll: () => {
            // Clear all storage types
            localStorage.clear();
            sessionStorage.clear();

            // Redirect to login page
            window.location.href = '/login';
    },

    hasActiveSession: () => {
        return !!storageManager.getUserData() && !!storageManager.getAccessToken();
    }
};