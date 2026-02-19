import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
// CHANGED: Importing from the main messages API file
import { adminMessagesApi } from '../api/messages.api';
import { storageManager } from '../../../shared/utils/storageManager';

const ADMIN_PARTICIPANT = {
    first_name: 'Admin',
    last_name: 'Support',
    email: 'support@agrimeetconnect.com',
    id: 'admin_static'
};

const MessageAdmin = () => {
    const navigate = useNavigate();
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const userData = storageManager.getUserData();
    const currentUserId = userData?.data?.id || userData?.id;

    useEffect(() => {
        const initChat = async () => {
            try {
                setLoading(true);
                const result = await adminMessagesApi.initiateAdminChat();

                // Handle 201 (wrapped in data) vs 400 (direct object)
                const conversationRaw = result.data || result;

                if (!conversationRaw || !conversationRaw.id) {
                    throw new Error("Invalid conversation data received");
                }

                // Attach Admin participant manually for UI compatibility
                const adaptedConversation = {
                    ...conversationRaw,
                    other_party: ADMIN_PARTICIPANT,
                    context_type: 'support'
                };

                setConversation(adaptedConversation);
            } catch (error) {
                console.error("Failed to initiate admin chat:", error);
            } finally {
                setLoading(false);
            }
        };

        initChat();
    }, []);

    useEffect(() => {
        if (conversation?.id) {
            fetchMessages(conversation.id);
        }
    }, [conversation?.id]);

    const fetchMessages = async (conversationId) => {
        try {
            setLoadingMessages(true);
            const response = await adminMessagesApi.getMessages(conversationId);
            const msgs = Array.isArray(response) ? response : (response.data || []);
            setMessages(msgs);
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (text) => {
        if (!conversation?.id) return;
        try {
            await adminMessagesApi.sendMessage(conversation.id, text);
            await fetchMessages(conversation.id);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleTyping = (isTyping) => {
        if (conversation?.id) {
            adminMessagesApi.sendTyping(conversation.id, isTyping).catch(() => { });
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                    </div>
                ) : conversation ? (
                    <>
                        <ChatHeader
                            conversation={conversation}
                            onBack={() => navigate(-1)}
                        />
                        <div className="flex-1 overflow-y-auto relative w-full bg-gray-50">
                            {loadingMessages && messages.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
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
                            onTyping={handleTyping}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Unable to connect to Admin Support.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MessageAdmin;
