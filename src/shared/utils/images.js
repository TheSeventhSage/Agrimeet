// Image utility functions for handling asset imports

// Import all product images
import maizeImg from '../../assets/images/farmer/maize.png';
import riceImg from '../../assets/images/farmer/rice.png';
import tomatoesImg from '../../assets/images/farmer/tomatoes.png';
import yamImg from '../../assets/images/farmer/yam.png';

// Import category images
import fruitsImg from '../../assets/images/categories/fruits.png';
import grainsImg from '../../assets/images/categories/grains.png';
import legumesImg from '../../assets/images/categories/legumes.png';
import spicesImg from '../../assets/images/categories/spices.png';
import tubersImg from '../../assets/images/categories/tubers.png';
import vegetablesImg from '../../assets/images/categories/vegetables.png';

// Product images mapping
export const productImages = {
    maize: maizeImg,
    rice: riceImg,
    tomatoes: tomatoesImg,
    yam: yamImg,
};

// Category images mapping
export const categoryImages = {
    fruits: fruitsImg,
    grains: grainsImg,
    legumes: legumesImg,
    spices: spicesImg,
    tubers: tubersImg,
    vegetables: vegetablesImg,
};

// Function to get product image
export const getProductImage = (imagePath) => {
    // If it's a direct path, return it
    if (imagePath.startsWith('/src/assets/') || imagePath.startsWith('http')) {
        return imagePath;
    }

    // If it's a key, return the imported image
    if (productImages[imagePath]) {
        return productImages[imagePath];
    }

    // Fallback to placeholder
    return `https://via.placeholder.com/300x300/f3f4f6/6b7280?text=Product`;
};

// Function to get category image
export const getCategoryImage = (category) => {
    return categoryImages[category] || `https://via.placeholder.com/300x300/f3f4f6/6b7280?text=${category}`;
};
