import React, { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { Upload, CheckCircle, Clock, AlertCircle, FileText, Building, User, CreditCard } from 'lucide-react';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
// import FileUpload from '../../../shared/components/FileUpload';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import { showSuccess, showError } from '../../../shared/utils/alert';
import DocumentUpload from '../../../shared/components/DocumentUpload';

const KYCPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Form states
    const [businessInfo, setBusinessInfo] = useState({
        businessName: '',
        businessType: '',
        registrationNumber: '',
        taxId: '',
        businessAddress: '',
        businessPhone: ''
    });

    const [ownerInfo, setOwnerInfo] = useState({
        fullName: '',
        dateOfBirth: '',
        idNumber: '',
        idType: 'passport'
    });

    const [bankInfo, setBankInfo] = useState({
        accountHolderName: '',
        accountType: '',
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        iban: '',
        swiftCode: ''
    });

    const [documents, setDocuments] = useState({
        businessRegistration: [],
        taxCertificate: [],
        idDocument: [],
        proofOfAddress: []
    });

    // Update the handleFileSelect function for each document type


    const steps = [
        { id: 1, label: 'Business Info', icon: Building },
        { id: 2, label: 'Owner Info', icon: User },
        { id: 3, label: 'Bank Details', icon: CreditCard },
        { id: 4, label: 'Documents', icon: FileText },
        { id: 5, label: 'Review', icon: CheckCircle }
    ];

    const businessTypes = [
        { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'llc', label: 'LLC' },
        { value: 'corporation', label: 'Corporation' },
        { value: 'non_profit', label: 'Non-Profit' }
    ];

    const idTypes = [
        { value: 'passport', label: 'Passport' },
        { value: 'drivers_license', label: "Driver's License" },
        { value: 'national_id', label: 'National ID' }
    ];

    const accountTypes = [
        { value: 'savings', label: 'Savings Account' },
        { value: 'checking', label: 'Checking Account' },
        { value: 'business', label: 'Business Account' }
    ];

    const validateStep = (step) => {
        switch (step) {
            case 1:
                return (
                    businessInfo.businessName &&
                    businessInfo.businessType &&
                    businessInfo.registrationNumber &&
                    businessInfo.taxId &&
                    businessInfo.businessAddress &&
                    businessInfo.businessPhone
                );
            case 2:
                return (
                    ownerInfo.fullName &&
                    ownerInfo.dateOfBirth &&
                    ownerInfo.idNumber &&
                    ownerInfo.idType
                );
            case 3:
                return (
                    bankInfo.accountHolderName &&
                    bankInfo.accountType &&
                    bankInfo.bankName &&
                    bankInfo.accountNumber &&
                    bankInfo.routingNumber
                );
            case 4:
                return (
                    documents.businessRegistration.length > 0 &&
                    documents.taxCertificate.length > 0 &&
                    documents.idDocument.length > 0 &&
                    documents.proofOfAddress.length > 0
                );
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) {
            showError('Please fill in all required fields');
            return;
        }

        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            showSuccess('KYC submitted successfully! Your application is under review.');
            setShowConfirmModal(false);
        } catch (error) {
            showError('Failed to submit KYC. Please try again.');
            console.error('KYC submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Business Name"
                                value={businessInfo.businessName}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                                required
                            />
                            <Select
                                label="Business Type"
                                options={businessTypes}
                                value={businessInfo.businessType}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, businessType: e.target.value })}
                                required
                            />
                            <Input
                                label="Registration Number"
                                value={businessInfo.registrationNumber}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, registrationNumber: e.target.value })}
                                required
                            />
                            <Input
                                label="Tax ID Number"
                                value={businessInfo.taxId}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, taxId: e.target.value })}
                                required
                            />
                            <Input
                                label="Business Address"
                                value={businessInfo.businessAddress}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, businessAddress: e.target.value })}
                                required
                                className="md:col-span-2"
                            />
                            <Input
                                label="Business Phone"
                                type="tel"
                                value={businessInfo.businessPhone}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, businessPhone: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Owner Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                value={ownerInfo.fullName}
                                onChange={(e) => setOwnerInfo({ ...ownerInfo, fullName: e.target.value })}
                                required
                            />
                            <Input
                                label="Date of Birth"
                                type="date"
                                value={ownerInfo.dateOfBirth}
                                onChange={(e) => setOwnerInfo({ ...ownerInfo, dateOfBirth: e.target.value })}
                                required
                            />
                            <Select
                                label="ID Type"
                                options={idTypes}
                                value={ownerInfo.idType}
                                onChange={(e) => setOwnerInfo({ ...ownerInfo, idType: e.target.value })}
                                required
                            />
                            <Input
                                label="ID Number"
                                value={ownerInfo.idNumber}
                                onChange={(e) => setOwnerInfo({ ...ownerInfo, idNumber: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Bank Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Account Holder Name"
                                value={bankInfo.accountHolderName}
                                onChange={(e) => setBankInfo({ ...bankInfo, accountHolderName: e.target.value })}
                                required
                            />
                            <Select
                                label="Account Type"
                                options={accountTypes}
                                value={bankInfo.accountType}
                                onChange={(e) => setBankInfo({ ...bankInfo, accountType: e.target.value })}
                                required
                            />
                            <Input
                                label="Bank Name"
                                value={bankInfo.bankName}
                                onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                                required
                            />
                            <Input
                                label="Account Number"
                                // type=""
                                value={bankInfo.accountNumber}
                                onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                                required
                            />
                            <Input
                                label="Routing Number"
                                value={bankInfo.routingNumber}
                                onChange={(e) => setBankInfo({ ...bankInfo, routingNumber: e.target.value })}
                                required
                            />
                            <Input
                                label="IBAN (International)"
                                value={bankInfo.iban}
                                onChange={(e) => setBankInfo({ ...bankInfo, iban: e.target.value })}
                                className="md:col-span-2"
                            />
                            <Input
                                label="SWIFT/BIC Code"
                                value={bankInfo.swiftCode}
                                onChange={(e) => setBankInfo({ ...bankInfo, swiftCode: e.target.value })}
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>

                        <DocumentUpload
                            label="Business Registration Certificate"
                            value={documents.businessRegistration[0] || null}
                            onChange={(files) => setDocuments({ ...documents, businessRegistration: files })}
                            helperText="Upload your official business registration document"
                            maxFiles={1}
                            acceptedTypes=".pdf,.jpg,.jpeg,.png"
                        />

                        <DocumentUpload
                            label="Tax Certificate"
                            value={documents.taxCertificate[0] || null}
                            onChange={(files) => setDocuments({ ...documents, taxCertificate: files })}
                            helperText="Upload your tax registration certificate"
                            maxFiles={1}
                            acceptedTypes=".pdf,.jpg,.jpeg,.png"
                        />

                        <DocumentUpload
                            label="Government ID"
                            value={documents.idDocument[0] || null}
                            onChange={(files) => setDocuments({ ...documents, idDocument: files })}
                            helperText="Upload a clear photo of your government-issued ID"
                            maxFiles={1}
                            acceptedTypes=".jpg,.jpeg,.png"
                        />

                        <DocumentUpload
                            label="Proof of Address"
                            value={documents.proofOfAddress[0] || null}
                            onChange={(files) => setDocuments({ ...documents, proofOfAddress: files })}
                            helperText="Utility bill or bank statement not older than 3 months"
                            maxFiles={1}
                            acceptedTypes=".pdf,.jpg,.jpeg,.png"
                        />
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Review Your Information</h3>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <h4 className="font-medium text-gray-900">Business Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><h5 className='text-gray-900 inline-block font-semibold'>Business Name:</h5> {businessInfo.businessName}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Business Type:</h5> {businessTypes.find(t => t.value === businessInfo.businessType)?.label}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Registration:</h5> {businessInfo.registrationNumber}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Tax ID:</h5> {businessInfo.taxId}</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <h4 className="font-medium text-gray-900">Owner Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Name:</h5> {ownerInfo.fullName}</div>
                                <div> <h5 className='text-gray-800 inline-block font-semibold'>Dateof Birth:</h5> {ownerInfo.dateOfBirth}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>ID Type:</h5> {idTypes.find(t => t.value === ownerInfo.idType)?.label}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>ID Number:</h5> {ownerInfo.idNumber}</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <h4 className="font-medium text-gray-900">Bank Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Bank:</h5> {bankInfo.bankName}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Account Type:</h5> {accountTypes.find(t => t.value === bankInfo.accountType)?.label}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Account Holder:</h5> {bankInfo.accountHolderName}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Account Number:</h5> ••••••••••</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
                            <div className="text-sm space-y-2">
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Business Registration:</h5> {documents.businessRegistration[0]?.name || 'Not uploaded'}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Tax Certificate:</h5> {documents.taxCertificate[0]?.name || 'Not uploaded'}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Government ID:</h5> {documents.idDocument[0]?.name || 'Not uploaded'}</div>
                                <div><h5 className='text-gray-800 inline-block font-semibold'>Proof of Address:</h5> {documents.proofOfAddress[0]?.name || 'Not uploaded'}</div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <AlertCircle className="w-5 h-5 text-yellow-500 inline-block mr-2" />
                            <span className="text-sm text-yellow-800">
                                Please review all information carefully. Once submitted, changes may require re-verification.
                            </span>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
                    <p className="text-gray-600">Complete your verification to start selling on our platform</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Verification takes 1-3 business days</span>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const isComplete = index < currentStep - 1;
                        const isCurrent = index === currentStep - 1;
                        const IconComponent = step.icon;

                        return (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isComplete
                                            ? 'bg-brand-600 border-brand-600 text-white'
                                            : isCurrent
                                                ? 'border-brand-600 bg-white text-brand-600'
                                                : 'border-gray-300 bg-white text-gray-400'
                                            }`}
                                    >
                                        {isComplete ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <IconComponent className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span
                                        className={`mt-2 text-sm font-medium ${isComplete || isCurrent
                                            ? 'text-brand-600'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>

                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-4 ${isComplete ? 'bg-brand-600' : 'bg-gray-300'
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
                <Button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={currentStep === 1 ? 'invisible' : ''}
                >
                    Previous
                </Button>

                {currentStep < steps.length ? (
                    <Button onClick={handleNext}>
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={() => setShowConfirmModal(true)}
                        loading={isSubmitting}
                    >
                        Submit Verification
                    </Button>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleSubmit}
                title="Submit KYC Verification"
                message="Are you sure you want to submit your KYC information? This action cannot be undone and will be reviewed by our team."
                confirmText="Submit for Review"
                cancelText="Cancel"
                type="info"
            />
        </DashboardLayout>
    );
};

export default KYCPage;