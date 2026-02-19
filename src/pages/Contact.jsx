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
import { contactDetails } from '../shared/utils/contact';

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

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-green-100 selection:text-green-900">
            {/* Header / Hero Section */}
            <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link to="/" className="inline-flex items-center text-green-100 hover:text-white transition-colors mb-8 group bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="max-w-3xl">
                        <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight">
                            Get in Touch
                        </h1>
                        <p className="text-lg lg:text-xl text-green-100 font-light leading-relaxed max-w-2xl">
                            Have questions about our platform or need assistance? Our team is here to help you grow.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 lg:-mt-16 pb-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="h-fit lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 lg:p-12">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Send us a message</h2>
                            <p className="text-gray-500 mt-2">Fill out the form below and we'll get back to you as soon as possible.</p>
                        </div>

                        {submitted ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-600">Thank you for reaching out. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Phone Number (Optional)</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all outline-none"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all outline-none"
                                            placeholder="How can we help?"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all outline-none resize-none"
                                        placeholder="Write your message here..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:ring-4 focus:ring-green-100 transition-all flex items-center justify-center font-semibold disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Information Sidebar */}
                    <div className="space-y-6">
                        {/* Support Info Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                                Contact Information
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                                            <Mail className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Email Us</p>
                                        <a href={`mailto:${contactDetails.email}`} className="text-green-600 hover:text-green-700 transition-colors text-sm font-medium mt-1 inline-block">
                                            {contactDetails.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                                            <Phone className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Call Us</p>
                                        <a href={`tel:${contactDetails.phoneNumber}`} className="text-green-600 hover:text-green-700 transition-colors text-sm font-medium mt-1 inline-block">
                                            {contactDetails.phoneNumber}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                                            <MapPin className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Visit Us</p>
                                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                                            {contactDetails.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-green-600" />
                                Business Hours
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-gray-600 font-medium">Monday - Friday</span>
                                    <span className="text-gray-900 font-semibold">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-gray-600 font-medium">Saturday</span>
                                    <span className="text-gray-900 font-semibold">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600 font-medium">Sunday</span>
                                    <span className="text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-md text-xs">Closed</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Links Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Us</h3>
                            <div className="flex gap-4">
                                {[
                                    { icon: Facebook, bg: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200' },
                                    { icon: Twitter, bg: 'hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200' },
                                    { icon: Instagram, bg: 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200' },
                                    { icon: Linkedin, bg: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200' }
                                ].map((social, index) => (
                                    <a key={index} href="#" className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 transition-all duration-300 ${social.bg}`}>
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <Link to="/faq" className="block text-sm font-medium text-gray-600 hover:text-green-600 transition-colors py-2 flex items-center">
                                    <ArrowLeft className="w-4 h-4 mr-2 rotate-180" /> Visit Help Center
                                </Link>
                                <Link to="/terms" className="block text-sm font-medium text-gray-600 hover:text-green-600 transition-colors py-2 flex items-center">
                                    <ArrowLeft className="w-4 h-4 mr-2 rotate-180" /> Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;