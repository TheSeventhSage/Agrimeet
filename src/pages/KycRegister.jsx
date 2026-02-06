import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, ArrowLeft, CheckCircle, Phone, FileText, Shield, Info, Home
} from 'lucide-react';
import Input from '../shared/components/Input';
import Select from '../shared/components/Select';
import Textarea from '../shared/components/Textarea';
import Button from '../shared/components/Button';
import DocumentUpload from '../shared/components/DocumentUpload';
import { showSuccess, showError } from '../shared/utils/alert';
import { InlineLoader } from '../shared/components/Loader';
import BackgroundArt from '../shared/components/BackgroundArt';
import { submitKYC, getBanks, getBusinessTypes } from './api/kyc.api';
import KycGuideModal from './components/KycGuideModal';
// --- GEOAPIFY IMPORTS ---
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import ContactSupportModal from './components/ContactSupportModal';

const STORAGE_KEY = 'kyc_form_persistence';

const KYCRegistrationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [businessTypesList, setBusinessTypesList] = useState([]);
    const [banksList, setBanksList] = useState([]);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isAddressLoading, setIsAddressLoading] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    // Form data state - Includes latitude and longitude
    const [formData, setFormData] = useState({
        business_type_id: '',
        store_name: '',
        address: '',
        city: '',
        state: '',
        latitude: null,  // Stored in state
        longitude: null, // Stored in state
        business_phone_number: '',
        bank_name: '',
        bank_code: '',
        bank_account_number: '',
        name_on_account: '',
        business_bio: '',
        gender: '',
        document_type: '',
        document_file: null,
        cover_image: null
    });

    // Data persistence logic
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            // Logic 1: RESTORE (Only runs once on mount)
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                try {
                    const { step, data } = JSON.parse(savedData);
                    if (step) setCurrentStep(step);
                    if (data) {
                        setFormData(prev => ({ ...prev, ...data }));
                    }
                } catch (e) {
                    console.error("Error restoring persisted data", e);
                }
            }
            isFirstRender.current = false; // Mark initialization as complete
        } else {
            // Logic 2: SAVE (Runs on subsequent updates)
            const dataToSave = { ...formData };
            // Exclude File objects as they can't be serialized
            delete dataToSave.document_file;
            delete dataToSave.cover_image;

            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                step: currentStep,
                data: dataToSave
            }));
        }
    }, [formData, currentStep]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Run both API calls in parallel for better performance
                const [typesData, banksData] = await Promise.all([
                    getBusinessTypes(),
                    getBanks()
                ]);

                // 1. Process Business Types
                const formattedTypes = Array.isArray(typesData.data)
                    ? typesData.data.map(item => ({
                        value: item.id,
                        label: item.name
                    }))
                    : [];
                setBusinessTypesList(formattedTypes);

                // 2. Process Banks List
                // We store the 'code' in the object so handleBankChange can find it
                const formattedBanks = Array.isArray(banksData)
                    ? banksData.map(bank => ({
                        value: bank.name,
                        label: bank.name,
                        code: bank.code
                    }))
                    : [];
                setBanksList(formattedBanks);

            } catch (error) {
                console.error("Error loading registration data:", error);
                showError("Could not load form data. Please refresh.");
            }
        };

        fetchInitialData();
    }, []);

    console.log(businessTypesList, banksList);

    const totalSteps = 4;

    // --- MAP HANDLER ---
    const handleAddressSelect = (value) => {
        setIsAddressLoading(false);

        // 1. Log the RAW response to see exactly what Geoapify sent back
        console.log("📍 GEOAPIFY RAW DATA:", value);

        if (value && value.properties) {
            const props = value.properties;

            // 2. Log specific values to confirm we have them
            console.log("---- 🔍 DEBUGGING LOCATION DATA ----");
            console.log("Captured Latitude:", props.lat);
            console.log("Captured Longitude:", props.lon);
            console.log("Raw City Value:", props.city);
            console.log("Raw Town Value:", props.town);
            console.log("------------------------------------");

            setFormData(prev => ({
                ...prev,
                address: props.formatted,
                // 3. CITY FIX: specific logic to catch 'towns' or 'villages' if city is null
                city: props.city || props.town || props.village || props.county || '',
                state: props.state || prev.state,
                latitude: props.lat,
                longitude: props.lon
            }));

            // Clear errors if valid
            if (errors.address) setErrors(prev => ({ ...prev, address: null }));
            if (errors.city && (props.city || props.town)) setErrors(prev => ({ ...prev, city: null }));
        }
    };

    const handleAddressInput = () => {
        // Trigger loading when user starts typing
        setIsAddressLoading(true);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (name, fileData) => {
        let actualFile = null;

        // Case 1: Array from DocumentUpload [{ id, file: FileObj, ... }]
        if (Array.isArray(fileData) && fileData.length > 0) {
            // We extract the actual browser 'File' object stored in the .file property
            actualFile = fileData[0].file;
        }
        // Case 2: Standard Event object (fallback)
        else if (fileData && fileData.target && fileData.target.files) {
            actualFile = fileData.target.files[0];
        }
        // Case 3: Direct file object
        else {
            actualFile = fileData;
        }

        console.log(`File selected for ${name}:`, actualFile); // Debug log

        setFormData(prev => ({
            ...prev,
            [name]: actualFile
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleBankChange = (e) => {
        const selectedBankName = e.target.value;
        const bankData = banksList.find(b => b.value === selectedBankName);

        setFormData(prev => ({
            ...prev,
            bank_name: selectedBankName,
            bank_code: bankData ? bankData.code : '' // Set the code automatically
        }));

        if (errors.bank_name) setErrors(prev => ({ ...prev, bank_name: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.store_name.trim()) newErrors.store_name = 'Store name is required';
                if (!formData.business_type_id) newErrors.business_type_id = 'Business type is required';
                if (!formData.business_bio.trim()) newErrors.business_bio = 'Business bio is required';
                break;
            case 2:
                // Validation ensures user selected from dropdown (which provides lat/long)
                if (!formData.address.trim()) newErrors.address = 'Address is required';
                if (!formData.latitude || !formData.longitude) {
                    newErrors.address = 'Please select a valid address from the dropdown list to capture location';
                }

                if (!formData.city.trim()) newErrors.city = 'City is required';
                if (!formData.state.trim()) newErrors.state = 'State is required';
                if (!formData.business_phone_number.trim()) newErrors.business_phone_number = 'Phone number is required';
                break;
            case 3:
                if (!formData.bank_name.trim()) newErrors.bank_name = 'Bank name is required';
                if (!formData.bank_account_number.trim()) newErrors.bank_account_number = 'Account number is required';
                if (!formData.name_on_account.trim()) newErrors.name_on_account = 'Account name is required';
                break;
            case 4:
                if (!formData.document_type) newErrors.document_type = 'Document type is required';
                if (!formData.document_file) newErrors.document_file = 'Document file is required';
                if (!formData.cover_image) newErrors.cover_image = 'Cover image is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            window.scrollTo(0, 0);
        } else {
            showError('Please fix the errors before proceeding');
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    // --- SUBMISSION LOGIC ---
    const handleSubmit = async () => {
        // 1. Validate the current (last) step before proceeding
        if (!validateStep(currentStep)) return;

        // 2. Trigger loading state for the button
        setIsSubmitting(true);

        try {
            const submissionData = new FormData();

            // 3. Append all data including coordinates and bank details
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    submissionData.append(key, formData[key]);
                }
            });

            const payload = submissionData;
            delete payload.document_file;
            delete payload.cover_image;
            localStorage.setItem('PAYLOAD', JSON.stringify(payload));

            // 4. Single API Call: Submit all registration data at once
            const response = await submitKYC(submissionData);

            // 5. Show Success Alert
            showSuccess(response?.message || 'KYC submitted successfully! Your account is now pending approval.');

            // Clear persistence upon success
            localStorage.removeItem(STORAGE_KEY);

            // 6. DELAY REDIRECT: Give the user 3 seconds to read the alert
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);

        } catch (error) {
            // Handle errors and stop loading so user can try again
            console.error("Submission Error:", error);
            // Use existing alert logic to extract backend errors
            showError(error.response?.data || error.message || 'An unexpected error occurred.');
            setIsSubmitting(false);
        }
        // Note: We don't setIsSubmitting(false) on success to keep the button 
        // in a loading state while the page is redirecting.
    };

    // Helper to render steps
    const renderStepIndicator = () => (
        <div className="mb-8">
            {/* --- MOBILE VIEW: Compact Indicator (< 768px) --- */}
            <div className="block md:hidden">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">
                        Step {currentStep} of {totalSteps}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                        {['Business Info', 'Location', 'Banking', 'Documents'][currentStep - 1]}
                    </span>
                </div>
                {/* Mobile Progress Bar */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-600 transition-all duration-300 ease-out"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            {/* --- DESKTOP VIEW: Full Stepper (>= 768px) --- */}
            <div className="hidden md:flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
                {[1, 2, 3, 4].map((step) => (
                    <div
                        key={step}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${step <= currentStep
                            ? 'bg-green-600 text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                            }`}
                    >
                        {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
                    </div>
                ))}
            </div>
            <div className="hidden md:flex justify-between mt-2 text-sm font-medium text-gray-500">
                <span>Business Info</span>
                <span>Location</span>
                <span>Banking</span>
                <span>Documents</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <Link
                to="/"
                className="hidden md:block absolute top-4 left-4 z-50 p-3 bg-brand-300/80 backdrop-blur-md hover:bg-white rounded-full shadow-sm text-green-800 transition-all hover:scale-105 border border-white/50"
                aria-label="Back to Home"
            >
                <Home className="w-5 h-5" />
            </Link>

            <BackgroundArt />

            <div className="w-full max-w-2xl relative z-10">
                <Link
                    to="/"
                    className="md:hidden absolute top-3 left-3 z-50 p-2.5 bg-brand-300/80 backdrop-blur-md hover:bg-white rounded-full shadow-sm text-green-800 transition-all hover:scale-105 border border-white/50"
                    aria-label="Back to Home"
                >
                    <Home className="w-3.5 h-3.5" />
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Complete Verification</h2>
                            <p className="text-gray-500 text-sm md:text-base">Please provide your business details to continue</p>
                        </div>

                        {renderStepIndicator()}

                        <div className="mt-8">
                            {/* STEP 1 */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <Select
                                        label="Business Type"
                                        name="business_type_id"
                                        value={formData.business_type_id}
                                        onChange={handleInputChange}
                                        error={errors.business_type_id}
                                        options={businessTypesList}
                                        required
                                    />
                                    <Input
                                        label="Store Name"
                                        name="store_name"
                                        value={formData.store_name}
                                        onChange={handleInputChange}
                                        error={errors.store_name}
                                        placeholder="e.g. Green Valley Foods"
                                        required
                                    />
                                    <Textarea
                                        label="Business Bio"
                                        name="business_bio"
                                        value={formData.business_bio}
                                        onChange={handleInputChange}
                                        error={errors.business_bio}
                                        placeholder="Tell us about your business..."
                                        rows={4}
                                        required
                                    />
                                    <Select
                                        label="Gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: 'male', label: 'Male' },
                                            { value: 'female', label: 'Female' },
                                        ]}
                                    />
                                </div>
                            )}

                            {/* STEP 2 - GEOAPIFY INTEGRATION */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-fadeIn">

                                    {/* ADDRESS INPUT REPLACEMENT */}
                                    <div className="form-group relative z-50">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Business Address <span className="text-red-500">*</span>
                                        </label>
                                        <GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_KEY}>
                                            <GeoapifyGeocoderAutocomplete
                                                placeholder="Start typing your address..."
                                                placeSelect={handleAddressSelect}
                                                onUserInput={handleAddressInput}
                                                value={formData.address}
                                                filterByCountryCode={['ng']}
                                            />
                                        </GeoapifyContext>

                                        {/* Loading Spinner */}
                                        {isAddressLoading && (
                                            <div className="absolute right-12 top-[55%] z-[60]">
                                                <InlineLoader className="w-5 h-5 text-brand-800 animate-spin" />
                                            </div>
                                        )}

                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            error={errors.city}
                                            required
                                        />
                                        <Input
                                            label="State"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            error={errors.state}
                                            required
                                        />
                                    </div>

                                    <Input
                                        label="Business Phone Number"
                                        name="business_phone_number"
                                        value={formData.business_phone_number}
                                        onChange={handleInputChange}
                                        error={errors.business_phone_number}
                                        icon={Phone}
                                        placeholder="+234..."
                                        required
                                    />
                                </div>
                            )}

                            {/* STEP 3 */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <Select
                                        label="Bank Name"
                                        name="bank_name"
                                        value={formData.bank_name}
                                        onChange={handleBankChange} // Use our custom bank handler
                                        error={errors.bank_name}
                                        options={banksList}
                                        required
                                    />

                                    {/* Hidden or read-only bank code field (Optional, for debugging) */}
                                    <input type="hidden" name="bank_code" value={formData.bank_code} />

                                    <Input
                                        label="Account Number"
                                        name="bank_account_number"
                                        value={formData.bank_account_number}
                                        onChange={handleInputChange}
                                        error={errors.bank_account_number}
                                        required
                                    />
                                    <Input
                                        label="Account Name"
                                        name="name_on_account"
                                        value={formData.name_on_account}
                                        onChange={handleInputChange}
                                        error={errors.name_on_account}
                                        required
                                    />
                                </div>
                            )}

                            {/* STEP 4 */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <Select
                                        label="Document Type"
                                        name="document_type"
                                        value={formData.document_type}
                                        onChange={handleInputChange}
                                        error={errors.document_type}
                                        options={[
                                            { value: 'national_id', label: 'National ID' },
                                            { value: 'drivers_license', label: 'Driver\'s License' },
                                            { value: 'passport', label: 'International Passport' },
                                            { value: 'voters_card', label: 'Voters Card' }
                                        ]}
                                        required
                                    />
                                    <DocumentUpload
                                        label="Identity Document"
                                        name="document_file"
                                        onChange={(file) => handleFileChange('document_file', file)}
                                        error={errors.document_file}
                                        required
                                    />
                                    <DocumentUpload
                                        label="Business Cover Image"
                                        name="cover_image"
                                        onChange={(file) => handleFileChange('cover_image', file)}
                                        error={errors.cover_image}
                                        required
                                    />
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="mt-8 flex flex-col md:flex-row gap-4">
                                {currentStep > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={handlePrev}
                                        className="flex-1"
                                        disabled={isSubmitting}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Previous
                                    </Button>
                                )}
                                <Button
                                    onClick={currentStep === totalSteps ? handleSubmit : handleNext}
                                    className="flex-1"
                                    loading={isSubmitting}
                                >
                                    {currentStep === totalSteps ? (
                                        'Submit Verification'
                                    ) : (
                                        <>
                                            Next Step
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Footer links */}
                            <div className="mt-6 flex items-center flex-col gap-2.5 md:flex-row justify-between text-sm text-gray-500 pt-6 border-t border-gray-100">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsSupportOpen(true)}
                                    className="w-full md:w-fit text-gray-500 hover:text-gray-700 p-0"
                                >
                                    <Info className="w-4 h-4 mr-2" />
                                    Call Support
                                </Button>
                                <Button
                                    className="w-full md:w-fit hover:bg-blue-100"
                                    onClick={() => setIsGuideOpen(true)}
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Guide
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 bg-green-50/95 backdrop-blur-xs rounded-2xl p-6 border border-green-200">
                    <div className="flex flex-col md:flex-col items-start gap-3">
                        <div className="flex gap-2 items-center">
                            <Shield className="w-6 h-6 text-green-600" />
                            <h4 className="font-semibold text-green-900">Your Information is Secure</h4>
                        </div>
                        <div>
                            <p className="text-green-800 text-sm leading-relaxed">
                                All personal and business information is encrypted and stored securely. We comply with
                                industry-standard security practices and will never share your data with third parties
                                without your explicit consent.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- KYC Guide Modal  --- */}
            <KycGuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />

            {/* Support Modal */}
            <ContactSupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
            />
        </div>
    );
};

export default KYCRegistrationForm;