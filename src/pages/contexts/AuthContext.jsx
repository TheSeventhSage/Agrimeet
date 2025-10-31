// contexts/AuthContext.jsx - Simplified
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { getKYCStatus } from '../api/kyc.api';
import { storageManager } from '../utils/storageManager';
import { showSuccess, showError } from '../../shared/utils/alert';

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
            const response = await authApi.login(formData);

            const userData = response;
            const roles = response.roles
                ? (Array.isArray(response.roles) ? response.roles : [response.roles])
                : (response.role ? [response.role] : ['buyer']);
            storageManager.setUserData(userData);
            storageManager.setTokens(response.access_token, response.refresh_token, roles);
            storageManager.setVerificationStatus('verified'); // Or based on user data

            setUser(userData);
            setIsAuthenticated(true);
            setVerificationStatus('verified'); // Or based on user data

            showSuccess(response.message || 'Login successful!');

            const redirectPath = sessionStorage.getItem('redirectAfterLogin') || location.state?.from?.pathname;

            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin'); // Clean up
                navigate(redirectPath, { replace: true }); // Go back to the previous page
                return userData; // Exit the function early
            }

            if (roles.includes('admin')) {
                // You mentioned admin dashboard, adjust path if needed
                navigate('/admin/dashboard', { replace: true });
            } else if (roles.includes('seller')) {
                // Seller dashboard
                navigate('/dashboard', { replace: true });
            } else if (roles.includes('buyer')) {
                try {
                    const kycStatusResponse = await getKYCStatus();
                    setKycStatus(kycStatusResponse?.status);

                    // Handle navigation based on KYC status
                    if (kycStatusResponse.status === 'verified' || kycStatusResponse.status === 'approved') {
                        navigate('/dashboard');
                    } else if (kycStatusResponse.status === 'pending') {
                        navigate('/kyc-pending');
                    } else {
                        // Catches 'not_submitted', 'rejected', etc.
                        navigate('/kyc-register');

                        // --- REMOVED ---
                        // The old, misplaced redirect logic was here.
                        // It's now handled by the new block at the top.
                    }
                } catch (error) {
                    // If KYC check fails, navigate to dashboard anyway
                    console.error('KYC status check failed:', error);
                    navigate('/dashboard');
                }
            } else {
                // Default fallback
                navigate('/', { replace: true });
            }

            // --- END NEW LOGIC ---

            return userData; // Return user data for Login.jsx if needed

        } catch (error) {
            // Error handling (as it was before)
            if (error.status === 401) {
                showError('Invalid email or password.');
            } else {
                showError(error.message || 'Login failed. Please try again.');
            }
            throw error; // Re-throw error for Login.jsx to catch
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

    const logout = () => {
        storageManager.clearAll();
        setUser(null);
        setVerificationStatus('unverified');
        setIsAuthenticated(false);
        setKycStatus(null);

        showSuccess('Logged out successfully');
        window.location.href = '/login';
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
        logout,
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