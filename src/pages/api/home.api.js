const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';
// Now test
export const api = {
    async getAllCategories() {
        try {
            const response = await fetch(`${BASE_URL}/allcategories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    async getAllProducts(page = 1, perPage = 12) {
        try {
            const response = await fetch(
                `${BASE_URL}/allproducts?page=${page}&per_page=${perPage}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    async getProduct(productId) {
        try {
            const response = await fetch(`${BASE_URL}/seller/products/${productId}/show_product`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to fetch product: ${response.status} ${text}`);
            }

            const result = await response.json();
            // API returns an object representing the product (not wrapped in data)
            return result;
        } catch (error) {
            console.error("Error fetching product:", error);
            throw error;
        }
      },
};