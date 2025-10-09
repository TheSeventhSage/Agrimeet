import React, { useState } from 'react';
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
    ArrowLeft
} from 'lucide-react';

const HelpSupport = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All Topics', icon: HelpCircle },
        { id: 'getting-started', name: 'Getting Started', icon: Users },
        { id: 'account', name: 'Account & Profile', icon: Shield },
        { id: 'products', name: 'Products & Listings', icon: Package },
        { id: 'orders', name: 'Orders & Shipping', icon: Truck },
        { id: 'payments', name: 'Payments & Billing', icon: CreditCard },
        { id: 'technical', name: 'Technical Support', icon: FileText }
    ];

    const faqs = [
        {
            id: 1,
            category: 'getting-started',
            question: 'How do I create an account on Agrimeet?',
            answer: 'To create an account, click the "Sign Up" button on the homepage, fill in your details, verify your email, and complete your profile setup. You can choose to register as a buyer or seller.',
            popular: true
        },
        {
            id: 2,
            category: 'products',
            question: 'How do I list my agricultural products?',
            answer: 'Go to the Products section in your dashboard, click "Add Product", fill in the product details including name, description, price, category, and upload images. Make sure to provide accurate information for better visibility.',
            popular: true
        },
        {
            id: 3,
            category: 'orders',
            question: 'How do I track my orders?',
            answer: 'You can track your orders in the Orders section of your dashboard. You\'ll receive email notifications for status updates including order confirmation, shipping, and delivery.',
            popular: false
        },
        {
            id: 4,
            category: 'payments',
            question: 'What payment methods are accepted?',
            answer: 'We accept all major credit cards, bank transfers, mobile money, and digital wallets. All payments are processed securely through our encrypted payment gateway.',
            popular: false
        },
        {
            id: 5,
            category: 'account',
            question: 'How do I verify my seller account?',
            answer: 'To verify your seller account, go to Settings > KYC and upload the required documents including business registration, ID, and bank account details. Verification usually takes 1-2 business days.',
            popular: true
        },
        {
            id: 6,
            category: 'technical',
            question: 'I\'m having trouble uploading product images. What should I do?',
            answer: 'Make sure your images are in JPG, PNG, or GIF format and under 10MB each. Try refreshing the page or clearing your browser cache. If the problem persists, contact our technical support team.',
            popular: false
        },
        {
            id: 7,
            category: 'orders',
            question: 'How do I cancel an order?',
            answer: 'You can cancel an order within 24 hours of placing it if it hasn\'t been shipped yet. Go to your Orders section, find the order, and click "Cancel Order". Refunds are processed within 3-5 business days.',
            popular: false
        },
        {
            id: 8,
            category: 'products',
            question: 'How do I edit or delete my product listings?',
            answer: 'In your Products dashboard, find the product you want to modify and click the three dots menu. Select "Edit" to modify details or "Delete" to remove the listing. Changes are saved immediately.',
            popular: false
        }
    ];

    const contactMethods = [
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Get instant help from our support team',
            availability: 'Available 24/7',
            action: 'Start Chat',
            color: 'bg-brand-500'
        },
        {
            icon: Phone,
            title: 'Phone Support',
            description: 'Speak directly with our support team',
            availability: 'Mon-Fri, 9AM-6PM',
            action: '+1 (555) 123-4567',
            color: 'bg-blue-500'
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Send us a detailed message',
            availability: 'Response within 24 hours',
            action: 'support@agrimeet.com',
            color: 'bg-green-500'
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const popularFaqs = faqs.filter(faq => faq.popular);

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
                        <button
                            onClick={() => window.location.hash = '/login'}
                            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            Sign In
                        </button>
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
                            placeholder="Search for help articles, FAQs, or topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent text-lg"
                        />
                    </div>
                </div>

                {/* Contact Methods */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contactMethods.map((method, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center mb-4`}>
                                    <method.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                                <p className="text-gray-600 mb-3">{method.description}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <Clock className="w-4 h-4" />
                                    {method.availability}
                                </div>
                                <button className="text-brand-600 hover:text-brand-700 font-medium">
                                    {method.action}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular FAQs */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {popularFaqs.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                                <div className="flex items-start gap-3">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current mt-1 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Categories */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                                        ? 'bg-brand-500 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <category.icon className="w-4 h-4" />
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQ List */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name}
                    </h2>
                    <div className="space-y-4">
                        {filteredFaqs.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-gray-900">{faq.question}</h3>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </button>
                                <div className="px-6 pb-4">
                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Still Need Help */}
                <div className="bg-brand-50 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Can't find what you're looking for? Our support team is here to help you with any questions or issues you might have.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                            Contact Support
                        </button>
                        <button className="px-6 py-3 border border-brand-500 text-brand-600 rounded-lg hover:bg-brand-50 transition-colors">
                            Submit Feedback
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;



