// pages/VerifyOtp.jsx - Updated with storage
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import OtpInput from '../shared/components/OtpInput';
import Button from '../shared/components/Button';
import { useAuth } from './contexts/AuthContext';
import { authApi } from './api/auth';
import { otpValidation } from './utils/validation';
import { storageManager } from './utils/storageManager';
import { handlePostOTPVerification } from './utils/routingManager';
import { showError, showSuccess } from '../shared/utils/alert';

export default function VerifyOtp() {
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [resending, setResending] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const { user, verifyOtp } = useAuth();
    // const navigate = useNavigate();

    // Get email from storage on component mount
    useEffect(() => {
        const storedUser = storageManager.getUserData();
        if (storedUser?.email) {
            setUserEmail(storedUser.email);
        }
    }, []);

    const email = userEmail || user?.email || 'your email';

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = otpValidation(code);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showError('Please enter a valid verification code');
            return;
        }

        setBusy(true);
        setErrors({});

        try {
            await verifyOtp({
                email: email,
                verification_code: code
            });

            // Handle redirect based on verification status
            handlePostOTPVerification();

        } catch (error) {
            if (error.errors) {
                setErrors(error.errors);
                showError('Verification failed. Please check the code and try again.');
            } else if (error.message) {
                setErrors({ general: error.message });
                showError(error.message);
            } else {
                setErrors({ general: 'Invalid verification code. Please try again.' });
                showError('Invalid verification code. Please try again.');
            }
        } finally {
            setBusy(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setErrors({});

        try {
            await authApi.resendOtp(email);
            setErrors({ success: 'Verification code sent successfully!' });
            showSuccess('Verification code sent successfully!');
        } catch (error) {
            if (error.message) {
                setErrors({ general: error.message });
                showError(error.message);
            } else {
                setErrors({ general: 'Failed to resend code. Please try again.' });
                showError('Failed to resend code. Please try again.');
            }
        } finally {
            setResending(false);
        }
    };

    return (
        <AuthLayout
            title="Verify your account"
            subtitle={`Enter the 6-digit code sent to ${email}`}
            footer={
                <p>
                    Didn't get it?{' '}
                    <button
                        type="button"
                        className="font-medium hover:underline text-brand-600 disabled:opacity-50"
                        onClick={handleResend}
                        disabled={resending}
                    >
                        {resending ? 'Sending...' : 'Resend code'}
                    </button>
                </p>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        {errors.general}
                    </div>
                )}

                {errors.success && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                        {errors.success}
                    </div>
                )}

                <div className="space-y-2">
                    <OtpInput
                        length={6}
                        value={code}
                        onChange={(value) => {
                            setCode(value);
                            if (errors.otp) {
                                setErrors(prev => ({ ...prev, otp: '' }));
                            }
                        }}
                    />
                    {errors.otp && (
                        <p className="text-sm text-red-600">{errors.otp}</p>
                    )}
                </div>

                <Button type="submit" loading={busy} className="w-full">
                    Verify & Continue
                </Button>

                <p className="text-xs text-gray-500 text-center">
                    Tip: you can paste the entire code; inputs will auto-fill and advance.
                </p>
            </form>
        </AuthLayout>
    );
}