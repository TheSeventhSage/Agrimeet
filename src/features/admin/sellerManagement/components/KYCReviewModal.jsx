// admin/components/KYCReviewModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, XCircle, FileText, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';
import Modal from '../../../../shared/components/Modal'; // Assuming standard modal exists
import Button from '../../../../shared/components/Button';
import TextField from '../../../../shared/components/TextFields';

const KYCReviewModal = ({ isOpen, onClose, submission, onConfirm, isLoading }) => {
    const [status, setStatus] = useState(null); // 'approved' or 'rejected'
    const [notes, setNotes] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null); //

    console.log(submission)

    if (!submission) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Review KYC Submission" size="lg">
                <div className="text-center py-8">
                    <p className="text-gray-600">No KYC submission found for this seller.</p>
                </div>
            </Modal>
        );
    }

    const handleSubmit = () => {
        onConfirm(submission.id, {
            status: status,
            admin_notes: notes
        });
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Review KYC Submission" size="lg">
                <div className="space-y-6">
                    {/* Document Preview Info */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                        {/* Main Document */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Submitted Document
                            </h4>
                            <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-100 shadow-sm">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 capitalize">{submission.document_type}</p>
                                    <p className="text-xs text-gray-500">Submitted on {new Date(submission.submitted_at).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => setPreviewUrl(submission.document_file)}
                                    className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1"
                                >
                                    View File <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Cover Image - Rule 1 */}
                        {submission.cover_image && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Cover Image
                                </h4>
                                <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-100 shadow-sm">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Cover Image</p>
                                    </div>
                                    <button
                                        onClick={() => setPreviewUrl(submission.cover_image)}
                                        className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        View Image <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Decision Area */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setStatus('approved')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${status === 'approved'
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                        >
                            <CheckCircle className={`w-8 h-8 mb-2 ${status === 'approved' ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className={`font-semibold ${status === 'approved' ? 'text-green-800' : 'text-gray-600'}`}>Approve</span>
                        </button>

                        <button
                            onClick={() => setStatus('rejected')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${status === 'rejected'
                                ? 'border-red-600 bg-red-50'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                        >
                            <XCircle className={`w-8 h-8 mb-2 ${status === 'rejected' ? 'text-red-600' : 'text-gray-400'}`} />
                            <span className={`font-semibold ${status === 'rejected' ? 'text-red-800' : 'text-gray-600'}`}>Reject</span>
                        </button>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Admin Notes / Feedback</label>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 min-h-[100px]"
                            placeholder="Explain your decision (required if rejecting)..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!status || isLoading || (status === 'rejected' && !notes)}
                            className={status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Decision'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Document Preview Modal - Rule 2 */}
            {previewUrl && (
                <Modal isOpen={!!previewUrl} onClose={() => setPreviewUrl(null)} title="Document Preview" size="xl">
                    <div className="h-[70vh] w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <iframe
                            src={previewUrl}
                            className="w-full h-full border-0 
                scrollbar-thin 
                scrollbar-thumb-gray-300 
                scrollbar-track-transparent 
                hover:scrollbar-thumb-gray-400
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:border-2
                [&::-webkit-scrollbar-thumb]:border-transparent
                [&::-webkit-scrollbar-thumb]:bg-clip-content"
                            title="Document Viewer"
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button variant="outline" onClick={() => setPreviewUrl(null)}>Close Viewer</Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default KYCReviewModal;