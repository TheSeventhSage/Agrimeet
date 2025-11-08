import { useRef, useEffect } from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageList = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage = message.sender_id === currentUserId;

                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-md ${isOwnMessage
                                            ? 'bg-brand-500 text-white'
                                            : 'bg-white text-gray-900 border border-gray-200'
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
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;