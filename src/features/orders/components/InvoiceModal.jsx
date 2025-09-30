// components/InvoiceModal.jsx
import { X, Printer, Download, Mail } from 'lucide-react';
import { useRef } from 'react';
import Button from '../../../shared/components/Button';
import LoadingSpinner from '../../../shared/components/Loading';

const InvoiceModal = ({ isOpen, onClose, order, isLoading }) => {
    const printRef = useRef();

    if (!isOpen) return null;

    const formatCurrency = (amount) => {
        return `₦${amount.toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        const printWindow = window.open('', '', 'height=800,width=800');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice ${order?.orderNumber}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                        .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                        .invoice-title { font-size: 20px; color: #666; }
                        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
                        .info-section { width: 48%; }
                        .info-section h4 { margin-bottom: 10px; font-size: 14px; font-weight: bold; text-transform: uppercase; color: #333; }
                        .info-section p { margin: 5px 0; font-size: 14px; }
                        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        .items-table th { background-color: #f8f9fa; font-weight: bold; }
                        .total-section { width: 300px; margin-left: auto; }
                        .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
                        .total-row.final { border-top: 2px solid #333; font-weight: bold; font-size: 16px; }
                        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const handleDownloadPDF = () => {
        // In a real application, you would generate a proper PDF here
        // For demo purposes, we'll just trigger the print dialog
        handlePrint();
    };

    const handleEmailInvoice = () => {
        // In a real application, you would send the invoice via email
        const subject = encodeURIComponent(`Invoice ${order?.orderNumber}`);
        const body = encodeURIComponent(`Please find attached the invoice for your order ${order?.orderNumber}.`);
        const mailtoLink = `mailto:${order?.customer.email}?subject=${subject}&body=${body}`;

        window.open(mailtoLink);
    };

    if (isLoading || !order) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Generating invoice...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Invoice {order.orderNumber}</h2>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handleEmailInvoice}>
                            <Mail className="w-4 h-4 mr-1" />
                            Email
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                            <Download className="w-4 h-4 mr-1" />
                            Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-1" />
                            Print
                        </Button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div ref={printRef} className="max-w-none">
                        {/* Invoice Header */}
                        <div className="invoice-header text-center mb-8 pb-6 border-b-2 border-gray-800">
                            <div className="company-name text-2xl font-bold mb-2 text-gray-900">
                                Your Company Name
                            </div>
                            <div className="text-gray-600 mb-4">
                                123 Business Street, Lagos, Nigeria<br />
                                Phone: +234 123 456 7890 | Email: info@yourcompany.com
                            </div>
                            <div className="invoice-title text-xl text-gray-700 font-semibold">
                                INVOICE
                            </div>
                        </div>

                        {/* Invoice Info */}
                        <div className="invoice-info grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="info-section">
                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">Bill To:</h4>
                                <div className="text-gray-700">
                                    <p className="font-semibold text-gray-900">{order.customer.name}</p>
                                    <p>{order.customer.email}</p>
                                    <p>{order.customer.phone}</p>
                                    <div className="mt-3">
                                        <p className="font-medium text-gray-800">Shipping Address:</p>
                                        <p>{order.shippingAddress.street}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                        <p>{order.shippingAddress.zipCode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">Invoice Number:</h4>
                                        <p className="text-lg font-mono text-gray-900">{order.orderNumber}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">Invoice Date:</h4>
                                        <p className="text-gray-700">{formatDate(new Date())}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">Order Date:</h4>
                                        <p className="text-gray-700">{formatDate(order.orderDate)}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">Payment Status:</h4>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${order.paymentStatus === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                    {order.trackingNumber && (
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">Tracking Number:</h4>
                                            <p className="text-gray-700 font-mono">{order.trackingNumber}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8">
                            <table className="items-table w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 p-3 text-left font-bold text-gray-800">Description</th>
                                        <th className="border border-gray-300 p-3 text-center font-bold text-gray-800">Quantity</th>
                                        <th className="border border-gray-300 p-3 text-right font-bold text-gray-800">Unit Price</th>
                                        <th className="border border-gray-300 p-3 text-right font-bold text-gray-800">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border border-gray-300 p-3 text-gray-900">
                                                <div className="font-medium">{item.name}</div>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center text-gray-700">
                                                {item.quantity}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-right text-gray-700">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-right font-medium text-gray-900">
                                                {formatCurrency(item.price * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Total Section */}
                        <div className="total-section ml-auto max-w-sm">
                            <div className="space-y-2">
                                <div className="total-row flex justify-between py-2 text-gray-700">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="total-row flex justify-between py-2 text-gray-700">
                                    <span>Tax:</span>
                                    <span>{formatCurrency(order.tax)}</span>
                                </div>
                                <div className="total-row flex justify-between py-2 text-gray-700">
                                    <span>Shipping:</span>
                                    <span>{formatCurrency(order.shipping)}</span>
                                </div>
                                <div className="total-row final flex justify-between py-3 border-t-2 border-gray-800 text-lg font-bold text-gray-900">
                                    <span>Total:</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-bold text-gray-800 mb-2">Payment Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                <div>
                                    <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                                </div>
                                <div>
                                    <span className="font-medium">Payment Status:</span>
                                    <span className={`ml-2 ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-bold text-gray-800 mb-2">Order Notes</h4>
                                <p className="text-gray-700 text-sm">{order.notes}</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="footer text-center mt-12 pt-6 border-t border-gray-300 text-sm text-gray-600">
                            <p className="mb-2">Thank you for your business!</p>
                            <p>For questions about this invoice, contact us at support@yourcompany.com or +234 123 456 7890</p>
                            <div className="mt-4 text-xs">
                                <p>This invoice was generated electronically and is valid without signature.</p>
                                <p>Generated on {formatDate(new Date())}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;