import { useState, useEffect } from 'react';
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
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const userData = storageManager.getUserData();
    const currentUserId = userData?.data?.id || userData?.id;

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);
        }
    }, [selectedChat]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const response = await messagesApi.getConversations();

            // Handle various response structures safely
            let data = [];
            if (Array.isArray(response)) {
                data = response;
            } else if (response?.data && Array.isArray(response.data)) {
                data = response.data;
            } else if (response?.data?.data && Array.isArray(response.data.data)) {
                data = response.data.data;
            }

            setConversations(data);
        } catch (err) {
            console.error("Error fetching conversations:", err);
            // Don't leave it loading forever if error
            setConversations([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            setLoadingMessages(true);
            const response = await messagesApi.getMessages(conversationId);

            let msgs = [];
            if (Array.isArray(response)) {
                msgs = response;
            } else if (response?.data && Array.isArray(response.data)) {
                msgs = response.data;
            } else if (response?.messages && Array.isArray(response.messages)) {
                msgs = response.messages;
            }
            setMessages(msgs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (text) => {
        if (!selectedChat) return;
        try {
            const tempMsg = {
                id: Date.now(),
                conversation_id: selectedChat.id,
                sender_id: currentUserId,
                user_id: currentUserId,
                message: text,
                created_at: new Date().toISOString(),
                is_read: false
            };
            setMessages(prev => [...prev, tempMsg]);

            await messagesApi.sendMessage(selectedChat.id, { message: text });

            fetchMessages(selectedChat.id);
            fetchConversations(); // Update list for "Last Message"
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    // Mobile Logic: If chat is selected, we are in "Chat View". If null, "List View".
    const isMobileChatView = !!selectedChat;

    return (
        <DashboardLayout>

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600 mt-2 mb-4">
                    Communicate and stay connected with your business customers
                </p>
            </div>
            {/* Main Container with fixed height calculation.
                h-[calc(100vh-7rem)] adjusts for Header + Padding.
                'flex' ensures side-by-side layout on Desktop.
            */}
            <div className="flex h-[calc(100vh-7rem)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                {/* --- SIDEBAR (CHAT LIST) --- 
                    Mobile: Hidden if a chat is selected (isMobileChatView = true)
                    Desktop: Always Visible
                */}
                <div className={`
                    w-full md:w-80 border-r border-gray-200 bg-white flex flex-col h-full
                    ${isMobileChatView ? 'hidden md:flex' : 'flex'}
                `}>
                    <ChatList
                        conversations={conversations}
                        selectedChat={selectedChat}
                        onSelectChat={setSelectedChat}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        loading={loading}
                    />
                </div>

                {/* --- MAIN CHAT AREA --- 
                    Mobile: Hidden if NO chat is selected (isMobileChatView = false)
                    Desktop: Always Visible (shows EmptyState if null)
                */}
                <div className={`
                    flex-1 bg-gray-50 flex-col h-full relative
                    ${!isMobileChatView ? 'hidden md:flex' : 'flex'}
                `}>
                    {selectedChat ? (
                        <>
                            <ChatHeader
                                conversation={selectedChat}
                                // Back Button clears selection -> triggers Mobile List View
                                onBack={() => setSelectedChat(null)}
                            />

                            <div className="flex-1 overflow-y-auto relative w-full">
                                {loadingMessages ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
                                            <p className="text-xs text-gray-500 mt-2">Loading...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <MessageList
                                        messages={messages}
                                        currentUserId={currentUserId}
                                    />
                                )}
                            </div>

                            <MessageInput
                                onSendMessage={handleSendMessage}
                                onTyping={() => { }}
                            />
                        </>
                    ) : (
                        <EmptyChatState />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Messages;