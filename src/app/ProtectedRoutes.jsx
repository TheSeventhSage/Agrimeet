import { Navigate } from 'react-router-dom';
import { storageManager } from '../pages/utils/storageManager';
import { showError, showWarning } from '../shared/utils/alert';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const hasActiveSession = storageManager.hasActiveSession();
    const userData = storageManager.getUserData();
    const accessToken = storageManager.getAccessToken();

    // Check if user has an active session and access token
    if (!hasActiveSession || !accessToken) {
        showError('Please log in to access this page');
        return <Navigate to="/login" replace />;
    }

    // Normalize roles to handle both 'role' (string) and 'roles' (array)
    const userRoles = userData?.roles 
        ? (Array.isArray(userData.roles) ? userData.roles : [userData.roles])
        : (userData?.role ? [userData.role] : []);

    // Debug logging in development
    if (import.meta.env.DEV) {
        console.log('🔐 ProtectedRoute Check:', {
            allowedRoles,
            userData,
            userRoles,
            hasMatch: allowedRoles.some(role => userRoles.includes(role))
        });
    }

    // Check if user's role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.some(role => userRoles.includes(role))) {
        console.warn('❌ Access denied. User roles:', userRoles, 'Required:', allowedRoles);
        showWarning('You do not have permission to access this page');
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;