import { X, Download, AlertCircle, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '../../../shared/components/Button';
import { LoadingSpinner } from '../../../shared/components/Loader';
import { orderService } from '../api/orderService';

const InvoiceModal = ({ isOpen, onClose, order }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && order) {
            fetchInvoice();
        }

        // Cleanup function to revoke object URL when component unmounts or modal closes
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [isOpen, order]);

    const fetchInvoice = async () => {
        setIsLoading(true);
        setError(null);
        // Clear previous URL to avoid showing old invoice while loading new one
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);

        try {
            const blob = await orderService.downloadInvoice(order.id);
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load invoice. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!pdfUrl) return;

        const link = document.createElement('a');
        link.href = pdfUrl;
        // Use order number for filename if available, else ID
        const filename = `Invoice-${order.orderNumber || order.id}.pdf`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Modal Content */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">

                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2" id="modal-title">
                            <FileText className="w-5 h-5 text-gray-500" />
                            Invoice: {order?.orderNumber || order?.id}
                        </h3>
                        <button
                            onClick={onClose}
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="bg-gray-50 p-4 sm:p-6 h-[70vh] flex flex-col items-center justify-center">
                        {isLoading ? (
                            <div className="text-center">
                                <LoadingSpinner size="lg" />
                                <p className="mt-4 text-gray-500">Generating PDF Invoice...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center max-w-md">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Unavailable</h3>
                                <p className="text-gray-500 mb-6">{error}</p>
                                <Button onClick={fetchInvoice} variant="outline">
                                    Try Again
                                </Button>
                            </div>
                        ) : pdfUrl ? (
                            <iframe
                                src={pdfUrl}
                                className="w-full h-full rounded-lg shadow-sm border border-gray-200 bg-white"
                                title="Invoice Preview"
                            />
                        ) : null}
                    </div>

                    {/* Footer */}
                    <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                        <Button
                            onClick={handleDownload}
                            disabled={!pdfUrl || isLoading}
                            className="w-full sm:w-auto sm:ml-3"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="mt-3 sm:mt-0 w-full sm:w-auto"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;