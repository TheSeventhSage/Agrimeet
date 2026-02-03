import { useState } from 'react';
import { X, Phone, Mail, MessageCircle, Copy, Check, Headset } from 'lucide-react';
import Button from '../../shared/components/Button';

export default function ContactSupportModal({ isOpen, onClose }) {
    const [copied, setCopied] = useState(false);

    // --- SUPPORT DETAILS ---
    const SUPPORT_PHONE = "+2348123456789";
    const SUPPORT_WHATSAPP = "2348123456789";
    const SUPPORT_EMAIL = "support@agrimeetconnect.com";

    if (!isOpen) return null;

    const handleCopy = (e) => {
        e.stopPropagation(); // Prevent triggering the call link
        navigator.clipboard.writeText(SUPPORT_PHONE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 p-0">

                {/* Header */}
                <div className="bg-gradient-to-br from-brand-900 to-brand-800 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Headset size={100} />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                Contact Support
                            </h2>
                            <p className="text-gray-300 text-sm mt-1">We are here to help you 24/7.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-4">

                    {/* 1. Phone Call */}
                    <div className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <a href={`tel:${SUPPORT_PHONE}`} className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Call Us</p>
                                <p className="text-gray-900 font-semibold truncate group-hover:text-blue-600 transition-colors">
                                    {SUPPORT_PHONE}
                                </p>
                            </a>
                            <button
                                onClick={handleCopy}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Copy Number"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* 2. WhatsApp */}
                    <a
                        href={`https://wa.me/${SUPPORT_WHATSAPP}?text=Hello%20Agrimeet,%20I%20need%20help%20with%20registration.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">WhatsApp</p>
                                <p className="text-gray-900 font-semibold group-hover:text-green-600 transition-colors">Chat on WhatsApp</p>
                            </div>
                        </div>
                    </a>

                    {/* 3. Email */}
                    <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Send Email</p>
                                <p className="text-gray-900 font-semibold truncate group-hover:text-orange-600 transition-colors">
                                    {SUPPORT_EMAIL}
                                </p>
                            </div>
                        </div>
                    </a>

                </div>

                {/* Footer */}
                <div className=" bg-gray-50 text-center border-t border-gray-100">
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="w-full h-16 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors "
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}