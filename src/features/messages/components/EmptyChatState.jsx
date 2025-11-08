import { MessageSquare } from 'lucide-react';

const EmptyChatState = () => {
    return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-12 h-12 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a conversation
                </h3>
                <p className="text-gray-600">
                    Choose a chat from the list to start messaging
                </p>
            </div>
        </div>
    );
};

export default EmptyChatState;