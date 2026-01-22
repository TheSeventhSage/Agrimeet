// pages/Login.jsx - Updated with proper validation
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import TextField from '../shared/components/TextFields';
import PasswordField from '../shared/components/PasswordField';
import Button from '../shared/components/Button';
import { showError } from '../shared/utils/alert';
import { useAuth } from '../shared/contexts/AuthContext';
import { loginValidation } from '../shared/utils/validation';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (busy) return; // UI-level race protection

        // Validate form
        const validationErrors = loginValidation(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setBusy(true);
        setErrors({});

        try {
            await login(form);
        } catch (error) {
            if (error.message === 'ACCOUNT_SUSPENDED') {
                setErrors({
                    suspension: error.suspensionData // Contains reason and count
                });
            } else if (error.message.includes('already in progress')) {
                // User-friendly message for race condition
                showError('Please wait for the current operation to complete');
            } else if (error.errors) {
                setErrors(error.errors);
            } else if (error.message) {
                setErrors({ general: error.message });
            } else {
                setErrors({ general: 'Login failed. Please try again.' });
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <AuthLayout
            title="Sign in to your seller account"
            subtitle="Manage products, orders, and payouts"
            footer={
                <p>
                    New seller?{' '}
                    <Link to="/register" className="font-semibold underline">
                        Create an account
                    </Link>
                </p>
            }
            mode="art"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        {errors.general}
                    </div>
                )}

                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <PasswordField
                    label="Password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                />

                <p className="text-sm text-brand-700 text-end -mt-[15px]">
                    <Link
                        to="/forgot-password"
                        className="font-semibold ml-2 no-underline hover:underline"
                    >
                        Forgot password?
                    </Link>
                </p>

                <Button type="submit" loading={busy} className="w-full">
                    Sign In
                </Button>

                {/* --- SUSPENSION ALERT BOX --- */}
                {errors.suspension && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-sm font-bold text-red-800">Account Suspended</h3>
                            </div>
                            <div className="text-sm text-red-700 ml-7">
                                <p><strong>Reason:</strong> {errors.suspension.reason}</p>
                                <p className="mt-1">
                                    You have been suspended
                                    <span className="font-bold mx-1">{errors.suspension.count}</span>
                                    time{errors.suspension.count !== 1 ? 's' : ''}.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </AuthLayout>
    );
}
