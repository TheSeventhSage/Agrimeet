import React, { useState, useMemo } from 'react';
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
    RefreshCw,
    AlertTriangle, // Added for pending
} from 'lucide-react';
import Button from '../../../shared/components/Button';
import InfoField from '../components/InfoField';
import InfoSection from '../components/InfoSection';
import { LoadingSpinner } from '../../../shared/components/Loader';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import { businessInfoConfig, ownerInfoConfig, bankInfoConfig } from '../components/kycDataConfig';
import { showSuccess, showError } from '../../../shared/utils/alert';
import { storageManager } from '../../../shared/utils/storageManager';
import DocumentViewerModal from '../components/DocumentViewerModal';

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        return dateString; // Return original string if formatting fails
    }
};

// Helper component for the status badge
const KycStatusBadge = ({ status }) => {
    const statusConfig = {
        approved: {
            icon: CheckCircle,
            text: 'Approved',
            className: 'bg-green-100 text-green-700',
        },
        pending: {
            icon: Clock,
            text: 'Pending',
            className: 'bg-yellow-100 text-yellow-700',
        },
        rejected: {
            icon: XCircle,
            text: 'Rejected',
            className: 'bg-red-100 text-red-700',
        },
        unsubmitted: {
            icon: AlertTriangle,
            text: 'Not Submitted',
            className: 'bg-gray-100 text-gray-700',
        },
    };

    const config = statusConfig[status] || statusConfig.unsubmitted;

    return (
        <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.className}`}
        >
            <config.icon className="w-5 h-5" />
            <span>{config.text}</span>
        </div>
    );
};

const KYCStatusPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateReason, setUpdateReason] = useState('');
    const [userData, setUserData] = useState(storageManager.getUserData());
    const [showDocument, setShowDocument] = useState(false);
    const [documentURL, setdocumentURL] = useState('');
    const [documentTitle, setdocumentTitle] = useState('');

    const kycData = useMemo(() => {
        const latestKyc = userData?.data?.seller?.latest_kyc;
        if (!latestKyc) {
            return {
                status: 'unsubmitted',
                submitted_at: null,
                verified_at: null,
                admin_notes: null,
                document_type: null,
                document_file: null,
                cover_image: null,
            };
        }
        // ✅ FIX: The kycData object is now directly from 'latest_kyc'
        return latestKyc;
    }, [userData]);

    const businessData = useMemo(() => {
        const seller = userData?.data?.seller;
        return {
            // ✅ FIX: Mapped to new JSON keys
            businessName: seller?.store_name,
            businessType: seller?.business_type?.name,
            businessPhone: seller?.business_phone_number,
            businessAddress: seller?.address,
            state: seller?.state,
            city: seller?.city,
            businessBio: seller?.business_bio,
        };
    }, [userData]);

    const ownerData = useMemo(() => {
        const user = userData?.data;
        const seller = userData?.data?.seller;
        return {
            // ✅ FIX: Mapped to new JSON keys
            fullName: `${user?.first_name || ''} ${user?.last_name || ''}`,
            email: user?.email,
            phoneNumber: user?.phone_number,
            gender: seller?.gender,
            state: seller?.state, // Using seller state
        };
    }, [userData]);

    const bankData = useMemo(() => {
        const seller = userData?.data?.seller;
        return {
            // ✅ FIX: Mapped to new JSON keys
            accountHolderName: seller?.name_on_account,
            accountType: 'N/A', // This was not in your new JSON
            bankName: seller?.bank_name,
            accountNumber: seller?.bank_account_number,
        };
    }, [userData]);

    // This function can stay the same
    const handleUpdateRequest = async () => {
        if (!updateReason.trim()) {
            showError('Please provide a reason for the update.');
            return;
        }
        setIsLoading(true);
        // ... (your API call logic here)
        setTimeout(() => {
            setIsLoading(false);
            setShowUpdateModal(false);
            setUpdateReason('');
            showSuccess('Your update request has been submitted.');
        }, 1500);
    };

    const openDocumentViewer = (url, title) => {
        setShowDocument(true);
        setdocumentURL(url);
        setdocumentTitle(title);
    }

    const closeDocumentViewer = () => {
        setShowDocument(false);
        setdocumentURL('');
        setdocumentTitle('');
    }

    if (!userData) {
        // Handle case where user data isn't loaded
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full">
                    <LoadingSpinner />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Business Verification (KYC)
                    </h2>
                    <p className="text-gray-600 mt-2">
                        View your current verification status and business details.
                    </p>
                </div>
                {/* <Button
                    onClick={() => setShowUpdateModal(true)}
                    disabled={kycData.status === 'pending'}
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Request Information Update
                </Button> */}
            </div>

            {/* ✅ FIX: Main KYC Status Section */}
            <InfoSection title="Verification Status" icon={Shield} className="mb-6">
                <InfoField label="Current Status">
                    <KycStatusBadge status={kycData.status} />
                </InfoField>

                <InfoField
                    label="Verification Date"
                    // Use 'verified_at' for approved, 'submitted_at' for pending
                    value={formatDate(
                        kycData.status === 'approved'
                            ? kycData.verified_at
                            : kycData.submitted_at
                    )}
                />

                <InfoField label="Document Type" value={kycData.document_type} />

                {/* Show admin notes if they exist (e.g., for rejection or approval) */}
                {kycData.admin_notes && (
                    <InfoField label="Admin Notes" value={kycData.admin_notes} className="md:col-span-2" />
                )}

                {/* Document Links */}
                {kycData.document_file && (
                    <InfoField label="View Document" className="self-end">
                        <Button
                            variant="outline"
                            onClick={() => openDocumentViewer(kycData.document_file, 'KYC Document')}
                        >
                            <Eye className="w-4 h-4 mr-2" /> View File
                        </Button>
                    </InfoField>
                )}
                {kycData.cover_image && (
                    <InfoField label="View Cover Image" className="self-end">
                        <Button
                            variant="outline"
                            onClick={() => openDocumentViewer(kycData.cover_image, 'Cover Image')}
                        >
                            <Eye className="w-4 h-4 mr-2" /> View Image
                        </Button>
                    </InfoField>
                )}
            </InfoSection>

            {/* ✅ FIX: Business Info Section (now uses flattened 'businessData') */}
            <InfoSection title="Business Information" icon={Building}>
                {businessInfoConfig.map((field) => (
                    <InfoField
                        key={field.key}
                        label={field.label}
                        value={businessData[field.key]}
                        className={field.span}
                    />
                ))}
            </InfoSection>

            {/* ✅ FIX: Owner Info Section (now uses flattened 'ownerData') */}
            <InfoSection title="Owner Information" icon={User}>
                {ownerInfoConfig.map((field) => (
                    <InfoField
                        key={field.key}
                        label={field.label}
                        value={ownerData[field.key]}
                        className={field.span}
                    />
                ))}
            </InfoSection>

            {/* ✅ FIX: Bank Info Section (now uses flattened 'bankData') */}
            <InfoSection title="Bank Details" icon={CreditCard}>
                {bankInfoConfig.map((field) => (
                    <InfoField
                        key={field.key}
                        label={field.label}
                        value={bankData[field.key]}
                        className={field.span}
                    />
                ))}
            </InfoSection>

            {/* Update Modal (no changes needed here) */}
            <ConfirmationModal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                onConfirm={handleUpdateRequest}
                title="Request Information Update"
                confirmText={isLoading ? 'Submitting...' : 'Submit Request'}
                isConfirmLoading={isLoading}
            >
                <div>
                    <label htmlFor="updateReason" className="block text-sm font-medium text-gray-700 mb-2">
                        What information do you need to update and why?
                    </label>
                    <textarea
                        id="updateReason"
                        value={updateReason}
                        onChange={(e) => setUpdateReason(e.target.value)}
                        placeholder="e.g., I need to update my bank account number..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        rows={4}
                        disabled={isLoading}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Our team will review your request within 24 hours.
                    </p>
                </div>
            </ConfirmationModal>

            {/* Verification Note */}
            {kycData.status === 'approved' && ( // ✅ FIX: Changed from 'verified' to 'approved'
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-green-800">Verification Complete</h4>
                            <p className="text-sm text-green-700">
                                Your business has been successfully verified.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <DocumentViewerModal
                isOpen={showDocument}
                onClose={() => { closeDocumentViewer() }}
                documentUrl={documentURL}
                title={documentTitle}
            />
        </DashboardLayout>
    );
};

export default KYCStatusPage;