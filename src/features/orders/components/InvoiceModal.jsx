// components/InvoiceModal.jsx
import { X, Download, AlertCircle, FileText, ExternalLink } from 'lucide-react';
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
        
        // Cleanup: Revoke URL to prevent memory leaks
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [isOpen, order]);

    const fetchInvoice = async () => {
        setIsLoading(true);
        setError(null);
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);

        try {
            // This returns a Blob now
            const blob = await orderService.downloadInvoice(order.id);
            
            // Create an Object URL for the Blob
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load invoice.");
        } finally {
            setIsLoading(false);
        }
    };

    // const handleDownload = () => {
    //     if (!pdfUrl) return;
        
    //     const link = document.createElement('a');
    //     link.href = pdfUrl;
    //     // Set meaningful filename
    //     const filename = `Invoice-${order.orderNumber || order.order_number || order.id}.pdf`;
    //     link.download = filename;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    // const handleOpenNewTab = () => {
    //     if (!pdfUrl) return;
    //     window.open(pdfUrl, '_blank');
    // };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto margin ml-0 lg:ml-64">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div 
                    className="fixed inset-0 bg-sidebar-200/40 backdrop-blur-sm" 
                    onClick={onClose}
                />

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full h-[85vh] flex flex-col">
                    
                    {/* Header */}
                    <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" />
                            Invoice: {order?.orderNumber || order?.order_number || order?.id}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Body (PDF Viewer) */}
                    <div className="flex-1 bg-gray-50 relative">
                        {isLoading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <LoadingSpinner size="lg" />
                                <p className="mt-4 text-gray-500">Generating Invoice PDF...</p>
                            </div>
                        ) : error ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                                <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                                <p className="text-gray-900 font-medium mb-1">Unavailable</p>
                                <p className="text-gray-500 text-sm mb-4 text-center">{error}</p>
                                <Button onClick={fetchInvoice} variant="outline" size="sm">Retry</Button>
                            </div>
                        ) : pdfUrl ? (
                            <iframe 
                                src={pdfUrl} 
                                className="w-full h-screen"
                                title="Invoice PDF"
                            />
                        ) : null}
                    </div>

                    {/* Footer */}
                    {/* <div className="bg-white px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row-reverse gap-2 sm:gap-3">
                        <Button 
                            onClick={handleDownload} 
                            disabled={!pdfUrl || isLoading}
                            className="w-full sm:w-auto"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={handleOpenNewTab}
                            disabled={!pdfUrl || isLoading}
                            className="w-full sm:w-auto"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open in New Tab
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={onClose}
                            className="w-full sm:w-auto sm:mr-auto"
                        >
                            Close
                        </Button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;