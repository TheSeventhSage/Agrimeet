import { api } from '../../../../shared/utils/apiClient';

/**
 * Get all products with seller information (Admin)
 * @param {object} params - Filter params { page, status, seller_id, search, category_id }
 * @returns {Promise} - Paginated list of products
 */
export const getProducts = async (params = {}) => {
    try {
        // Clean up params: remove null/undefined or 'all' values
        const cleanParams = {};
        Object.keys(params).forEach(key => {
            if (params[key] && params[key] !== 'all') {
                cleanParams[key] = params[key];
            }
        });

        const response = await api.get('/admin/products', { query: cleanParams });
        return response;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

/**
 * Get a specific product with full details (Admin)
 * @param {number|string} id - Product ID
 * @returns {Promise} - Detailed product information
 */
export const getProduct = async (id) => {
    try {
        const response = await api.get(`/admin/products/${id}`);
        return response;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};

/**
 * Get all categories for filter selection
 * @returns {Promise} - List of categories
 */
export const getCategories = async () => {
    try {
        const response = await api.get('/allcategories');
        return response;
    } catch (error) {
        console.error('Error fetching categories:', error);
        // Return empty array on error to prevent UI crash
        return { data: [] };
    }
};

export default {
    getProducts,
    getProduct,
    getCategories
};