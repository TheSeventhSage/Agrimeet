const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
};