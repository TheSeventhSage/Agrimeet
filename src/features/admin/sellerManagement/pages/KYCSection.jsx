// admin/components/sellers/KYCSection.jsx
import {
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Calendar,
    Image as ImageIcon,
    ExternalLink
} from 'lucide-react';

const KYCSection = ({ seller }) => {
    const latestKyc = seller.latest_kyc;
    const allKycSubmissions = seller.kyc_submissions || [];

    const getKycStatusConfig = (status) => {
        const configs = {
            approved: {
                color: 'bg-green-50 border-green-200',
                textColor: 'text-green-900',
                icon: CheckCircle,
                iconColor: 'text-green-600',
                label: 'Approved'
            },
            pending: {
                color: 'bg-yellow-50 border-yellow-200',
                textColor: 'text-yellow-900',
                icon: Clock,
                iconColor: 'text-yellow-600',
                label: 'Pending Review'
            },
            rejected: {
                color: 'bg-red-50 border-red-200',
                textColor: 'text-red-900',
                icon: XCircle,
                iconColor: 'text-red-600',
                label: 'Rejected'
            }
        };
        return configs[status] || configs.pending;
    };

    const getDocumentTypeLabel = (type) => {
        const labels = {
            nin: 'National ID (NIN)',
            passport: 'International Passport',
            national_id: 'National ID Card',
            drivers_license: "Driver's License"
        };
        return labels[type] || type?.replace('_', ' ').toUpperCase() || 'Unknown';
    };

    if (!latestKyc && allKycSubmissions.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No KYC Submission</p>
                <p className="text-sm text-gray-500 mt-1">This seller has not submitted any KYC documents yet</p>
            </div>
        );
    }

    const config = latestKyc ? getKycStatusConfig(latestKyc.status) : null;
    const Icon = config?.icon;

    return (
        <div className="space-y-6">
            {/* Latest KYC Status */}
            {latestKyc && (
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-brand-600" />
                        Current KYC Status
                    </h4>

                    <div className={`p-4 rounded-lg border ${config.color}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Icon className={`w-6 h-6 ${config.iconColor}`} />
                                <div>
                                    <p className={`font-medium ${config.textColor}`}>{config.label}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Submitted: {new Date(latestKyc.submitted_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-medium text-gray-600">Document Type</label>
                                <p className="text-sm text-gray-900 mt-1">
                                    {getDocumentTypeLabel(latestKyc.document_type)}
                                </p>
                            </div>

                            {latestKyc.verified_at && (
                                <div>
                                    <label className="text-xs font-medium text-gray-600">Verified Date</label>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {new Date(latestKyc.verified_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {latestKyc.admin_notes && (
                            <div className="bg-white bg-opacity-50 rounded-lg p-3">
                                <label className="text-xs font-medium text-gray-600">Admin Notes</label>
                                <p className="text-sm text-gray-900 mt-1">{latestKyc.admin_notes}</p>
                            </div>
                        )}

                        {/* Document Files */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {latestKyc.document_file && (
                                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-brand-600" />
                                            <span className="text-sm font-medium text-gray-900">ID Document</span>
                                        </div>
                                    </div>
                                    <a
                                        href={latestKyc.document_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 hover:underline"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Document
                                    </a>
                                </div>
                            )}

                            {latestKyc.cover_image && (
                                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-brand-600" />
                                            <span className="text-sm font-medium text-gray-900">Cover Image</span>
                                        </div>
                                    </div>
                                    <a
                                        href={latestKyc.cover_image}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 hover:underline"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Image
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* KYC Submission History */}
            {allKycSubmissions.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-brand-600" />
                        KYC Submission History ({allKycSubmissions.length})
                    </h4>

                    <div className="space-y-3">
                        {allKycSubmissions.map((kyc, index) => {
                            const historyConfig = getKycStatusConfig(kyc.status);
                            const HistoryIcon = historyConfig.icon;

                            return (
                                <div
                                    key={kyc.id || index}
                                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <HistoryIcon className={`w-5 h-5 ${historyConfig.iconColor}`} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {getDocumentTypeLabel(kyc.document_type)}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Submitted: {new Date(kyc.submitted_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${historyConfig.color.replace('bg-', 'bg-opacity-100 bg-')}`}>
                                            {historyConfig.label}
                                        </span>
                                    </div>

                                    {kyc.admin_notes && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs text-gray-600">
                                                <span className="font-medium">Admin Notes:</span> {kyc.admin_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KYCSection;