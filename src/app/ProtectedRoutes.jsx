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

    // Check if user's role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.some(role => userData?.roles?.includes(role))) {
        showWarning('You do not have permission to access this page');
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;