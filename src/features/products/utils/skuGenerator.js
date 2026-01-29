/**
 * Generates an SKU based on the product name.
 * Format: SKU-NAM-12345 (First 3 letters of name + 5 random digits)
 * * @param {string} name - The product or variant name
 * @returns {string} The generated SKU
 */
export const generateSKU = (name) => {
    if (!name) return '';

    // Get first 3 letters (handle short names gracefully)
    const prefix = name.length >= 3
        ? name.substring(0, 3).toUpperCase()
        : name.toUpperCase();

    // Generate 5 random digits
    const randomNum = Math.floor(10000 + Math.random() * 90000);

    return `SKU-${prefix}-${randomNum}`;
};