import { ArrowLeft } from 'lucide-react';

const ChatHeader = ({ conversation, onBack }) => {

    const getDisplayName = () => {
        const party = conversation.other_party || conversation.other_user;
        if (!party) return 'Unknown User';
        return `${party.first_name || ''} ${party.last_name || ''}`.trim() || party.email || 'User';
    };

    const getInitials = (name) => {
        return (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const displayName = getDisplayName();
    const initials = getInitials(displayName);

    const contextName = conversation.product
        ? conversation.product.name
        : (conversation.context_type === 'order' ? `Order #${conversation.order_id}` : 'Inquiry');

    return (
        <div className="p-3 md:p-4 border-b border-gray-200 bg-white shadow-sm z-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Back Button - Triggers onBack() passed from Messages.jsx
                        which sets selectedChat to null, restoring the list view on mobile.
                    */}
                    <button
                        onClick={onBack}
                        className="p-1 -ml-1 rounded-full hover:bg-gray-100 md:hidden text-gray-600 focus:outline-none"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {initials}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                            {displayName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs">
                            {conversation.is_typing ? (
                                <span className="text-brand-600 font-medium animate-pulse">
                                    Typing...
                                </span>
                            ) : (
                                <span className="text-gray-500 flex items-center gap-1">
                                    {contextName}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;