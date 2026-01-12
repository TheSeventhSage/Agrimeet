import { useState, useEffect } from 'react';
import {
    ArrowRight, ArrowLeft, CheckCircle, Phone, FileText, Shield, Info
} from 'lucide-react';
import Input from '../shared/components/Input';
import Select from '../shared/components/Select';
import Textarea from '../shared/components/Textarea';
import Button from '../shared/components/Button';
import DocumentUpload from '../shared/components/DocumentUpload';
import { showSuccess, showError } from '../shared/utils/alert';
import BackgroundArt from '../shared/components/BackgroundArt';
// Import the 3 API functions
import { submitKYC, updateSellerLocation, validateSellerAddress, getBusinessTypes } from './api/kyc.api';

// --- GEOAPIFY IMPORTS ---
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

const KYCRegistrationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [businessTypesList, setBusinessTypesList] = useState([]);

    useEffect(() => {
        const fetchTypes = async () => {
            const data = await getBusinessTypes();
            // We assume the API returns an array like [{id: 1, name: 'Retailer'}, ...]
            // We map it to the format the Select component expects: { value, label }
            const formattedOptions = Array.isArray(data.data)
                ? data.data.map(item => ({
                    value: item.id,
                    label: item.name
                }))
                : [];

            console.log(formattedOptions)

            setBusinessTypesList(formattedOptions);
        };

        fetchTypes();
    }, []);

    console.log(businessTypesList);

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
        bank_account_number: '',
        name_on_account: '',
        business_bio: '',
        gender: '',
        document_type: '',
        document_file: null,
        cover_image: null
    });

    const totalSteps = 4;

    // --- MAP HANDLER ---
    const handleAddressSelect = (value) => {
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
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        try {
            // Prepare FormData (Exclude lat/long for the first call)
            const submissionData = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'latitude' && key !== 'longitude') {
                    submissionData.append(key, formData[key]);
                }
            });

            // STEP 1: Submit Basic KYC
            const kycResponse = await submitKYC(submissionData);

            // Extract Seller ID from response (adjust based on actual response structure)
            // Assuming response looks like: { seller: { id: 123 }, ... }
            const sellerId = kycResponse.seller?.id;

            if (!sellerId) {
                console.warn("Seller ID missing from response, skipping location updates.");
            } else {
                // STEP 2: Update Location (Silent background update)
                await updateSellerLocation(formData.latitude, formData.longitude);

                // STEP 3: Validate Address / Generate Address Code
                await validateSellerAddress(sellerId);
            }

            // SUCCESS & REDIRECT
            showSuccess('KYC submitted successfully! Pending Admin Approval.');

            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);

        } catch (error) {
            showError('Submission Failed', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to render steps
    const renderStepIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
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
            <div className="flex justify-between mt-2 text-sm font-medium text-gray-500">
                <span>Business Info</span>
                <span>Location</span>
                <span>Banking</span>
                <span>Documents</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <BackgroundArt />

            <div className="w-full max-w-2xl relative z-10">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Verification</h2>
                            <p className="text-gray-500">Please provide your business details to continue</p>
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
                                            { value: 'other', label: 'Other' }
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
                                                value={formData.address}
                                                filterByCountryCode={['ng']}
                                            />
                                        </GeoapifyContext>
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
                                    <Input
                                        label="Bank Name"
                                        name="bank_name"
                                        value={formData.bank_name}
                                        onChange={handleInputChange}
                                        error={errors.bank_name}
                                        required
                                    />
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
                            <div className="mt-8 flex gap-4">
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
                                    isLoading={isSubmitting}
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
                            <div className="mt-6 flex items-center justify-between text-sm text-gray-500 pt-6 border-t border-gray-100">
                                <Button variant="ghost" className="text-gray-500 hover:text-gray-700 p-0">
                                    <Info className="w-4 h-4 mr-2" />
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
                <div className="mt-6 bg-green-50/95 backdrop-blur-xs rounded-2xl p-6 border border-green-200">
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