// utils/routingManager.js - Simplified
// import { storageManager } from './storageManager';

export const ROUTES = {
    HOME: '/home',
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    KYC_REGISTER: '/kyc-register',
};

export const handlePostRegistration = () => {
    setTimeout(() => {
        window.location.href = ROUTES.VERIFY_OTP;
    }, 1000);
};

export const handlePostOTPVerification = () => {
    setTimeout(() => {
        window.location.href = ROUTES.KYC_REGISTER;
    }, 1000);
};

export const handlePostKYCSubmission = () => {
    setTimeout(() => {
        window.location.href = '/login';
    }, 1000);
};

export const performRedirect = (route) => {
    setTimeout(() => {
        window.location.href = route;
    }, 500);
};



