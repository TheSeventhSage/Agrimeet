import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    MessageCircle,
    Phone,
    Mail,
    Clock,
    ChevronRight,
    HelpCircle,
    FileText,
    Users,
    Shield,
    CreditCard,
    Truck,
    Package,
    Star,
    ArrowLeft,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { legalApi } from './api/legal.api';
import { contactDetails } from '../shared/utils/contact';

const HelpSupport = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                setLoading(true);
                const data = await legalApi.getFaqs();
                setFaqs(data || []);
            } catch (error) {
                console.error('Failed to fetch FAQs:', error);
                setFaqs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFAQs();
    }, []);

    const contactMethods = [
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Get instant help from our support team',
            availability: 'Available 24/7',
            action: `https://wa.me/${contactDetails.whatsAppNumber.replace(/\D/g, '')}`,
            content: `Chat on WhatsApp: ${contactDetails.whatsAppNumber}`,
            color: 'bg-green-500'
        },
        {
            icon: Phone,
            title: 'Phone Support',
            description: 'Speak directly with our support team',
            availability: 'Mon-Fri, 9AM-6PM',
            action: `tel:${contactDetails.phoneNumber}`,
            content: `Call on: ${contactDetails.phoneNumber}`,
            color: 'bg-blue-500'
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Send us a detailed message',
            availability: 'Response within 24 hours',
            action: `mailto:${contactDetails.email}`,
            content: `Email us at: ${contactDetails.email}`,
            color: 'bg-purple-500'
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFaq = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
                        </div>
                        <Link to="/contact"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Section */}
                <div className="mb-8">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for help FAQs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                        />
                    </div>
                </div>

                {/* Contact Methods */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contactMethods.map((method, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center mb-4`}>
                                    <method.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                                <p className="text-gray-600 mb-3">{method.description}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <Clock className="w-4 h-4" />
                                    {method.availability}
                                </div>
                                <a href={`${method.action}`} className="text-green-600 hover:text-green-700 font-medium">
                                    {method.content}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQs Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                        {filteredFaqs.length > 0 && (
                            <span className="text-sm text-gray-600">
                                {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                        </div>
                    ) : filteredFaqs.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs Found</h3>
                            <p className="text-gray-600">
                                {searchQuery ? `No results found for "${searchQuery}"` : 'No FAQs are currently available.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFaqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                                <HelpCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                                <h3 className="font-medium text-gray-900">{faq.question}</h3>
                                            </div>
                                            {expandedId === faq.id ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                    {expandedId === faq.id && (
                                        <div className="px-6 pb-4 pt-2">
                                            <div className="pl-8">
                                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                                                <p className="text-xs text-gray-500 mt-3">
                                                    Last updated: {new Date(faq.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Still Need Help */}
                <div className="bg-green-50 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Can't find what you're looking for? Our support team is here to help you with any questions or issues you might have.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/contact" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Contact Support
                        </Link>
                        {/* <button className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                            Submit Feedback
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;