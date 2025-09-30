// contexts/AuthContext.jsx - Simplified
import React, { createContext, useState, useContext, useEffect } from 'react';
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

    const login = async (credentials) => {
        try {
            const response = await authApi.login(credentials);

            const userData = {
                id: response.user_id,
                access_token: response.access_token,
                name: response.user,
                roles: response.roles,
                message: response.message,
            };

            storageManager.setUserData(userData);

            if (response.access_token) {
                storageManager.setTokens(response.access_token, response.refresh_token);
            }

            // Set verification status based on response
            const verificationStatus = response.access_token ? 'verified' : 'unverified';
            storageManager.setVerificationStatus(verificationStatus);

            setUser(userData);
            setVerificationStatus(verificationStatus);
            setIsAuthenticated(!!response.access_token);

            showSuccess(response.message || 'Login successful');

            // Check KYC status for buyer role
            if (userData.role === 'buyer') {
                const kycStatusResponse = await getKYCStatus();
                setKycStatus(kycStatusResponse?.status);

                // Handle navigation based on KYC status
                if (kycStatusResponse.status === 'verified' || kycStatusResponse.status === 'approved') {
                    navigate('/dashboard');
                } else if (kycStatusResponse.status === 'not_submitted' || kycStatusResponse.status === 'pending') {
                    navigate('/kyc-pending');
                } else {
                    navigate('/kyc-register');
                }
            } else {
                // For non-buyer roles, navigate directly to dashboard
                navigate('/dashboard');
            }

            return response;
        } catch (error) {
            showError(error.message || 'Login failed. Please try again.');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authApi.register(userData);

            const newUserData = {
                id: response.id,
                email: response.email,
                phone_number: response.phone_number,
                role: response.role,
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