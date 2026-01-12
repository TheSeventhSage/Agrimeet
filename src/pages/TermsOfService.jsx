import { useState, useEffect } from 'react';
import { ArrowLeft, FileCheck, Clock, BookOpen } from 'lucide-react';
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!terms) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Terms of Service Found</h2>
                    <p className="text-gray-600">The terms of service are currently unavailable.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <span className="text-brand-100 font-medium">Terms and Conditions</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">{terms.title}</h1>
                    <div className="flex items-center gap-4 text-brand-100">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Last updated: {new Date(terms.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-">
                    <div className="p-8 lg:p-12">
                        <div
                            className="prose prose-lg max-w-none
                                prose-headings:text-gray-900 prose-headings:font-bold
                                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                                prose-ul:text-gray-600 prose-ul:my-4
                                prose-li:my-2
                                prose-strong:text-gray-900 prose-strong:font-semibold
                                prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline"
                        >
                            {terms.content}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 lg:px-12 py-6 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* <p className="text-sm text-gray-600">
                                Effective Date: {new Date(terms.effective_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p> */}
                            <p className="text-sm text-gray-500">
                                Published on {new Date(terms.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Agreement Notice */}
                <div className="mt-8 bg-brand-50 rounded-2xl p-6 border border-brand-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">By using Agrimeet, you agree to these terms</h3>
                    <p className="text-gray-600 mb-4">
                        These terms constitute a legally binding agreement between you and Agrimeet. If you have any questions about these terms, please contact our support team.
                    </p>
                    <button className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors cursor-pointer">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;