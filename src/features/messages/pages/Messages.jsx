// components/Messages.jsx
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react'; // Added Menu icon for mobile toggle
import DashboardLayout from '../../../layouts/DashboardLayout';
import ChatList from '../components/ChatList';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import EmptyChatState from '../components/EmptyChatState';
import { messagesApi } from '../api/messages.api';
import { storageManager } from '../../../shared/utils/storageManager';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for mobile drawer

    // Get current user ID from storage
    const currentUser = storageManager.getUserData();
    const currentUserId = currentUser?.data?.id;

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
            const response = await messagesApi.getConversations();
            console.log(response);
            setConversations(response || []);
            console.log(conversations);
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
            setError('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            setLoadingMessages(true);
            const response = await messagesApi.getMessages(chatId);
            setMessages(response.data || []);

            // --- REQUIREMENT 1: Update unread count locally on load ---
            // This ensures the red circle disappears immediately without refetching all conversations
            setConversations(prevConversations =>
                prevConversations.map(conv =>
                    conv.id === chatId
                        ? { ...conv, unread_count: 0 }
                        : conv
                )
            );
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (content, file) => {
        if (!selectedChat) return;

        try {
            const formData = new FormData();
            formData.append('conversation_id', selectedChat.id);
            formData.append('message', content);
            if (file) {
                formData.append('attachment', file);
            }

            const response = await messagesApi.sendMessage(formData);

            // Append new message locally
            setMessages([...messages, response.data]);

            // Update last message in conversation list
            setConversations(prev => prev.map(conv => {
                if (conv.id === selectedChat.id) {
                    return {
                        ...conv,
                        last_message: response.data,
                        updated_at: new Date().toISOString()
                    };
                }
                return conv;
            }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));

        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        setIsSidebarOpen(false); // Close mobile drawer when chat is selected
    };

    const handleTyping = () => {
        // Implement typing indicator logic if needed
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-theme(spacing.24))] -m-6 md:m-0">
                <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex relative">

                    {/* Chat List - Now acts as a drawer on mobile */}
                    <ChatList
                        conversations={conversations}
                        selectedChat={selectedChat}
                        onSelectChat={handleSelectChat}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white">
                        {/* Mobile Toggle Button Header */}
                        <div className="md:hidden flex items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <span className="font-semibold text-gray-700">
                                {selectedChat ? (selectedChat.context_details?.name || 'Chat') : 'Messages'}
                            </span>
                        </div>

                        {selectedChat ? (
                            <>
                                <ChatHeader
                                    conversation={selectedChat}
                                    currentUserId={currentUserId}
                                />

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

                    {/* Mobile Drawer Overlay */}
                    {isSidebarOpen && (
                        <div
                            className="absolute inset-0 bg-black/50 z-30 md:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Messages;