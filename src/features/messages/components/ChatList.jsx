import { Search, Package } from 'lucide-react';

const ChatList = ({
    conversations = [],
    selectedChat,
    onSelectChat,
    searchQuery,
    onSearchChange,
    loading
}) => {

    // Helper to safely get display name
    const getDisplayName = (conversation) => {
        // Support both structures
        const party = conversation.other_party || conversation.other_user;
        if (!party) return 'Unknown User';
        return `${party.first_name || ''} ${party.last_name || ''}`.trim() || party.email || 'User';
    };

    const getInitials = (name) => {
        return (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getLastMessageObj = (conversation) => {
        if (Array.isArray(conversation.last_message) && conversation.last_message.length > 0) {
            return conversation.last_message[0];
        }
        return conversation.last_message || null;
    };

    const getContextName = (conversation) => {
        if (conversation.product) return conversation.product.name;
        if (conversation.context_type === 'order') return `Order #${conversation.order_id}`;
        return 'Inquiry';
    };

    const getPreviewText = (conversation) => {
        const lastMsg = getLastMessageObj(conversation);
        if (!lastMsg) return 'Started a conversation';
        if (lastMsg.attachment_url || lastMsg.is_file || lastMsg.is_image) return 'Sent an attachment';
        return lastMsg.message || 'No messages yet';
    };

    const getTimeString = (conversation) => {
        const lastMsg = getLastMessageObj(conversation);
        if (!lastMsg) return '';
        const date = new Date(lastMsg.created_at);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (days === 1) return 'Yesterday';
        if (days < 7) return date.toLocaleDateString([], { weekday: 'short' });
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Safely filter
    const safeConversations = Array.isArray(conversations) ? conversations : [];

    const filteredConversations = safeConversations.filter(chat => {
        const name = getDisplayName(chat).toLowerCase();
        const context = getContextName(chat).toLowerCase();
        const query = (searchQuery || '').toLowerCase();
        return name.includes(query) || context.includes(query);
    });

    return (
        <div className="flex flex-col h-full w-full">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-48 space-y-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
                        <p className="text-sm text-gray-500">Loading chats...</p>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-500 px-6 text-center">
                        <p className="text-lg font-medium text-gray-400 mb-1">No messages</p>
                        <p className="text-sm">Your conversation list is empty.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filteredConversations.map((conversation) => {
                            const isSelected = selectedChat?.id === conversation.id;
                            const displayName = getDisplayName(conversation);
                            const contextName = getContextName(conversation);
                            const initials = getInitials(displayName);
                            const isUnread = (conversation.unread_count || 0) > 0;

                            return (
                                <button
                                    key={conversation.id}
                                    onClick={() => onSelectChat(conversation)}
                                    className={`w-full p-4 text-left transition-all hover:bg-gray-50 ${isSelected ? 'bg-brand-50/60 hover:bg-brand-50' : ''
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="relative shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-semibold text-sm border-2 border-white shadow-sm">
                                                {initials}
                                            </div>
                                            {isUnread && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h3 className={`font-semibold text-sm truncate pr-2 ${isUnread ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                    {displayName}
                                                </h3>
                                                <span className={`text-[10px] whitespace-nowrap ${isUnread ? 'text-brand-600 font-medium' : 'text-gray-400'
                                                    }`}>
                                                    {getTimeString(conversation)}
                                                </span>
                                            </div>

                                            <p className={`text-xs truncate mb-1.5 ${isUnread ? 'text-gray-900 font-medium' : 'text-gray-500'
                                                }`}>
                                                {conversation.is_typing ? (
                                                    <span className="text-brand-600 animate-pulse">Typing...</span>
                                                ) : (
                                                    getPreviewText(conversation)
                                                )}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-gray-500 flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-md max-w-[80%] truncate">
                                                    <Package className="w-3 h-3 text-gray-400" />
                                                    {contextName}
                                                </span>

                                                {isUnread && (
                                                    <span className="bg-brand-500 text-white text-[10px] font-bold h-4 min-w-[1rem] px-1 rounded-full flex items-center justify-center">
                                                        {conversation.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;