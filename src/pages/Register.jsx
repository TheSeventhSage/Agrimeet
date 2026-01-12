// pages/Register.jsx - Updated with storage
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import TextField from '../shared/components/TextFields';
import PasswordField from '../shared/components/PasswordField';
import Button from '../shared/components/Button';
import { useAuth } from '../shared/contexts/AuthContext';
import { registerValidation } from '../shared/utils/validation';
import { storageManager } from '../shared/utils/storageManager';
import { handlePostRegistration } from '../shared/utils/routingManager';
import { showError } from '../shared/utils/alert';

export default function Register() {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms_accepted: false
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = registerValidation(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Show validation error message
            showError('Please correct the errors in the form');
            return;
        }

        setBusy(true);
        setErrors({});

        try {
            await register(form);
            setSuccess(true);
            let message = 'Redirecting...';
            setMessage(message);

            // Redirect to OTP verification after 2 seconds
            setTimeout(() => {
                handlePostRegistration();
            }, 1000);
        } catch (error) {
            if (error.errors) {
                setErrors(error.errors);
                showError('Registration failed. Please check the form for errors.');
            } else if (error.message) {
                setErrors({ general: error.message });
                showError(error.message);
            } else {
                setErrors({ general: 'Registration failed. Please try again.' });
                showError('Registration failed. Please try again.');
            }
        } finally {
            setBusy(false);
        }
    };

    if (success) {
        return (
            <AuthLayout
                title="Registration Successful!"
                subtitle="Please check your email for the verification code."
            >
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-gray-600 mb-6">
                        We've sent a verification code to your email address.
                        Please check your inbox and follow the instructions to complete your registration.
                    </p>
                    <p>{message}</p>
                    <p className="text-sm text-gray-500 mb-4">
                        Email: {storageManager.getUserData()?.email || form.email}
                    </p>
                    <Button
                        className="w-full"
                        onClick={() => navigate('/verify-otp')}
                    >
                        Verify Account Now
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            className="py-20 md:py-16"
            title="Create Your Account"
            subtitle="Join thousands of farmers and buyers on our platform"
            footer={
                <p>
                    Already have an account?{' '}
                    <Link className="text-brand-600 font-medium hover:underline" to="/login">
                        Sign in
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

                <div className="grid grid-cols-2 gap-4">
                    <TextField
                        label="First Name"
                        name="first_name"
                        placeholder="John"
                        value={form.first_name}
                        onChange={handleChange}
                        error={errors.first_name}
                    />
                    <TextField
                        label="Last Name"
                        name="last_name"
                        placeholder="Doe"
                        value={form.last_name}
                        onChange={handleChange}
                        error={errors.last_name}
                    />
                </div>

                <TextField
                    label="Phone Number"
                    name="phone_number"
                    placeholder="+23489806755"
                    value={form.phone_number}
                    onChange={handleChange}
                    error={errors.phone_number}
                />

                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <PasswordField
                    label="Password"
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                />

                <PasswordField
                    label="Confirm Password"
                    name="password_confirmation"
                    placeholder="Confirm your password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    error={errors.password_confirmation}
                />

                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            name="terms_accepted"
                            type="checkbox"
                            checked={form.terms_accepted}
                            onChange={handleChange}
                            className="focus:ring-brand-500 h-4 w-4 text-brand-600 border-gray-300 rounded-sm"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-700">
                            I agree to the{' '}
                            <Link to="/terms" className="text-brand-600 hover:text-brand-500">
                                Terms and Conditions
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-brand-600 hover:text-brand-500">
                                Privacy Policy
                            </Link>
                        </label>
                        {errors.terms_accepted && (
                            <p className="text-red-600 mt-1">{errors.terms_accepted}</p>
                        )}
                    </div>
                </div>

                <Button type="submit" loading={busy} className="w-full">
                    Create Account
                </Button>
            </form>
        </AuthLayout>
    );
}