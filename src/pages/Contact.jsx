import { useState } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    Clock,
    MessageCircle,
    CheckCircle,
    ArrowLeft,
    Facebook,
    Twitter,
    Instagram,
    Linkedin
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        }, 1500);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            detail: 'hello@agrimeet.com',
            description: 'Send us an email anytime',
            link: 'mailto:hello@agrimeet.com'
        },
        {
            icon: Phone,
            title: 'Call Us',
            detail: '+1 (555) 123-4567',
            description: 'Mon-Fri from 9am to 6pm',
            link: 'tel:+15551234567'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            detail: '123 Farm Lane, AgriTown',
            description: 'Come say hello at our office',
            link: '#'
        }
    ];

    const workingHours = [
        { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
        { day: 'Sunday', hours: 'Closed' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <span className="text-green-100 font-medium">Get In Touch</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6">Contact Us</h1>
                        <p className="text-xl text-green-100 leading-relaxed">
                            Have questions about our marketplace? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <a
                                key={index}
                                href={info.link}
                                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group"
                            >
                                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                                    <Icon className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                                <p className="text-green-600 font-semibold mb-1">{info.detail}</p>
                                <p className="text-sm text-gray-600">{info.description}</p>
                            </a>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">Send us a Message</h2>
                                <p className="text-gray-600">Fill out the form below and our team will get back to you within 24 hours.</p>
                            </div>

                            {submitted && (
                                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="text-green-800 font-medium">Message sent successfully! We'll be in touch soon.</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="seller">Become a Seller</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Working Hours */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Working Hours</h3>
                            </div>
                            <div className="space-y-3">
                                {workingHours.map((schedule, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-sm text-gray-600">{schedule.day}</span>
                                        <span className="text-sm font-semibold text-gray-900">{schedule.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="text-lg font-bold mb-3">Connect With Us</h3>
                            <p className="text-green-100 mb-6 text-sm">
                                Follow us on social media for updates, tips, and community stories.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <a
                                    href="#"
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                    <span className="text-sm font-medium">Facebook</span>
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-colors"
                                >
                                    <Twitter className="w-5 h-5" />
                                    <span className="text-sm font-medium">Twitter</span>
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                    <span className="text-sm font-medium">Instagram</span>
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-colors"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    <span className="text-sm font-medium">LinkedIn</span>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                <Link to="/help" className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-2">
                                    Help Center
                                </Link>
                                <Link to="/faqs" className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-2">
                                    FAQs
                                </Link>
                                <Link to="/privacy" className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-2">
                                    Privacy Policy
                                </Link>
                                <Link to="/terms" className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-2">
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900">Find Us Here</h2>
                            <p className="text-gray-600 mt-1">Visit our office for a tour or a cup of coffee</p>
                        </div>
                        <div className="h-96 bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">Map integration placeholder</p>
                                <p className="text-sm text-gray-500">123 Farm Lane, AgriTown</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;