import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import { storageManager } from '../../../../shared/utils/storageManager';
import { adminSupportApi } from '../api/adminSupport.api';

// Shared Components
import ChatList from '../../../messages/components/ChatList';
import ChatHeader from '../../../messages/components/ChatHeader';
import MessageList from '../../../messages/components/MessageList';
import MessageInput from '../../../messages/components/MessageInput';
import EmptyChatState from '../../../messages/components/EmptyChatState';


const AdminSupportMessages = () => {
    // --- State ---
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);

    // --- Loading States ---
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // --- User Identity ---
    const userData = storageManager.getUserData();
    // 1. Robust extraction to ensure we get an ID
    const rawId = userData?.data?.id || userData?.id || userData?.data?.user?.id || userData?.user?.id;
    // 2. Default to 0 if missing. This ensures consistent comparison logic even if Auth is flaky.
    const currentUserId = rawId ? Number(rawId) : 0;

    // --- Effects ---

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedChat?.id) {
            fetchMessages(selectedChat.id);
        }
    }, [selectedChat?.id]);

    // --- API Actions ---

    const fetchConversations = async () => {
        try {
            setLoadingConversations(true);
            const response = await adminSupportApi.getConversations();
            const rawList = Array.isArray(response) ? response : (response.data || []);

            const adaptedList = rawList.map(conv => {
                // Adapter: Ensure ChatList can read the Seller's name
                const rawParty = conv.other_party || conv.seller || conv.user;
                const adaptedParty = {
                    ...rawParty,
                    first_name: rawParty?.store_name || rawParty?.first_name || 'Seller',
                    last_name: rawParty?.last_name || '',
                    email: rawParty?.email,
                    avatar: rawParty?.avatar
                };

                // Adapter: Handle last_message array vs object
                let lastMsgObj = conv.last_message;
                if (Array.isArray(conv.last_message) && conv.last_message.length > 0) {
                    lastMsgObj = conv.last_message[0];
                }

                return {
                    ...conv,
                    other_party: adaptedParty,
                    last_message: lastMsgObj,
                    context_type: conv.context_type || 'support'
                };
            });

            setConversations(adaptedList);
        } catch (error) {
            console.error("Failed to load admin conversations:", error);
        } finally {
            setLoadingConversations(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            setLoadingMessages(true);
            const response = await adminSupportApi.getMessages(conversationId);
            const msgs = Array.isArray(response) ? response : (response.data || []);

            // --- CRITICAL FIX START ---
            // If the message is from an 'admin', force it to belong to 'currentUserId'.
            // This guarantees Right Alignment regardless of ID mismatches (e.g. Auth ID vs DB ID).
            const cleanMsgs = msgs.map(m => {
                const isAdminMessage = m.sender_type === 'admin' || m.sender_type === 'Admin';

                return {
                    ...m,
                    sender_id: isAdminMessage ? currentUserId : Number(m.sender_id)
                };
            });
            // --- CRITICAL FIX END ---

            setMessages(cleanMsgs);
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (text) => {
        if (!selectedChat?.id) return;

        try {
            // Optimistic Update: Shows on Right immediately
            const tempId = Date.now();
            const optimisticMsg = {
                id: tempId,
                conversation_id: selectedChat.id,
                sender_id: currentUserId, // Matches because currentUserId is stable
                message: text,
                created_at: new Date().toISOString(),
                is_read: false,
                sender_type: 'admin' // consistency
            };
            setMessages(prev => [...prev, optimisticMsg]);

            await adminSupportApi.sendMessage(selectedChat.id, text);
            // On refresh, the 'fetchMessages' logic above will keep it on the Right
            await fetchMessages(selectedChat.id);
            fetchConversations();
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optional: Remove optimistic message on error
        }
    };

    // --- Render ---

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-6rem)] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                {/* LIST SECTION */}
                <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 min-w-[320px] flex-col border-r border-gray-200 bg-white`}>
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="font-bold text-lg text-gray-800">Support Inbox</h2>
                    </div>

                    <ChatList
                        conversations={conversations}
                        selectedChat={selectedChat}
                        onSelectChat={setSelectedChat}
                        loading={loadingConversations}
                        searchQuery=""
                        onSearchChange={() => { }}
                    />
                </div>

                {/* CHAT SECTION */}
                <div className={`${!selectedChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-gray-50`}>
                    {selectedChat ? (
                        <>
                            <ChatHeader
                                conversation={selectedChat}
                                onBack={() => setSelectedChat(null)}
                            />

                            <div className="flex-1 overflow-y-auto relative w-full">
                                {loadingMessages && messages.length === 0 ? (
                                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
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

export default AdminSupportMessages;