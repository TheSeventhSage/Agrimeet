import { Phone, Video, MoreVertical } from 'lucide-react';

const ChatHeader = ({ conversation }) => {
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const otherUser = conversation.other_user || {};
    const contextName = conversation.context_type === 'order'
        ? `Order #${conversation.order_id}`
        : conversation.context_details?.name || 'Product';

    return (
        <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold">
                            {getInitials(otherUser.name || 'User')}
                        </div>
                        {otherUser.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{otherUser.name || 'Unknown User'}</h3>
                        <div className="flex items-center gap-2 text-sm">
                            <span className={`${otherUser.online ? 'text-green-600' : 'text-gray-500'}`}>
                                {otherUser.online ? 'Online' : 'Offline'}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{contextName}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Video className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;