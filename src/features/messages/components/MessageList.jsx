import { useRef, useEffect, useMemo } from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageList = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef(null);

    // Sort messages: Oldest at top, Newest at bottom
    const sortedMessages = useMemo(() => {
        if (!messages || !Array.isArray(messages)) return [];
        return [...messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [sortedMessages]);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="space-y-4">
                {sortedMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-10">
                        <p className="text-sm">No messages yet</p>
                        <p className="text-xs">Say hello to start the conversation!</p>
                    </div>
                ) : (
                    sortedMessages.map((message, index) => {
                        // FIX: Check both sender_id (API) and user_id (Optimistic)
                        // Convert to String/Number safe comparison just in case
                        const isOwnMessage =
                            String(message.sender_id) === String(currentUserId) ||
                            String(message.user_id) === String(currentUserId);

                        return (
                            <div
                                key={message.id || index}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm ${isOwnMessage
                                        ? 'bg-brand-600 text-white rounded-tr-none' // Your messages
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' // Their messages
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                        {message.message}
                                    </p>

                                    <div className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? 'text-white/80' : 'text-gray-400'
                                        }`}>
                                        <span className="text-[10px] min-w-[35px] text-right">
                                            {formatTime(message.created_at)}
                                        </span>

                                        {/* Read Receipts */}
                                        {isOwnMessage && (
                                            message.is_read ? (
                                                <CheckCheck className="w-3 h-3" />
                                            ) : (
                                                <Check className="w-3 h-3" />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;