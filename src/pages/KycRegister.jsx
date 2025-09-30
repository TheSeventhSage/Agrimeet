import { useState } from 'react';
import {
    ArrowRight, ArrowLeft, CheckCircle, Phone, FileText, Shield, Info, Leaf
} from 'lucide-react';
import Input from '../shared/components/Input';
import Select from '../shared/components/Select';
import Textarea from '../shared/components/Textarea';
import Button from '../shared/components/Button';
import DocumentUpload from '../shared/components/DocumentUpload';
import { showSuccess, showError } from '../shared/utils/alert';
import BackgroundArt from '../shared/components/BackgroundArt';
import { withAsyncErrorHandling } from './api/auth';
import { submitKYC } from './api/kyc.api';


const KYCRegistrationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Form data state
    const [formData, setFormData] = useState({
        business_type_id: '',
        store_name: '',
        address: '',
        city: '',
        state: '',
        business_phone_number: '',
        bank_name: '',
        bank_account_number: '',
        name_on_account: '',
        business_bio: '',
        gender: '',
        document_type: '',
        document_file: null,
        cover_image: null
    });

    const totalSteps = 4;

    // Business types options
    const businessTypeOptions = [
        { value: 1, label: 'Individual Farmer - Small scale farming operations' },
        { value: 2, label: 'Cooperative Farm - Farmer cooperatives and groups' },
        { value: 3, label: 'Agricultural Company - Commercial farming enterprises' },
        { value: 4, label: 'Food Processor - Value-added processing businesses' }
    ];

    // Document types
    const documentTypeOptions = [
        { value: 'national_id', label: 'National ID Card' },
        { value: 'passport', label: 'International Passport' },
        { value: 'drivers_license', label: "Driver's License" },
        { value: 'voters_card', label: "Voter's Card" }
    ];

    // Gender options
    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    // Nigerian states
    const stateOptions = [
        'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
        'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
        'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
        'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
        'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
    ].map(state => ({ value: state, label: state }));

    // Major Nigerian banks
    const bankOptions = [
        'Access Bank', 'Citibank', 'Ecobank Nigeria', 'Fidelity Bank Nigeria', 'First Bank of Nigeria',
        'First City Monument Bank', 'Guaranty Trust Bank', 'Heritage Banking Company Ltd.',
        'Keystone Bank', 'Polaris Bank', 'Providus Bank', 'Stanbic IBTC Bank', 'Standard Chartered',
        'Sterling Bank', 'SunTrust Bank Nigeria Limited', 'Union Bank of Nigeria', 'United Bank For Africa',
        'Unity Bank', 'Wema Bank', 'Zenith Bank'
    ].map(bank => ({ value: bank, label: bank }));

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileUpload = (field) => (files) => {
        if (files.length === 0) {
            setFormData(prev => ({ ...prev, [field]: null }));
            return;
        }

        const file = files[0]; // Get first file from array

        // Check if file is already a File object or needs extraction
        const actualFile = file.file ? file.file : file;

        if (actualFile && actualFile.size > 5 * 1024 * 1024) { // 5MB limit
            setErrors(prev => ({ ...prev, [field]: 'File size must be less than 5MB' }));
            return;
        }

        setFormData(prev => ({ ...prev, [field]: actualFile || null }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.business_type_id) newErrors.business_type_id = 'Business type is required';
                if (!formData.store_name.trim()) newErrors.store_name = 'Store name is required';
                if (!formData.business_bio.trim()) newErrors.business_bio = 'Business description is required';
                if (formData.business_bio.length > 500) newErrors.business_bio = 'Description must be 500 characters or less';
                break;

            case 2:
                if (!formData.address.trim()) newErrors.address = 'Address is required';
                if (!formData.city.trim()) newErrors.city = 'City is required';
                if (!formData.state) newErrors.state = 'State is required';
                if (!formData.business_phone_number.trim()) newErrors.business_phone_number = 'Phone number is required';
                break;

            case 3:
                if (!formData.bank_name) newErrors.bank_name = 'Bank name is required';
                if (!formData.bank_account_number.trim()) newErrors.bank_account_number = 'Account number is required';
                if (!formData.name_on_account.trim()) newErrors.name_on_account = 'Account holder name is required';
                break;

            case 4:
                if (!formData.gender) newErrors.gender = 'Gender is required';
                if (!formData.document_type) newErrors.document_type = 'Document type is required';
                if (!formData.document_file) newErrors.document_file = 'Identity document is required';
                if (!formData.cover_image) newErrors.cover_image = 'Business cover image is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const goBack = () => {
        window.history.back();
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        } else {
            showError('Please fill in all required fields before proceeding');
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // ADDED: Safe KYC submission wrapper
    const safeSubmitKYC = async (submitData) => {
        return withAsyncErrorHandling(async () => {
            const result = await submitKYC(submitData);
            return result;
        }, 'KYC submission');
    };

    // ENHANCED: Handle form submission with proper error boundaries
    const handleSubmit = async () => {
        if (!validateStep(currentStep)) {
            showError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== '') {
                    submitData.append(key, value);
                }
            });

            // USE SAFE SUBMIT WRAPPER
            const result = await safeSubmitKYC(submitData);
            showSuccess(result.message || 'KYC submitted successfully!');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        } catch (error) {
            // Errors are already handled by withAsyncErrorHandling
            // Just need to prevent further processing
            console.error('KYC submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    // const resetForm = () => {
    //     setShowSuccessPage(false);
    //     setCurrentStep(1);
    //     setFormData({
    //         business_type_id: '',
    //         store_name: '',
    //         address: '',
    //         city: '',
    //         state: '',
    //         business_phone_number: '',
    //         bank_name: '',
    //         bank_account_number: '',
    //         name_on_account: '',
    //         business_bio: '',
    //         gender: '',
    //         document_type: '',
    //         document_file: null,
    //         cover_image: null
    //     });
    //     setErrors({});
    // }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 relative">
            <BackgroundArt />

            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 relative z-10">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={goBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                                <Leaf className="w-7 h-7 text-white" />
                            </div>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold text-gray-900">AgriMeet</h1>
                                <p className="text-sm text-gray-500">Seller Registration</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
                            <div className="mt-2 w-32 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Step Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                        <div className="flex items-center justify-between text-white">
                            <div>
                                {currentStep === 1 && (
                                    <>
                                        <h2 className="text-2xl font-bold mb-2">Business Information</h2>
                                        <p className="text-green-100">Tell us about your agricultural business</p>
                                    </>
                                )}
                                {currentStep === 2 && (
                                    <>
                                        <h2 className="text-2xl font-bold mb-2">Location & Contact</h2>
                                        <p className="text-green-100">Where is your business located?</p>
                                    </>
                                )}
                                {currentStep === 3 && (
                                    <>
                                        <h2 className="text-2xl font-bold mb-2">Banking Details</h2>
                                        <p className="text-green-100">Secure payment information</p>
                                    </>
                                )}
                                {currentStep === 4 && (
                                    <>
                                        <h2 className="text-2xl font-bold mb-2">Identity Verification</h2>
                                        <p className="text-green-100">Upload your documents for verification</p>
                                    </>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{currentStep}</div>
                                <div className="text-sm text-green-100">of {totalSteps}</div>
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        {/* Step 1: Business Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <Select
                                    label="Business Type"
                                    options={businessTypeOptions}
                                    value={formData.business_type_id}
                                    onChange={(e) => handleInputChange('business_type_id', parseInt(e.target.value))}
                                    error={errors.business_type_id}
                                    required
                                    placeholder="Select your business type"
                                />

                                <Input
                                    label="Store/Business Name"
                                    type="text"
                                    value={formData.store_name}
                                    onChange={(e) => handleInputChange('store_name', e.target.value)}
                                    placeholder="e.g., Green Valley Organic Farm"
                                    error={errors.store_name}
                                    required
                                />

                                <div>
                                    <Textarea
                                        label="Business Description"
                                        value={formData.business_bio}
                                        onChange={(e) => handleInputChange('business_bio', e.target.value)}
                                        placeholder="Describe your agricultural business, what you grow/produce, and your farming practices..."
                                        rows={5}
                                        error={errors.business_bio}
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formData.business_bio.length}/500 characters
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location & Contact */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <Input
                                    label="Business Address"
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    placeholder="Enter your complete business address"
                                    error={errors.address}
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="City"
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        placeholder="City"
                                        error={errors.city}
                                        required
                                    />

                                    <Select
                                        label="State"
                                        options={stateOptions}
                                        value={formData.state}
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                        error={errors.state}
                                        required
                                        placeholder="Select State"
                                    />
                                </div>

                                <Input
                                    label="Business Phone Number"
                                    type="tel"
                                    value={formData.business_phone_number}
                                    onChange={(e) => handleInputChange('business_phone_number', e.target.value)}
                                    placeholder="+234 803 456 7890"
                                    error={errors.business_phone_number}
                                    required
                                />
                            </div>
                        )}

                        {/* Step 3: Banking Details */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-6 h-6 text-blue-600 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-blue-900 mb-2">Secure Banking Information</h3>
                                            <p className="text-blue-800 text-sm">
                                                Your banking details are encrypted and secure. We use this information only for processing your earnings from sales.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Select
                                    label="Bank Name"
                                    options={bankOptions}
                                    value={formData.bank_name}
                                    onChange={(e) => handleInputChange('bank_name', e.target.value)}
                                    error={errors.bank_name}
                                    required
                                    placeholder="Select your bank"
                                />

                                <Input
                                    label="Account Number"
                                    type="text"
                                    value={formData.bank_account_number}
                                    onChange={(e) => handleInputChange('bank_account_number', e.target.value)}
                                    placeholder="1234567890"
                                    error={errors.bank_account_number}
                                    required
                                />

                                <Input
                                    label="Account Holder Name"
                                    type="text"
                                    value={formData.name_on_account}
                                    onChange={(e) => handleInputChange('name_on_account', e.target.value)}
                                    placeholder="Full name as it appears on your bank account"
                                    error={errors.name_on_account}
                                    required
                                />
                            </div>
                        )}

                        {/* Step 4: Identity Verification */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="bg-yellow-50 rounded-2xl p-6 mb-6">
                                    <div className="flex items-start gap-3">
                                        <Info className="w-6 h-6 text-yellow-600 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-yellow-900 mb-2">Document Requirements</h3>
                                            <p className="text-yellow-800 text-sm">
                                                Upload clear, readable images of your documents. All files must be under 5MB and in PDF, JPG, or PNG format.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Select
                                    label="Gender"
                                    options={genderOptions}
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    error={errors.gender}
                                    required
                                    placeholder="Select gender"
                                />

                                <Select
                                    label="Identity Document Type"
                                    options={documentTypeOptions}
                                    value={formData.document_type}
                                    onChange={(e) => handleInputChange('document_type', e.target.value)}
                                    error={errors.document_type}
                                    required
                                    placeholder="Select document type"
                                />

                                <DocumentUpload
                                    label="Identity Document"
                                    acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                    maxSizeMB={5}
                                    value={formData.document_file ? [formData.document_file] : []}
                                    onChange={handleFileUpload('document_file')}
                                    error={errors.document_file}
                                    helperText="Upload a clear photo of your ID (PDF, JPG, PNG - Max 5MB)"
                                    maxFiles={1}
                                />

                                <DocumentUpload
                                    label="Business Cover Image"
                                    acceptedTypes=".jpg,.jpeg,.png"
                                    maxSizeMB={5}
                                    value={formData.cover_image ? [formData.cover_image] : []}
                                    onChange={handleFileUpload('cover_image')}
                                    error={errors.cover_image}
                                    helperText="Upload an image representing your business (JPG, PNG - Max 5MB)"
                                    maxFiles={1}
                                />
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
                            <Button
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className={currentStep === 1 ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-green-500 text-gray-700 hover:bg-green-300'}
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Previous
                            </Button>

                            <div className="flex items-center gap-3">
                                {/* Step indicators */}
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div
                                            key={step}
                                            className={`w-3 h-3 rounded-full transition-all ${step === currentStep
                                                ? 'bg-green-600 scale-125'
                                                : step < currentStep
                                                    ? 'bg-green-400'
                                                    : 'bg-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {currentStep < totalSteps ? (
                                    <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                                        Next
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        loading={isSubmitting}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Submit Application
                                        <CheckCircle className="w-5 h-5 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                            <p className="text-gray-600 mb-4">
                                Our support team is here to help you complete your seller registration successfully.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Support
                                </Button>
                                <Button className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Guide
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 bg-green-50/95 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
                    <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-green-600 mt-1" />
                        <div>
                            <h4 className="font-semibold text-green-900 mb-2">Your Information is Secure</h4>
                            <p className="text-green-800 text-sm leading-relaxed">
                                All personal and business information is encrypted and stored securely. We comply with
                                industry-standard security practices and will never share your data with third parties
                                without your explicit consent.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KYCRegistrationForm;