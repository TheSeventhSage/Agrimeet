import { Search, Package } from 'lucide-react';

const ChatList = ({ conversations, selectedChat, onSelectChat, searchQuery, onSearchChange }) => {
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const filteredConversations = conversations.filter(conv =>
        conv.other_user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.context_details?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-100">
                    {filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-sm">No conversations found</p>
                        </div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => onSelectChat(conversation)}
                                className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${selectedChat?.id === conversation.id ? 'bg-brand-50' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold">
                                            {getInitials(conversation.other_user?.name || 'User')}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                {conversation.other_user?.name || 'Unknown User'}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                                                {conversation.last_message?.created_at || ''}
                                            </span>
                                        </div>

                                        {/* Typing indicator logic for List View */}
                                        {conversation.is_typing ? (
                                            <p className="text-sm text-green-600 animate-pulse font-medium mb-1">
                                                Typing...
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-600 truncate mb-1">
                                                {conversation.last_message?.message || 'No messages yet'}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 truncate flex items-center gap-1">
                                                <Package className="w-3 h-3" />
                                                {conversation.context_type === 'order'
                                                    ? `Order #${conversation.order_id}`
                                                    : conversation.context_details?.name || 'Product'}
                                            </span>
                                            {conversation.unread_count > 0 && (
                                                <span className="bg-brand-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                                    {conversation.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatList;