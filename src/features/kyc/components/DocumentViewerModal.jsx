import { X } from 'lucide-react';
import Button from '../../../shared/components/Button'; // Assuming Button path

const DocumentViewerModal = ({ isOpen, onClose, documentUrl, title = 'View Document' }) => {
    if (!isOpen) return null;

    // Function to determine how to render the file
    const renderDocument = () => {
        if (!documentUrl) {
            return <p className="text-gray-600">No document URL provided.</p>;
        }

        // Get file extension
        const extension = documentUrl.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
            // Render as image
            return (
                <img
                    src={documentUrl}
                    alt={title}
                    className="w-full h-full object-contain"
                />
            );
        }

        if (extension === 'pdf') {
            // Render as embedded PDF
            // Using <embed> for broad compatibility
            return (
                <embed
                    src={documentUrl}
                    type="application/pdf"
                    className="w-full h-full"
                />
            );
        }

        // Fallback for other file types
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
                <p className="text-gray-700 mb-4 text-lg">
                    This file type (.{extension}) cannot be previewed directly.
                </p>
                <Button
                    as="a"
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Download Document
                </Button>
            </div>
        );
    };

    return (
        // Modal Overlay
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,.8)] transition-opacity"
            onClick={onClose}
        >
            {/* Modal Content */}
            <div
                className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col overflow-hidden m-8"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body - takes remaining height */}
                <div className="flex-1 h-full overflow-y-auto bg-[rgba(0,0,0,.95)]">
                    {renderDocument()}
                </div>
            </div>
        </div>
    );
};

export default DocumentViewerModal;