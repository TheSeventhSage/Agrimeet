import { useState, useEffect } from 'react';
import { legalApi } from './api/legal.api';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQsPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                setLoading(true);
                const data = await legalApi.getFaqs();
                setFaqs(data);
            } catch (error) {
                console.error('Failed to fetch FAQs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFAQs();
    }, []);

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFaq = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
            <div className="bg-gradient-to-br from-sidebar-600 to-sidebar-700 text-white py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <span className="text-sidebar-100 font-medium">Help Center</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-sidebar-100">Find answers to common questions about Agrimeet</p>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-sidebar-500 focus:border-transparent text-lg"
                    />
                </div>
            </div>

            {/* FAQs Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filteredFaqs.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                        <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No FAQs Found</h3>
                        <p className="text-gray-600">
                            {searchQuery ? `No results found for "${searchQuery}"` : 'No FAQs are currently available.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{filteredFaqs.length}</span> {filteredFaqs.length === 1 ? 'question' : 'questions'}
                            </p>
                        </div>

                        {filteredFaqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-8 h-8 bg-sidebar-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                            <HelpCircle className="w-5 h-5 text-sidebar-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                                    </div>
                                    <div className="shrink-0">
                                        {expandedId === faq.id ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </button>

                                {expandedId === faq.id && (
                                    <div className="px-6 pb-6 pt-2">
                                        <div className="pl-11">
                                            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                {faq.answer}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-xs text-gray-500">
                                                    Last updated: {new Date(faq.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Contact Section */}
                <div className="mt-12 bg-gradient-to-br from-sidebar-50 to-sidebar-100 rounded-2xl p-8 border border-sidebar-200">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Can't find the answer you're looking for? Our support team is ready to help you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contact" className="bg-sidebar-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-sidebar-700 transition-colors">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQsPage;