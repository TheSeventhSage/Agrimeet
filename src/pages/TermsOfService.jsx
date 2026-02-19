import { useState, useEffect } from 'react';
import { ArrowLeft, FileCheck, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { legalApi } from './api/legal.api';

const TermsOfService = () => {
    const [terms, setTerms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTermsOfService = async () => {
            try {
                setLoading(true);
                const data = await legalApi.getTermsOfService();
                setTerms(data);
            } catch (error) {
                console.error('Failed to fetch terms of service:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTermsOfService();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-brand-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-500 font-medium">Loading document...</p>
            </div>
        );
    }

    if (!terms) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms Not Found</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">We couldn't load the terms of service at this time. Please try again later.</p>
                    <Link to="/" className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-brand-100 selection:text-brand-900 pb-24">
            {/* Elegant Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center relative">
                    <div className="absolute top-8 left-4 sm:left-6 lg:left-8">
                        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition-all border border-gray-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Link>
                    </div>

                    <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-6 shadow-sm border border-brand-100">
                        <FileCheck className="w-8 h-8 text-brand-600" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Please read these terms carefully before using our services to understand your rights and responsibilities.
                    </p>
                </div>
            </div>

            {/* Document Body */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-200 overflow-hidden">
                    <div className="p-8 sm:p-12 lg:p-16">
                        <div
                            className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed prose-a:text-brand-600 hover:prose-a:text-brand-700 prose-li:marker:text-brand-500"
                            dangerouslySetInnerHTML={{ __html: terms.content }}
                        />
                    </div>

                    {/* Document Footer */}
                    <div className="bg-gray-50 border-t border-gray-100 p-8 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center text-gray-500 text-sm font-medium bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                            <Clock className="w-4 h-4 mr-2 text-brand-600" />
                            Published on {new Date(terms.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Agreement Notice Box */}
                <div className="mt-8 bg-gradient-to-r from-brand-50 to-blue-50 rounded-3xl p-8 sm:p-10 border border-brand-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">By using Agrimeet, you agree to these terms</h3>
                        <p className="text-brand-800/80 max-w-xl leading-relaxed">
                            These terms constitute a legally binding agreement between you and Agrimeet. If you have any questions about these terms, please contact our support team.
                        </p>
                    </div>
                    <Link to="/contact" className="whitespace-nowrap bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;  