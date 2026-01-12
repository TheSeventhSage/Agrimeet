import { useRef, useEffect, useMemo } from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageList = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef(null);

    // Sort messages: Oldest at the top (index 0), Newest at the bottom
    // We use useMemo to prevent unnecessary sorting on every render
    const sortedMessages = useMemo(() => {
        if (!messages) return [];
        return [...messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }, [messages]);

    console.log(messages)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Scroll to bottom whenever the sorted messages change (e.g., new message sent/received)
    useEffect(() => {
        scrollToBottom();
    }, [sortedMessages]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-4">
                {sortedMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    sortedMessages.map((message) => {
                        // Strict check: Compare message sender_id with the current logged-in user's ID
                        // This accurately determines if the message is from "yourself" (the seller/vendor in this context)
                        const isOwnMessage = message.sender_id === currentUserId;

                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-md ${isOwnMessage
                                        ? 'bg-green-600 text-white' // User's own messages: Green background
                                        : 'bg-white text-gray-900 border border-gray-200' // Other party's messages: White background
                                        } rounded-2xl px-4 py-2.5 shadow-sm`}
                                >
                                    <p className="text-sm">{message.message}</p>
                                    <div
                                        className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'
                                            }`}
                                    >
                                        <span className="text-xs">
                                            {formatTime(message.created_at)}
                                        </span>
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
                {/* Invisible element to act as the scroll anchor */}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;