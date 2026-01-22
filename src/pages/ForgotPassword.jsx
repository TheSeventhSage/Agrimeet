import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import TextField from '../shared/components/TextFields';
import Button from '../shared/components/Button';
import { useAuth } from '../shared/contexts/AuthContext';
import { forgotPasswordValidation } from '../shared/utils/validation';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);

    // We store the full API response here to display instructions
    const [successData, setSuccessData] = useState(null);

    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = forgotPasswordValidation(email);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setBusy(true);
        setErrors({});

        try {
            // The API returns { message, instructions, expires_in, ... }
            const response = await forgotPassword(email);

            // --- NEW: Save email to localStorage for the Reset Password page ---
            localStorage.setItem('reset_email', email);

            setSuccessData(response);
        } catch (error) {
            if (error.errors) {
                setErrors(error.errors);
            } else if (error.message) {
                setErrors({ general: error.message });
            } else {
                setErrors({ general: 'Request failed. Please try again.' });
            }
        } finally {
            setBusy(false);
        }
    };

    if (successData) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle={`We sent a recovery link to ${email}`}
                footer={
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Didn't receive the email?{' '}
                            <button
                                onClick={() => setSuccessData(null)}
                                className="text-brand-700 font-medium hover:underline focus:outline-none"
                            >
                                Click to resend
                            </button>
                        </p>
                        <p>
                            <Link to="/login" className="text-gray-900 font-medium hover:underline">
                                ← Back to sign in
                            </Link>
                        </p>
                    </div>
                }
            >
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-green-100 p-4 rounded-full">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-left">
                        <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {successData.instructions || "Follow the link in your email to reset your password."}
                        </p>

                        {successData.expires_in && (
                            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center text-xs text-amber-700 font-medium">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Link expires in {successData.expires_in}
                            </div>
                        )}
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Forgot password?"
            subtitle="Enter your email to receive a reset link"
            footer={
                <p>
                    Remembered it?{' '}
                    <Link to="/login" className="text-gray-900 font-medium hover:underline">
                        Back to sign in
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {errors.general && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                        {errors.general}
                    </div>
                )}

                <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    error={errors.email}
                />

                <Button type="submit" loading={busy} className="w-full">
                    Send Reset Link
                </Button>
            </form>
        </AuthLayout>
    );
}