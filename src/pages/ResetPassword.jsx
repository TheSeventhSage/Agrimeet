import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import TextField from '../shared/components/TextFields';
import PasswordField from '../shared/components/PasswordField'; // Importing the new component
import Button from '../shared/components/Button';
import { useAuth } from '../shared/contexts/AuthContext';

export default function ResetPassword() {
    // 1. Get token from URL Path
    const { token } = useParams();

    // 2. Keep searchParams in case email is passed as ?email=...
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // --- Prefill Email Logic ---
    useEffect(() => {
        // Priority 1: Email from URL query param
        const urlEmail = searchParams.get('email');

        // Priority 2: Email from LocalStorage (saved during Forgot Password)
        const storedEmail = localStorage.getItem('reset_email');

        if (urlEmail) {
            setFormData(prev => ({ ...prev, email: urlEmail }));
        } else if (storedEmail) {
            setFormData(prev => ({ ...prev, email: storedEmail }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!token) {
            setErrors({ general: 'Invalid or missing reset token.' });
            return;
        }
        if (formData.password !== formData.password_confirmation) {
            setErrors({ password: 'Passwords do not match' });
            return;
        }
        if (formData.password.length < 8) {
            setErrors({ password: 'Password must be at least 8 characters' });
            return;
        }

        setBusy(true);

        try {
            await resetPassword({
                token: token,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation
            });

            // Clear the stored email on success so it doesn't persist forever
            localStorage.removeItem('reset_email');

            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 3000);

        } catch (error) {
            if (error.errors) {
                setErrors(error.errors);
            } else if (error.message) {
                setErrors({ general: error.message });
            } else {
                setErrors({ general: 'Failed to reset password. Please try again.' });
            }
        } finally {
            setBusy(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthLayout
                title="Password Reset"
                subtitle="Your password has been updated"
            >
                <div className="text-center space-y-6">
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-100">
                        <p className="font-medium">Success!</p>
                        <p className="text-sm mt-1">You will be redirected to the login page shortly.</p>
                    </div>
                    <Button onClick={() => navigate('/login')} className="w-full">
                        Login Now
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Create a new strong password"
            footer={
                <Link to="/login" className="text-gray-900 font-medium hover:underline">
                    Back to sign in
                </Link>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                        {errors.general}
                    </div>
                )}

                {!token && (
                    <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                        Warning: Invalid link structure. Token missing.
                    </div>
                )}

                {/* Email Field - Locked and ReadOnly */}
                <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Confirm your email"
                    required
                    readOnly={true}
                    className="bg-gray-100 cursor-not-allowed opacity-75"
                />

                {/* Using PasswordField Component */}
                <PasswordField
                    label="New Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Min 8 chars"
                />

                <PasswordField
                    label="Confirm Password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    error={errors.password_confirmation}
                    placeholder="Re-enter password"
                />

                <Button type="submit" loading={busy} className="w-full" disabled={!token}>
                    Reset Password
                </Button>
            </form>
        </AuthLayout>
    );
};