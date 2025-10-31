// admin/components/UserManagement/SuspendUserModal.jsx
import { useState } from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';

const SuspendUserModal = ({ user, isOpen, onClose, onConfirm, isLoading }) => {
    const [reason, setReason] = useState('');

    if (!isOpen || !user) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(reason);
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,.7)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Suspend User</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            <XCircle className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to suspend <span className="font-semibold">{user.name}</span>?
                        This will revoke their access to the platform.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for suspension (optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason for suspension..."
                            rows={4}
                            maxLength={255}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {reason.length}/255 characters
                        </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                'Suspend User'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuspendUserModal;