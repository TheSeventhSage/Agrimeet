// contexts/AuthContext.jsx - Simplified
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../pages/api/auth';
import { getUserProfile } from '../../pages/api/profile.api';
import { storageManager } from '../utils/storageManager';
import { showSuccess, showError } from '../utils/alert';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState('unverified');
    const [kycStatus, setKycStatus] = useState(null);

    useEffect(() => {
        const initAuth = () => {
            try {
                if (storageManager.hasActiveSession()) {
                    const userData = storageManager.getUserData();
                    const verificationStatus = storageManager.getVerificationStatus();

                    setUser(userData);
                    setVerificationStatus(verificationStatus);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                storageManager.clearAll();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (formData) => {
        try {
            // 1. Perform Login
            const loginResponse = await authApi.login(formData);

            // 2. Extract User Info and Set Tokens
            const tempUserId = loginResponse.user_id || loginResponse.id;
            const tempRoles = loginResponse.roles
                ? (Array.isArray(loginResponse.roles) ? loginResponse.roles : [loginResponse.roles])
                : (loginResponse.role ? [loginResponse.role] : ['buyer']);

            storageManager.setTokens(loginResponse.access_token, loginResponse.refresh_token, tempRoles);

            // 3. ROLE-BASED SUSPENSION CHECK
            // We only check suspension if the user is a SELLER and NOT an ADMIN
            const isSeller = tempRoles.includes('seller');
            const isAdmin = tempRoles.includes('admin');

            if (isSeller && !isAdmin) {
                try {
                    const profileResponse = await getUserProfile(tempUserId);

                    // Accessing nested data based on your API structure: response.data.data
                    const profileData = profileResponse.data?.data || profileResponse.data || profileResponse;

                    if (profileData.user_status === 'suspended') {
                        // Kill the session immediately
                        storageManager.clearAll();
                        setUser(null);
                        setIsAuthenticated(false);

                        // Throw custom error for Login.jsx to catch
                        const error = new Error('ACCOUNT_SUSPENDED');
                        error.suspensionData = {
                            reason: profileData.suspension_reason || 'Violation of terms',
                            count: profileData.suspension_count || 0
                        };
                        throw error;
                    }

                    // Update storage and local state with full profile if active
                    storageManager.setUserData(loginResponse);
                    setUser(loginResponse);

                } catch (profileError) {
                    // Rethrow our custom suspension error to the outer catch block
                    if (profileError.message === 'ACCOUNT_SUSPENDED') {
                        throw profileError;
                    }
                    console.error("Profile validation failed, proceeding with basic info", profileError);
                }
            } else {
                // For Admins or Buyers, we use the basic data from login response
                const userData = loginResponse;
                storageManager.setUserData(userData);
                setUser(userData);
            }

            // 4. Success flow and Redirection
            setIsAuthenticated(true);
            setVerificationStatus('verified');
            showSuccess(loginResponse.message || 'Login successful!');

            // ... (rest of your navigation logic remains unchanged)
            const redirectPath = sessionStorage.getItem('redirectAfterLogin') || location.state?.from?.pathname;
            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectPath, { replace: true });
                return loginResponse;
            }

            if (tempRoles.includes('admin')) {
                navigate('/admin/dashboard', { replace: true });
            } else if (tempRoles.includes('seller')) {
                navigate('/dashboard', { replace: true });
            } else {
                // ... (KYC logic for buyers)
                navigate('/dashboard');
            }

            return loginResponse;

        } catch (error) {
            // Re-throw suspension error to Login.jsx, handle others
            if (error.message === 'ACCOUNT_SUSPENDED') {
                throw error;
            }

            if (error.status === 401) {
                showError('Invalid email or password.');
            } else {
                showError(error.message || 'Login failed. Please try again.');
            }
            throw error;
        }
    };

    // const login = async (credentials) => {
    //     try {
    //         const response = await authApi.login(credentials);

    //         const userData = {
    //             id: response.user_id || response.id,
    //             // Handle both 'role' (string) and 'roles' (array) from API
    //             roles: response.roles 
    //                 ? (Array.isArray(response.roles) ? response.roles : [response.roles])
    //                 : (response.role ? [response.role] : ['buyer']),
    //             message: response.message,
    //         };

    //         storageManager.setUserData(userData);

    //         if (response.access_token) {
    //             storageManager.setTokens(response.access_token, response.refresh_token, response.roles);
    //         }

    //         // Set verification status based on response
    //         const verificationStatus = response.access_token ? 'verified' : 'unverified';
    //         storageManager.setVerificationStatus(verificationStatus);

    //         setUser(userData);
    //         setVerificationStatus(verificationStatus);
    //         setIsAuthenticated(!!response.access_token);

    //         showSuccess(response.message || 'Login successful');

    //         // Navigate based on user role
    //         if (userData.roles.includes('admin')) {
    //             // Admin users go to admin dashboard
    //             navigate('/admin/dashboard');
    //         } else if (userData.roles.includes('seller')) {
    //             // Sellers go to seller dashboard
    //             navigate('/dashboard');
    //         } else if (userData.roles.includes('buyer')) {
    //             // Check KYC status for buyer role
    //             try {
    //                 const kycStatusResponse = await getKYCStatus();
    //                 setKycStatus(kycStatusResponse?.status);

    //                 // Handle navigation based on KYC status
    //                 if (kycStatusResponse.status === 'verified' || kycStatusResponse.status === 'approved') {
    //                     navigate('/dashboard');
    //                 } else if (kycStatusResponse.status === 'not_submitted' || kycStatusResponse.status === 'pending') {
    //                     navigate('/kyc-pending');
    //                 } else {
    //                     navigate('/kyc-register');
    //                 }
    //             } catch (error) {
    //                 // If KYC check fails, navigate to dashboard anyway
    //                 console.error('KYC status check failed:', error);
    //                 navigate('/dashboard');
    //             }
    //         } else {
    //             // Default fallback
    //             navigate('/dashboard');
    //         }

    //         return response;
    //     } catch (error) {
    //         showError(error.message || 'Login failed. Please try again.');
    //         throw error;
    //     }
    // };

    const register = async (userData) => {
        try {
            const response = await authApi.register(userData);

            const newUserData = {
                id: response.id || response.user_id,
                email: response.email,
                phone_number: response.phone_number,
                // Handle both 'role' (string) and 'roles' (array) from API
                roles: response.roles
                    ? (Array.isArray(response.roles) ? response.roles : [response.roles])
                    : (response.role ? [response.role] : ['buyer']),
                role: response.role || (response.roles ? response.roles[0] : 'buyer'),
                name: response.user,
                message: response.message,
            };

            storageManager.setUserData(newUserData);
            storageManager.setVerificationStatus('unverified');

            if (response.access_token) {
                storageManager.setTokens(response.access_token, response.refresh_token);
            }

            setUser(newUserData);
            setVerificationStatus('unverified');
            setIsAuthenticated(!!response.access_token);

            showSuccess(response.message || 'Registration successful! Please verify your email.');
            return response;
        } catch (error) {
            showError(error.message || 'Registration failed. Please try again.');
            throw error;
        }
    };

    const verifyOtp = async (verificationData) => {
        try {
            const response = await authApi.verifyOtp(verificationData);

            storageManager.setVerificationStatus('verified');

            if (response.access_token) {
                storageManager.setTokens(response.access_token, response.refresh_token);
            }

            setVerificationStatus('verified');
            setIsAuthenticated(true);

            showSuccess(response.message || 'Email verification successful!');
            return response;
        } catch (error) {
            showError(error.message || 'Verification failed. Please try again.');
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await authApi.forgotPassword(email);
            // Success message is handled by the UI component usually, 
            // but we can add a generic one here if preferred.
            // showSuccess(response.message || 'Reset link sent'); 
            return response;
        } catch (error) {
            // We re-throw so the UI can display specific validation errors
            throw error;
        }
    };

    const resetPassword = async (resetData) => {
        try {
            const response = await authApi.resetPassword(resetData);
            showSuccess(response.message || 'Password reset successful!');
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        // Clear all sessions
        storageManager.clearAll();

        // Reset react states
        setUser(null);
        setVerificationStatus('unverified');
        setIsAuthenticated(false);
        setKycStatus(null);

        // Navigate WITHOUT refreshing the page
        navigate('/login', { replace: true });
        showSuccess('Logged out successfully');
    };

    const homeLogout = () => {
        // Clear all sessions
        storageManager.clearAll();

        // Reset react states
        setUser(null);
        setVerificationStatus('unverified');
        setIsAuthenticated(false);
        setKycStatus(null);

        // Navigate WITHOUT refreshing the page
        navigate('/');
        window.location.reload();
        showSuccess('Logged out successfully');
    };

    const value = {
        user,
        isAuthenticated,
        verificationStatus,
        kycStatus,
        loading,
        login,
        register,
        verifyOtp,
        forgotPassword,
        resetPassword,
        logout,
        homeLogout,
        isEmailVerified: () => verificationStatus === 'verified'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};