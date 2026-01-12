export const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
    return '';
};

export const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
        return 'Password must contain uppercase, lowercase, number, and special character';
    }
    return '';
};

export const validateName = (name, fieldName) => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters`;
    return '';
};

export const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) return 'Please enter a valid phone number';
    return '';
};

export const validateConfirmation = (value, originalValue, fieldName) => {
    if (!value) return `${fieldName} is required`;
    if (value !== originalValue) return `${fieldName} does not match`;
    return '';
};

export const validateTerms = (accepted) => {
    if (!accepted) return 'You must accept the terms and conditions';
    return '';
};

export const validateOtp = (otp) => {
    if (!otp || otp.length !== 6) return 'Please enter a valid 6-digit code';
    return '';
};

// Form-specific validation schemas
export const registerValidation = (formData) => {
    const errors = {};

    errors.first_name = validateName(formData.first_name, 'First name');
    errors.last_name = validateName(formData.last_name, 'Last name');
    errors.phone_number = validatePhone(formData.phone_number);
    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);
    errors.password_confirmation = validateConfirmation(
        formData.password_confirmation,
        formData.password,
        'Password confirmation'
    );
    errors.terms_accepted = validateTerms(formData.terms_accepted);

    // Remove empty error fields
    return Object.fromEntries(
        Object.entries(errors).filter(([_, value]) => value !== '')
    );
};

export const loginValidation = (formData) => {
    const errors = {};

    errors.email = validateEmail(formData.email);
    errors.password = formData.password ? '' : 'Password is required';

    return Object.fromEntries(
        Object.entries(errors).filter(([_, value]) => value !== '')
    );
};

export const otpValidation = (otp) => {
    const errors = {};
    errors.otp = validateOtp(otp);
    return Object.fromEntries(
        Object.entries(errors).filter(([_, value]) => value !== '')
    );
};

export const forgotPasswordValidation = (email) => {
    const errors = {};
    errors.email = validateEmail(email);
    return Object.fromEntries(
        Object.entries(errors).filter(([_, value]) => value !== '')
    );
};