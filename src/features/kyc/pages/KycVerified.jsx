import React, { useState, useEffect } from 'react';
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
import { LoadingSpinner } from '../../../shared/components/Loader';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import { businessInfoConfig, ownerInfoConfig, bankInfoConfig } from '../components/kycDataConfig';
import { showSuccess, showError } from '../../../shared/utils/alert';
import { storageManager } from '../../../pages/utils/storageManager';
import { getBusinessTypes } from '../../../pages/api/profile.api'; // adjust path as needed


const KYCStatusPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateReason, setUpdateReason] = useState('');
    const [businessTypes, setBusinessTypes] = useState([]);

    useEffect(() => {
        const fetchBusinessTypes = async () => {
            try {
                const types = await getBusinessTypes(); // now returns an array
                setBusinessTypes(types);
                console.log(businessTypes);
            } catch (error) {
                console.error('Failed to fetch business types:', error);
            }
        };


        console.log(fetchBusinessTypes());

    }, []);


    // Get real data from storageManager
    const userData = storageManager.getUserData();
    console.log(userData);

    const user = userData?.data;
    const seller = user?.seller;

    // Determine KYC status based on verification_status and kyc_verified_at
    const getKYCStatus = () => {
        if (seller?.kyc_verified_at) {
            return 'verified';
        } else if (seller?.verification_status === 'pending') {
            return 'pending';
        } else if (seller?.verification_status === 'rejected') {
            return 'rejected';
        }
        return 'pending'; // Default status
    };

    // Format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Real KYC data from user data
    // Compute business type name dynamically once we have data
    const businessTypeName =
        businessTypes?.find(bt => Number(bt.id) === Number(seller?.business_type_id))?.name ||
        'Not provided';

    const kycData = {
        status: getKYCStatus(),
        verifiedDate: seller?.kyc_verified_at ? formatDate(seller.kyc_verified_at) : 'Not submitted',
        verified: seller?.verification_status ? formatDate(seller.verification_status) : 'Not verified',
        verificationId: `KYC-${user?.id?.toString().padStart(4, '0') || '0000'}`,

        businessInfo: {
            businessName: seller?.store_name || 'Not provided',
            businessType: businessTypeName, // <-- fixed mapping
            businessAddress: seller?.address || 'Not provided',
            businessPhone: seller?.business_phone_number || 'Not provided',
            city: seller?.city || 'Not provided',
            state: seller?.state || 'Not provided',
            businessBio: seller?.business_bio || 'Not provided'
        },


        ownerInfo: {
            fullName: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Not provided',
            email: user?.email || 'Not provided',
            phoneNumber: user?.phone_number || 'Not provided',
            gender: seller?.gender || 'Not provided',
            state: seller?.state || 'Not provided',
            status: user?.user_status || 'Not provided',
        },

        bankInfo: {
            accountHolderName: seller?.name_on_account || 'Not provided',
            accountType: 'business', // Default to business account
            bankName: seller?.bank_name || 'Not provided',
            accountNumber: seller?.bank_account_number ? `•••• •••• •••• ${seller.bank_account_number.slice(-4)}` : 'Not provided',
        },

        documents: {
            businessRegistration: {
                name: seller?.document_type || 'No document uploaded',
                uploaded: seller?.created_at ? formatDate(seller.created_at) : 'Not uploaded'
            },
            taxCertificate: { name: 'No document uploaded', uploaded: 'Not uploaded' },
            idDocument: { name: 'No document uploaded', uploaded: 'Not uploaded' },
            proofOfAddress: { name: 'No document uploaded', uploaded: 'Not uploaded' }
        }
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
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 mb-6">
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
                            Verified at: {kycData.verifiedDate} • Status: {kycData.status}
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
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 mb-6">
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
                    {/* <DocumentCard
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
                    /> */}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 shrink-0" />
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