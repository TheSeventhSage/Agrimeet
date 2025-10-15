import { storageManager } from '../../../pages/utils/storageManager';

const API_BASE_URL = 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';

// --- Sweet Console Logging Helper ---
const createLogger = (endpoint) => ({
    log: (message, data = '') => console.log(`[API:${endpoint}] ${message}`, data),
    info: (message, data = '') => console.info(`[API:${endpoint}] ${message}`, data),
    error: (message, error = '') => console.error(`[API:${endpoint}] ${message}`, error),
    group: (label) => console.groupCollapsed(`[API:${endpoint}] ${label}`),
    groupEnd: () => console.groupEnd(),
});

/**
 * A centralized API client with enhanced debugging and error handling.
 * @param {string} endpoint - The API endpoint to call.
 * @returns {Promise<any>} - A promise that resolves with the JSON response.
 * @throws {Error} - Throws a detailed error if any step fails.
 */
const apiClient = async (endpoint) => {
    const logger = createLogger(endpoint);
    logger.group(`Initiating Request`);

    try {
        logger.log("Fetching auth token...");
        const token = storageManager.getAccessToken();
        if (!token) {
            // This is a critical error that stops the request before it starts.
            throw new Error('Authentication token not found in storage.');
        }
        logger.info("Auth token found.");

        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        logger.log("Executing fetch...", { url, headers });
        const response = await fetch(url, { headers });
        logger.log("Response received.", { status: response.status, ok: response.ok });

        if (!response.ok) {
            // Try to parse error message from API, otherwise use status text.
            const errorBody = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorBody.message || `Request failed with status ${response.status}`);
        }

        const data = await response.json();
        logger.info("Request successful, returning data.", data);
        logger.groupEnd();
        return data;

    } catch (err) {
        logger.error("Request failed!", err.message);
        logger.groupEnd();
        // Re-throw the error so the component's .catch() block can handle it.
        throw err;
    }
};

// --- Exported API Functions (No changes here) ---
export const getVendorAllStats = () => apiClient('/seller/vendor_allstats');
export const getWeeklyRevenue = () => apiClient('/seller/weekly_revenue');
export const getTopCategories = () => apiClient('/seller/top_categories');
export const getPopularProducts = () => apiClient('/seller/popular_products');
export const getWeeklyOutOfStockProducts = () => apiClient('/seller/weekly_out_of_stock_products');