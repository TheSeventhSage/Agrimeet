import { Search, Package, X } from 'lucide-react';

const ChatList = ({
    conversations,
    selectedChat,
    onSelectChat,
    searchQuery,
    onSearchChange,
    isOpen,
    onClose
}) => {

    console.log(conversations)
    // Helper to extract the display name correctly from 'other_party'
    const getDisplayName = (conversation) => {
        const party = conversation.other_party;
        if (!party) return 'Unknown User';
        // Combine first and last name
        return `${party.first_name || ''} ${party.last_name || ''}`.trim() || party.email || 'User';
    };

    // Helper to get initials
    const getInitials = (name) => {
        return (name || 'User').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Helper to safely get the last message object (handles Array or Object)
    const getLastMessageObj = (conversation) => {
        if (Array.isArray(conversation.last_message) && conversation.last_message.length > 0) {
            return conversation.last_message[0];
        }
        return conversation.last_message || null;
    };

    // Helper to get Context Name (Product or Order)
    const getContextName = (conversation) => {
        if (conversation.product) return conversation.product.name;
        if (conversation.context_type === 'product' && conversation.product_id) return 'Product #' + conversation.product_id;

        if (conversation.order) return `Order #${conversation.order.order_number}`;
        if (conversation.context_type === 'order' && conversation.order_id) return `Order #${conversation.order_id}`;

        return 'Item';
    };

    // --- ROBUST FILTER LOGIC ---
    const filteredConversations = (conversations || []).filter(conv => {
        const name = getDisplayName(conv).toLowerCase();
        const context = getContextName(conv).toLowerCase();
        const query = (searchQuery || '').toLowerCase();

        return name.includes(query) || context.includes(query);
    });

    // --- PREVIEW TEXT LOGIC ---
    const getPreviewText = (conversation) => {
        if (conversation.unread_count > 0) {
            return `${conversation.unread_count} new message${conversation.unread_count > 1 ? 's' : ''}`;
        }
        const lastMsg = getLastMessageObj(conversation);
        return lastMsg?.message || 'No messages yet';
    };

    return (
        <div className={`
            absolute md:relative inset-y-0 left-0 z-30
            w-80 bg-white border-r border-gray-200 flex flex-col h-full
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            {/* Header & Search */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                </div>
                <button
                    onClick={onClose}
                    className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-100">
                    {filteredConversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No conversations found
                        </div>
                    ) : (
                        filteredConversations.map((conversation) => {
                            const displayName = getDisplayName(conversation);
                            const lastMsg = getLastMessageObj(conversation);
                            const contextName = getContextName(conversation);
                            const profileImg = conversation.other_party?.profile_image; // Adjust key if different in DB

                            return (
                                <button
                                    key={conversation.id}
                                    onClick={() => onSelectChat(conversation)}
                                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedChat?.id === conversation.id
                                        ? 'bg-brand-50 border-l-4 border-brand-500'
                                        : 'border-l-4 border-transparent'
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            {profileImg ? (
                                                <img
                                                    src={profileImg}
                                                    alt={displayName}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs border border-brand-200">
                                                    {getInitials(displayName)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`text-sm font-semibold truncate pr-2 ${conversation.unread_count > 0 ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                    {displayName}
                                                </h3>
                                                {lastMsg?.created_at && (
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                        {new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Preview Text */}
                                            <p className={`text-sm truncate mb-1.5 ${conversation.unread_count > 0 ? 'font-bold text-brand-600' : 'text-gray-500'
                                                }`}>
                                                {getPreviewText(conversation)}
                                            </p>

                                            {/* Context Badge & Count */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400 truncate flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                                                    <Package className="w-3 h-3" />
                                                    {contextName}
                                                </span>

                                                {conversation.unread_count > 0 && (
                                                    <span className="bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                                        {conversation.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatList;