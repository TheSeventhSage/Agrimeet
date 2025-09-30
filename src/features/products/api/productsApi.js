// api/seller/products.api.js
import { storageManager } from '../../../pages/utils/storageManager';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = storageManager.getAccessToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401) {
            // Handle unauthorized - redirect to login
            storageManager.clearAll();
            throw new Error('Session expired. Please login again.');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

// Get all products with pagination
export const getProducts = async (page = 1, filters = {}) => {
    try {
        // Build query parameters
        const queryParams = new URLSearchParams({
            page: page.toString()
        });

        // Add filter parameters if provided
        if (filters.category) {
            queryParams.append('category', filters.category);
        }
        if (filters.search) {
            queryParams.append('search', filters.search);
        }
        if (filters.status) {
            queryParams.append('status', filters.status);
        }
        if (filters.per_page) {
            queryParams.append('per_page', filters.per_page);
        }

        const response = await fetch(`${BASE_URL}/seller/products?${queryParams}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Get single product by ID
export const getProduct = async (productId) => {
    try {
        const response = await fetch(`${BASE_URL}/seller/products/${productId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// Create new product
export const createProduct = async (productData) => {
    try {
        // If productData contains files, use FormData
        let body;
        let headers = getAuthHeaders();

        if (productData instanceof FormData) {
            body = productData;
            // Remove Content-Type for FormData to let browser set boundary
            delete headers['Content-Type'];
        } else {
            body = JSON.stringify(productData);
        }

        const response = await fetch(`${BASE_URL}/seller/products`, {
            method: 'POST',
            headers,
            body
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Update existing product
export const updateProduct = async (productId, productData) => {
    try {
        let body;
        let headers = getAuthHeaders();

        if (productData instanceof FormData) {
            body = productData;
            // Add method override for FormData
            body.append('_method', 'PUT');
            delete headers['Content-Type'];
        } else {
            body = JSON.stringify(productData);
        }

        const response = await fetch(`${BASE_URL}/seller/products/${productId}`, {
            method: productData instanceof FormData ? 'POST' : 'PUT',
            headers,
            body
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// Delete product
export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`${BASE_URL}/seller/products/${productId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// Toggle product status (active/inactive)
export const toggleProductStatus = async (productId, status) => {
    try {
        const response = await fetch(`${BASE_URL}/seller/products/${productId}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error toggling product status:', error);
        throw error;
    }
};

// Get product categories
export const getCategories = async () => {
    try {
        const response = await fetch(`${BASE_URL}/allcategories`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Get units
export const getUnits = async () => {
    try {
        const response = await fetch(`${BASE_URL}/seller/products/allUnits`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching units:', error);
        throw error;
    }
};

// Helper function to transform API product data to match component expectations
export const transformProductData = (apiProduct) => {
    return {
        id: apiProduct.id,
        name: apiProduct.name,
        description: apiProduct.description,
        originalPrice: parseFloat(apiProduct.base_price),
        discountedPrice: parseFloat(apiProduct.discount_price || apiProduct.base_price),
        price: parseFloat(apiProduct.discount_price || apiProduct.base_price),
        discount: apiProduct.discount_price ?
            Math.round(((apiProduct.base_price - apiProduct.discount_price) / apiProduct.base_price) * 100) : 0,
        stock: apiProduct.stock_quantity,
        category: apiProduct.category?.name || 'Unknown',
        categoryId: apiProduct.category_id,
        status: apiProduct.status,
        sku: apiProduct.slug, // Using slug as SKU for now
        image: apiProduct.thumbnail ?
            `https://agrimeet.udehcoglobalfoodsltd.com/storage/${apiProduct.thumbnail}` :
            null,
        images: apiProduct.images?.map(img =>
            `https://agrimeet.udehcoglobalfoodsltd.com/storage/${img.url}`
        ) || [],
        rating: 4.5, // Default rating since not in API
        reviews: 0, // Default reviews since not in API
        unit: apiProduct.unit?.name || 'Unit',
        unitSymbol: apiProduct.unit?.symbol || '',
        sellerId: apiProduct.seller_id,
        seller: apiProduct.seller,
        variants: apiProduct.variants || [],
        createdAt: apiProduct.created_at,
        updatedAt: apiProduct.updated_at
    };
};