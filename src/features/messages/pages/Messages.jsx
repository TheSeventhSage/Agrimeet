import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import ChatList from '../components/ChatList';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import EmptyChatState from '../components/EmptyChatState';
import { messagesApi } from '../api/messages.api';
import { storageManager } from '../../../pages/utils/storageManager';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState(null);

    // Get current user ID from storage
    const currentUser = storageManager.getUserData();
    const currentUserId = currentUser?.id;

    // Fetch all conversations on mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Fetch messages when a chat is selected
    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);
        }
    }, [selectedChat]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await messagesApi.getConversations();

            // Based on API schema, response structure would be:
            // { data: [...conversations], meta: {...} }
            setConversations(response.data || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            setLoadingMessages(true);
            const response = await messagesApi.getConversationMessages(conversationId);

            // Based on API schema, response structure would be:
            // { data: [...messages] }
            setMessages(response.data || []);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSelectChat = async (conversation) => {
        setSelectedChat(conversation);
        setMessages([]); // Clear previous messages
    };

    const handleSendMessage = async (messageText) => {
        if (!selectedChat || !messageText.trim()) return;

        try {
            const response = await messagesApi.sendMessage(selectedChat.id, {
                message: messageText
            });

            // Add the new message to the list
            if (response.data) {
                setMessages(prev => [...prev, response.data]);
            }

            // Refresh conversations to update last message
            fetchConversations();
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Failed to send message. Please try again.');
        }
    };

    const handleTyping = async (isTyping) => {
        if (!selectedChat) return;

        try {
            await messagesApi.sendTypingIndicator(selectedChat.id, {
                is_typing: isTyping
            });
        } catch (err) {
            console.error('Error sending typing indicator:', err);
        }
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-8rem)]">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                    <p className="text-gray-600 mt-2">Connect with your customers</p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Main Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100%-5rem)]">
                    <div className="flex h-full">
                        {/* Sidebar */}
                        {loading ? (
                            <div className="w-80 border-r border-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
                                    <p className="text-sm text-gray-500 mt-2">Loading conversations...</p>
                                </div>
                            </div>
                        ) : (
                            <ChatList
                                conversations={conversations}
                                selectedChat={selectedChat}
                                onSelectChat={handleSelectChat}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                            />
                        )}

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col">
                            {selectedChat ? (
                                <>
                                    <ChatHeader conversation={selectedChat} />

                                    {loadingMessages ? (
                                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
                                                <p className="text-sm text-gray-500 mt-2">Loading messages...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <MessageList
                                            messages={messages}
                                            currentUserId={currentUserId}
                                        />
                                    )}

                                    <MessageInput
                                        onSendMessage={handleSendMessage}
                                        onTyping={handleTyping}
                                    />
                                </>
                            ) : (
                                <EmptyChatState />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Messages;