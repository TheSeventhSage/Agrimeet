import { X, CheckCircle, Upload, ShieldCheck, Store, ArrowRight, FileText } from 'lucide-react';
import Button from '../../shared/components/Button';

export default function KycGuideModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-auto transform transition-all animate-in h-full duration-200 border border-gray-100">

                {/* Header */}
                <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <FileText size={120} />
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full border border-green-200 mb-3 backdrop-blur-sm">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Verification Guide</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Registration Guide
                            </h2>
                            <p className="text-gray-600 mt-1 text-sm">Follow these steps to complete your profile correctly.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/50 hover:bg-white rounded-full text-gray-500 hover:text-gray-700 transition-colors shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">

                    {/* Step 1 - Updated Content */}
                    <div className="flex flex-col md:flex-row gap-5 group">
                        <div className="flex-shrink-0 relative">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-200 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                1
                            </div>
                            <div className="absolute top-12 left-6 w-0.5 h-16 bg-blue-100 -z-10"></div>
                        </div>
                        <div className="pb-2">
                            <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                                Business & Location Details
                                <Store className="w-4 h-4 text-blue-400" />
                            </h3>
                            <div className="text-gray-500 text-sm mt-2 leading-relaxed space-y-2">
                                <p>Provide your Store Name and Description.</p>
                                <p className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800">
                                    <strong>Technical Tip:</strong> For the <strong>Business Address</strong> and <strong>Bank Name</strong>, please type and <span className="underline decoration-blue-300 decoration-2">wait for the dropdown list</span> to appear, then select the correct option. Do not just type the text without selecting.
                                </p>
                            </div>
                            <div className="mt-3 flex gap-3 text-xs">
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded border border-gray-200">Store Name</span>
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded border border-gray-200">Select Address</span>
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded border border-gray-200">Select Bank</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 - Kept as requested */}
                    <div className="flex flex-col md:flex-row gap-5 group">
                        <div className="flex-shrink-0 relative">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg border border-purple-200 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                2
                            </div>
                            <div className="absolute top-12 left-6 w-0.5 h-16 bg-purple-100 -z-10"></div>
                        </div>
                        <div className="pb-2">
                            <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                                Document Uploads
                                <Upload className="w-4 h-4 text-purple-400" />
                            </h3>
                            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                                Upload clear, legible copies of your documents. Supports JPG, PNG, or PDF (Max 5MB).
                            </p>
                            <div className="mt-3 grid md:grid-cols-2 gap-3">
                                <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 hover:bg-white hover:border-purple-300 transition-colors">
                                    <div className="text-xs font-medium text-gray-700">Valid ID</div>
                                    <div className="text-[10px] text-gray-400">NIN / Voters Card / Passport</div>
                                </div>
                                <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 hover:bg-white hover:border-purple-300 transition-colors">
                                    <div className="text-xs font-medium text-gray-700">Business Cover</div>
                                    <div className="text-[10px] text-gray-400">Photo of your shop/logo</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 - Kept as requested */}
                    <div className="flex flex-col md:flex-row gap-5 group">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg border border-amber-200 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                3
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                                Review & Approval
                                <CheckCircle className="w-4 h-4 text-amber-400" />
                            </h3>
                            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                                Our compliance team will review your submission within 24-48 hours. You'll receive an email update once approved.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Close
                    </Button>
                    <Button onClick={onClose} className="flex items-center gap-2 px-6 shadow-md shadow-brand-200">
                        Got it, Let's Start
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}