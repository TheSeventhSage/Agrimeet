import { api } from '../../../shared/utils/apiClient';

/**
 * Get vendor KPI stats.
 * API: /seller/vendor_stats
 * @param {object} filters - { day_of_week, month, year, last_days }
 * @returns {Promise} - Stats data
 */
export const getVendorStats = async (filters = {}) => {
    try {
        const response = await api.get('/seller/vendor_stats', {
            searchParams: filters,
        });
        return response;
    } catch (error) {
        console.error('Error fetching vendor stats:', error);
        throw error;
    }
};

/**
 * Get top 3 sold products with daily breakdown.
 * API: /seller/sold_products
 * @param {object} filters - { day_of_week, month, year, last_days }
 * @returns {Promise} - Sold products data
 */
export const getSoldProducts = async (filters = {}) => {
    try {
        const response = await api.get('/seller/sold_products', {
            searchParams: filters,
        });
        return response;
    } catch (error) {
        console.error('Error fetching sold products:', error);
        throw error;
    }
};

/**
 * Get top purchased categories.
 * API: /seller/purchased_catgeory
 * @param {object} filters - { day_of_week, month, year, last_days }
 * @returns {Promise} - Top categories data
 */
export const getPurchasedCategories = async (filters = {}) => {
    try {
        const response = await api.get('/seller/purchased_catgeory', {
            searchParams: filters,
        });
        return response;
    } catch (error) {
        console.error('Error fetching purchased categories:', error);
        throw error;
    }
};

/**
 * Get top 4 best-selling categories with monthly breakdown.
 * API: /seller/top_categories
 * @param {object} filters - { day_of_week, month, year, last_days }
 * @returns {Promise} - Top 4 categories with monthly data
 */
export const getTopCategories = async (filters = {}) => {
    try {
        const response = await api.get('/seller/top_categories', {
            searchParams: filters,
        });
        return response;
    } catch (error) {
        console.error('Error fetching top categories:', error);
        throw error;
    }
};

/**
 * Get all popular products with analytics.
 * API: /seller/popular_products
 * @param {object} filters - { year, month, day, rating, product_name, order }
 * @returns {Promise} - Popular products data
 */
export const getPopularProducts = async (filters = {}) => {
    try {
        const response = await api.get('/seller/popular_products', {
            searchParams: filters,
        });
        return response;
    } catch (error) {
        console.error('Error fetching popular products:', error);
        throw error;
    }
};

/**
 * Get weekly out-of-stock products.
 * API: /seller/weekly_out_of_stock_products
 * @returns {Promise} - Out-of-stock products data
 */
export const getWeeklyOutOfStockProducts = async () => {
    try {
        const response = await api.get('/seller/weekly_out_of_stock_products');
        return response;
    } catch (error) {
        console.error('Error fetching weekly out-of-stock products:', error);
        throw error;
    }
};