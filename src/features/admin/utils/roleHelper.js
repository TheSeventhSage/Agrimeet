// Role Helper Utility
// Handles role checking for both API formats: role (string) and roles (array)

/**
 * Normalize roles to always return an array
 * Handles: role: "admin", roles: ["admin"], roles: "admin"
 */
export const normalizeRoles = (userData) => {
    if (!userData) return [];
    
    // If roles is already an array
    if (Array.isArray(userData.roles)) {
        return userData.roles;
    }
    
    // If roles is a string
    if (typeof userData.roles === 'string') {
        return [userData.roles];
    }
    
    // If role (singular) exists
    if (userData.role) {
        return [userData.role];
    }
    
    // Default
    return [];
};

/**
 * Check if user has a specific role
 */
export const hasRole = (userData, roleName) => {
    const roles = normalizeRoles(userData);
    return roles.includes(roleName);
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (userData, roleNames) => {
    const roles = normalizeRoles(userData);
    return roleNames.some(roleName => roles.includes(roleName));
};

/**
 * Check if user is admin
 */
export const isAdmin = (userData) => {
    return hasRole(userData, 'admin');
};

/**
 * Check if user is seller
 */
export const isSeller = (userData) => {
    return hasRole(userData, 'seller');
};

/**
 * Check if user is buyer
 */
export const isBuyer = (userData) => {
    return hasRole(userData, 'buyer');
};

/**
 * Get primary role (first role in array or the role value)
 */
export const getPrimaryRole = (userData) => {
    const roles = normalizeRoles(userData);
    return roles.length > 0 ? roles[0] : 'user';
};

/**
 * Debug function to log user roles
 */
export const debugRoles = (userData) => {
    console.group('🔍 User Role Debug');
    console.log('User Data:', userData);
    console.log('Roles (normalized):', normalizeRoles(userData));
    console.log('Is Admin?', isAdmin(userData));
    console.log('Is Seller?', isSeller(userData));
    console.log('Is Buyer?', isBuyer(userData));
    console.log('Primary Role:', getPrimaryRole(userData));
    console.groupEnd();
};