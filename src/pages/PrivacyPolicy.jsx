import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, FileText } from 'lucide-react';
import { legalApi } from './api/legal.api';

const PrivacyPolicy = () => {
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrivacyPolicy = async () => {
            try {
                setLoading(true);
                const data = await legalApi.getPrivacyPolicy();
                setPolicy(data);
            } catch (error) {
                console.error('Failed to fetch privacy policy:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrivacyPolicy();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!policy) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Privacy Policy Found</h2>
                    <p className="text-gray-600">The privacy policy is currently unavailable.</p>
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
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-green-100 font-medium">Privacy Policy</p>
                            <p className="text-green-200 text-xs">Legal Document</p>
                        </div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">{policy.title}</h1>
                    <div className="flex items-center gap-4 text-green-100">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Last updated: {new Date(policy.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        {/* <span className="text-sm">Version {policy.version}</span> */}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 text-wrap">
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
                                prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: policy.content }}
                        />
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 lg:px-12 py-6 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* <p className="text-sm text-gray-600">
                                Effective Date: {new Date(policy.effective_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p> */}
                            <p className="text-sm text-gray-500">
                                Published on {new Date(policy.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-8 bg-green-50 rounded-2xl p-6 border border-green-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Questions about our Privacy Policy?</h3>
                    <p className="text-gray-600 mb-4">
                        If you have any questions or concerns about how we handle your data, please don't hesitate to contact us.
                    </p>
                    <Link to="/contact" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;