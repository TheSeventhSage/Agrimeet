import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    MessageSquare,
    Star,
    Send,
    Search,
    MoreVertical,
    Phone,
    Video,
    Paperclip,
    Smile,
    Image as ImageIcon,
    Check,
    CheckCheck,
    Clock,
    Filter,
    X,
    Package,
    User
} from 'lucide-react';

const Messages = () => {
    const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'reviews'
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    // Mock data - replace with API calls
    const chats = [
        {
            id: 1,
            name: 'John Doe',
            avatar: null,
            lastMessage: 'Is this product still available?',
            timestamp: '2 min ago',
            unread: 3,
            online: true,
            productId: 1,
            productName: 'Fresh Organic Tomatoes'
        },
        {
            id: 2,
            name: 'Sarah Smith',
            avatar: null,
            lastMessage: 'Thank you for the quick delivery!',
            timestamp: '1 hour ago',
            unread: 0,
            online: false,
            productId: 2,
            productName: 'Premium Rice - 50kg'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            avatar: null,
            lastMessage: 'Can I get a bulk discount?',
            timestamp: '3 hours ago',
            unread: 1,
            online: true,
            productId: 3,
            productName: 'Sweet Corn'
        },
        {
            id: 4,
            name: 'Emily Davis',
            avatar: null,
            lastMessage: 'When will the next batch arrive?',
            timestamp: 'Yesterday',
            unread: 0,
            online: false,
            productId: 1,
            productName: 'Fresh Organic Tomatoes'
        }
    ];

    const messages = [
        {
            id: 1,
            senderId: 1,
            text: 'Hi! Is this product still available?',
            timestamp: '10:30 AM',
            status: 'read'
        },
        {
            id: 2,
            senderId: 'me',
            text: 'Yes, we have it in stock. How many kg do you need?',
            timestamp: '10:32 AM',
            status: 'read'
        },
        {
            id: 3,
            senderId: 1,
            text: 'I need about 50kg. What\'s your best price?',
            timestamp: '10:35 AM',
            status: 'read'
        },
        {
            id: 4,
            senderId: 'me',
            text: 'For 50kg, I can offer you $120 with free delivery within the city.',
            timestamp: '10:36 AM',
            status: 'delivered'
        }
    ];

    const reviews = [
        {
            id: 1,
            userName: 'Alice Brown',
            userAvatar: null,
            rating: 5,
            comment: 'Excellent quality! The tomatoes were fresh and arrived on time. Will definitely order again.',
            productName: 'Fresh Organic Tomatoes',
            timestamp: '2 days ago',
            images: []
        },
        {
            id: 2,
            userName: 'Robert Wilson',
            userAvatar: null,
            rating: 4,
            comment: 'Good product overall. The rice quality is great but packaging could be better.',
            productName: 'Premium Rice - 50kg',
            timestamp: '5 days ago',
            images: []
        },
        {
            id: 3,
            userName: 'Lisa Anderson',
            userAvatar: null,
            rating: 5,
            comment: 'Best seller! Fast delivery, great communication, and top-quality products. Highly recommended!',
            productName: 'Sweet Corn',
            timestamp: '1 week ago',
            images: []
        },
        {
            id: 4,
            userName: 'David Martinez',
            userAvatar: null,
            rating: 3,
            comment: 'Product is okay but delivery was delayed by 2 days. Seller was responsive though.',
            productName: 'Fresh Organic Tomatoes',
            timestamp: '2 weeks ago',
            images: []
        }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageText.trim()) {
            // Add API call here
            console.log('Sending message:', messageText);
            setMessageText('');
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-8rem)]">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Messages & Reviews</h1>
                    <p className="text-gray-600 mt-2">Connect with your customers</p>
                </div>

                {/* Main Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100%-5rem)]">
                    <div className="flex h-full">
                        {/* Sidebar */}
                        <div className="w-80 border-r border-gray-200 flex flex-col">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-200 bg-gray-50">
                                <button
                                    onClick={() => setActiveTab('chats')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'chats'
                                            ? 'text-brand-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <MessageSquare className="w-4 h-4 inline-block mr-2" />
                                    Chats
                                    {activeTab === 'chats' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'reviews'
                                            ? 'text-brand-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <Star className="w-4 h-4 inline-block mr-2" />
                                    Reviews
                                    {activeTab === 'reviews' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600"></div>
                                    )}
                                </button>
                            </div>

                            {/* Search */}
                            {activeTab === 'chats' && (
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search conversations..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* List */}
                            <div className="flex-1 overflow-y-auto">
                                {activeTab === 'chats' ? (
                                    // Chats List
                                    <div className="divide-y divide-gray-100">
                                        {filteredChats.map((chat) => (
                                            <button
                                                key={chat.id}
                                                onClick={() => setSelectedChat(chat)}
                                                className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${selectedChat?.id === chat.id ? 'bg-brand-50' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold">
                                                            {getInitials(chat.name)}
                                                        </div>
                                                        {chat.online && (
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                                {chat.name}
                                                            </h3>
                                                            <span className="text-xs text-gray-500">{chat.timestamp}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 truncate mb-1">
                                                            {chat.lastMessage}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500 truncate flex items-center gap-1">
                                                                <Package className="w-3 h-3" />
                                                                {chat.productName}
                                                            </span>
                                                            {chat.unread > 0 && (
                                                                <span className="bg-brand-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                                                    {chat.unread}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    // Reviews List
                                    <div className="divide-y divide-gray-100">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                        {getInitials(review.userName)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h3 className="font-semibold text-gray-900 text-sm">
                                                                {review.userName}
                                                            </h3>
                                                            <span className="text-xs text-gray-500">{review.timestamp}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 mb-2">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                            {review.comment}
                                                        </p>
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Package className="w-3 h-3" />
                                                            {review.productName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col">
                            {activeTab === 'chats' ? (
                                selectedChat ? (
                                    <>
                                        {/* Chat Header */}
                                        <div className="p-4 border-b border-gray-200 bg-white">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold">
                                                            {getInitials(selectedChat.name)}
                                                        </div>
                                                        {selectedChat.online && (
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className={`${selectedChat.online ? 'text-green-600' : 'text-gray-500'}`}>
                                                                {selectedChat.online ? 'Online' : 'Offline'}
                                                            </span>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="text-gray-500">{selectedChat.productName}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <Phone className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <Video className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                            <div className="space-y-4">
                                                {messages.map((message) => (
                                                    <div
                                                        key={message.id}
                                                        className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div
                                                            className={`max-w-md ${message.senderId === 'me'
                                                                    ? 'bg-brand-500 text-white'
                                                                    : 'bg-white text-gray-900 border border-gray-200'
                                                                } rounded-2xl px-4 py-2.5 shadow-sm`}
                                                        >
                                                            <p className="text-sm">{message.text}</p>
                                                            <div className={`flex items-center justify-end gap-1 mt-1 ${message.senderId === 'me' ? 'text-white/70' : 'text-gray-500'
                                                                }`}>
                                                                <span className="text-xs">{message.timestamp}</span>
                                                                {message.senderId === 'me' && (
                                                                    message.status === 'read' ? (
                                                                        <CheckCheck className="w-3 h-3" />
                                                                    ) : message.status === 'delivered' ? (
                                                                        <CheckCheck className="w-3 h-3" />
                                                                    ) : (
                                                                        <Check className="w-3 h-3" />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        </div>

                                        {/* Message Input */}
                                        <div className="p-4 border-t border-gray-200 bg-white">
                                            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                                                <button
                                                    type="button"
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Paperclip className="w-5 h-5 text-gray-600" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <ImageIcon className="w-5 h-5 text-gray-600" />
                                                </button>
                                                <div className="flex-1 relative">
                                                    <textarea
                                                        value={messageText}
                                                        onChange={(e) => setMessageText(e.target.value)}
                                                        placeholder="Type your message..."
                                                        rows="1"
                                                        className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleSendMessage(e);
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 bottom-2.5 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Smile className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={!messageText.trim()}
                                                    className="p-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Send className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    </>
                                ) : (
                                    // Empty State
                                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                                        <div className="text-center">
                                            <div className="w-24 h-24 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <MessageSquare className="w-12 h-12 text-brand-600" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                Select a conversation
                                            </h3>
                                            <p className="text-gray-600">
                                                Choose a chat from the list to start messaging
                                            </p>
                                        </div>
                                    </div>
                                )
                            ) : (
                                // Reviews Detail View
                                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                    <div className="max-w-4xl mx-auto space-y-6">
                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-4 mb-8">
                                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Average Rating</p>
                                                        <p className="text-3xl font-bold text-gray-900 mt-1">4.5</p>
                                                    </div>
                                                    <div className="flex items-center gap-0.5">
                                                        {renderStars(5)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                                <div>
                                                    <p className="text-sm text-gray-600">Total Reviews</p>
                                                    <p className="text-3xl font-bold text-gray-900 mt-1">124</p>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                                <div>
                                                    <p className="text-sm text-gray-600">Response Rate</p>
                                                    <p className="text-3xl font-bold text-green-600 mt-1">98%</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reviews List */}
                                        {reviews.map((review) => (
                                            <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                            {getInitials(review.userName)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="flex items-center gap-0.5">
                                                                    {renderStars(review.rating)}
                                                                </div>
                                                                <span className="text-sm text-gray-500">{review.timestamp}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <MoreVertical className="w-5 h-5 text-gray-400" />
                                                    </button>
                                                </div>

                                                <p className="text-gray-700 mb-3">{review.comment}</p>

                                                <div className="flex items-center gap-2 text-sm">
                                                    <Package className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">{review.productName}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Messages;