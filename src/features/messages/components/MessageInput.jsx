import { useState } from 'react';
import { Paperclip, Image as ImageIcon, Smile, Send } from 'lucide-react';
import Textarea from '../../../shared/components/Textarea';

const MessageInput = ({ onSendMessage, onTyping }) => {
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageText.trim()) {
            onSendMessage(messageText);
            setMessageText('');
            setIsTyping(false);
            onTyping?.(false);
        }
    };

    const handleTextChange = (e) => {
        const value = e.target.value;
        setMessageText(value);

        // Notify typing status
        if (value.trim() && !isTyping) {
            setIsTyping(true);
            onTyping?.(true);
        } else if (!value.trim() && isTyping) {
            setIsTyping(false);
            onTyping?.(false);
        }
    };

    return (
        <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                {/* <button
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
                </button> */}
                <div className="flex-1 relative">
                    <Textarea
                        value={messageText}
                        onChange={handleTextChange}
                        placeholder="Type your message..."
                        rows={1}
                        className="pr-12 rounded-xl resize-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                    />
                    {/* <button
                        type="button"
                        className="absolute right-3 bottom-2.5 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Smile className="w-5 h-5 text-gray-600" />
                    </button> */}
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
    );
};

export default MessageInput;