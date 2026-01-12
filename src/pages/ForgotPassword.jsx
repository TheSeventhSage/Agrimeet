// pages/ForgotPassword.jsx - Updated with AuthContext
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import TextField from '../shared/components/TextFields';
import Button from '../shared/components/Button';
import { useAuth } from '../shared/contexts/AuthContext';
import { forgotPasswordValidation } from '../shared/utils/validation';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        const validationErrors = forgotPasswordValidation(email);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setBusy(true);
        setErrors({});
        setSuccess('');

        try {
            await forgotPassword(email);
            setSuccess('We sent a reset code to your email.');
            // Redirect to verify-otp after 2 seconds
            setTimeout(() => navigate('/verify-otp'), 2000);
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

    return (
        <AuthLayout
            title="Forgot your password?"
            subtitle="Enter your email to receive a reset code"
            footer={
                <p>
                    Remembered it?{' '}
                    <Link to="/login" className="text-gray-900 font-medium hover:underline">
                        Back to sign in
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        {errors.general}
                    </div>
                )}

                {success && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                        {success}
                    </div>
                )}

                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        // Clear errors when user starts typing
                        if (errors.email) {
                            setErrors(prev => ({ ...prev, email: '' }));
                        }
                    }}
                    error={errors.email}
                />

                <Button type="submit" loading={busy} className="w-full">
                    Send reset code
                </Button>
            </form>
        </AuthLayout>
    );
}