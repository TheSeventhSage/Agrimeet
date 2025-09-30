import React, { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    Building,
    User,
    CreditCard,
    Shield,
    Download,
    Eye,
    RefreshCw
} from 'lucide-react';
import Button from '../../../shared/components/Button';
import InfoField from '../components/InfoField';
import InfoSection from '../components/InfoSection';
import LoadingSpinner from '../../../shared/components/Loading';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import { businessInfoConfig, ownerInfoConfig, bankInfoConfig } from '../components/kycDataConfig';
import { showSuccess, showError } from '../../../shared/utils/alert';

const KYCStatusPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateReason, setUpdateReason] = useState('');

    // Mock data - in real app, this would come from API
    const kycData = {
        status: 'verified',
        submittedDate: '2024-01-15',
        verifiedDate: '2024-01-18',
        verificationId: 'KYC-2024-0015',

        businessInfo: {
            businessName: 'AgriTech Solutions Ltd',
            businessType: 'llc',
            registrationNumber: 'REG-123456789',
            taxId: 'TAX-987654321',
            businessAddress: '123 Farm Street, Agricultural Zone, City 10001',
            businessPhone: '+1 (555) 123-4567'
        },

        ownerInfo: {
            fullName: 'John Doe',
            dateOfBirth: '1985-06-15',
            idNumber: 'ID-123456789',
            idType: 'national_id'
        },

        bankInfo: {
            accountHolderName: 'John Doe',
            accountType: 'business',
            bankName: 'Agricultural Bank',
            accountNumber: '•••• •••• •••• 1234',
            routingNumber: '021000021',
            iban: '',
            swiftCode: 'AGRIOUS33'
        },

        documents: {
            businessRegistration: { name: 'business_registration.pdf', uploaded: '2024-01-15' },
            taxCertificate: { name: 'tax_certificate.pdf', uploaded: '2024-01-15' },
            idDocument: { name: 'national_id_front.jpg', uploaded: '2024-01-15' },
            proofOfAddress: { name: 'utility_bill.pdf', uploaded: '2024-01-15' }
        }
    };

    const businessTypes = {
        sole_proprietorship: 'Sole Proprietorship',
        partnership: 'Partnership',
        llc: 'LLC',
        corporation: 'Corporation',
        non_profit: 'Non-Profit'
    };

    const idTypes = {
        passport: 'Passport',
        drivers_license: "Driver's License",
        national_id: 'National ID'
    };

    const accountTypes = {
        savings: 'Savings Account',
        checking: 'Checking Account',
        business: 'Business Account'
    };

    const statusConfig = {
        pending: {
            icon: Clock,
            color: 'text-yellow-600 bg-yellow-100',
            border: 'border-yellow-200',
            label: 'Under Review',
            message: 'Your KYC verification is being reviewed by our team.'
        },
        verified: {
            icon: CheckCircle,
            color: 'text-green-600 bg-green-100',
            border: 'border-green-200',
            label: 'Verified',
            message: 'Your KYC verification has been successfully completed.'
        },
        rejected: {
            icon: XCircle,
            color: 'text-red-600 bg-red-100',
            border: 'border-red-200',
            label: 'Rejected',
            message: 'Your KYC verification requires additional information.'
        }
    };

    const handleRequestUpdate = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            showSuccess('Update request submitted successfully! Our team will review your request within 24 hours.');
            setShowUpdateModal(false);
            setUpdateReason('');
        } catch (error) {
            showError('Failed to submit update request. Please try again.');
            console.error('Update request error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to render fields from config
    const renderFields = (data, config, typeMaps = {}) => {
        return config
            .filter(({ condition }) => !condition || condition(data))
            .map(({ key, label, transform, span }) => {
                let value = data[key];

                if (transform) {
                    value = transform(value, typeMaps);
                }

                return (
                    <InfoField
                        key={key}
                        label={label}
                        value={value}
                        className={span}
                    />
                );
            });
    };

    const StatusBadge = () => {
        const { icon: Icon, color, border, label } = statusConfig[kycData.status];

        return (
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${color} ${border} border`}>
                <Icon className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{label}</span>
            </div>
        );
    };

    const DocumentCard = ({ title, document }) => (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                        <p className="text-sm text-gray-500">{document.name}</p>
                        <p className="text-xs text-gray-400">Uploaded: {document.uploaded}</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                        <LoadingSpinner />
                        <span className="text-gray-700">Processing your request...</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">KYC Verification Status</h1>
                    <p className="text-gray-600">View your business verification details</p>
                </div>
                <StatusBadge />
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Shield className="w-8 h-8 text-brand-600 mr-4" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Verification Details</h3>
                            <p className="text-sm text-gray-600">
                                {statusConfig[kycData.status].message}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <InfoField label="Verification ID" value={kycData.verificationId} />
                        <p className="text-xs text-gray-500 mt-1">
                            Submitted: {kycData.submittedDate} • Verified: {kycData.verifiedDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Business Information */}
            <InfoSection title="Business Information" icon={Building}>
                {renderFields(kycData.businessInfo, businessInfoConfig, businessTypes)}
            </InfoSection>

            {/* Owner Information */}
            <InfoSection title="Owner Information" icon={User}>
                {renderFields(kycData.ownerInfo, ownerInfoConfig, idTypes)}
            </InfoSection>

            {/* Bank Information */}
            <InfoSection title="Bank Account Details" icon={CreditCard}>
                {renderFields(kycData.bankInfo, bankInfoConfig, accountTypes)}
            </InfoSection>

            {/* Uploaded Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <FileText className="w-6 h-6 text-gray-400 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DocumentCard
                        title="Business Registration Certificate"
                        document={kycData.documents.businessRegistration}
                    />
                    <DocumentCard
                        title="Tax Certificate"
                        document={kycData.documents.taxCertificate}
                    />
                    <DocumentCard
                        title="Government ID"
                        document={kycData.documents.idDocument}
                    />
                    <DocumentCard
                        title="Proof of Address"
                        document={kycData.documents.proofOfAddress}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
                <Button
                    variant="outline"
                    onClick={() => setShowUpdateModal(true)}
                    disabled={isLoading}
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Request Update
                </Button>
            </div>

            {/* Update Request Modal */}
            <ConfirmationModal
                isOpen={showUpdateModal}
                onClose={() => {
                    setShowUpdateModal(false);
                    setUpdateReason('');
                }}
                onConfirm={handleRequestUpdate}
                title="Request KYC Information Update"
                confirmText={isLoading ? "Submitting..." : "Submit Request"}
                cancelText="Cancel"
                type="info"
                disabled={isLoading || !updateReason.trim()}
            >
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for update request *
                    </label>
                    <textarea
                        value={updateReason}
                        onChange={(e) => setUpdateReason(e.target.value)}
                        placeholder="Please describe what information needs to be updated and why..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        rows={4}
                        disabled={isLoading}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Our team will review your request within 24 hours and contact you if additional information is needed.
                    </p>
                </div>
            </ConfirmationModal>

            {/* Verification Note */}
            {kycData.status === 'verified' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-green-800">Verification Complete</h4>
                            <p className="text-sm text-green-700">
                                Your business has been successfully verified. You can now access all platform features
                                and start selling your agricultural products.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default KYCStatusPage;