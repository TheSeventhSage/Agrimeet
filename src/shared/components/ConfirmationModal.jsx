import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning" // warning, danger, info
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: 'text-red-500',
                    confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
                    border: 'border-red-200'
                };
            case 'info':
                return {
                    icon: 'text-blue-500',
                    confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white',
                    border: 'border-blue-200'
                };
            default: // warning
                return {
                    icon: 'text-yellow-500',
                    confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white',
                    border: 'border-yellow-200'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,.7)] flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full mx-4 border ${styles.border}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 mb-6">{message}</p>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded-lg transition-colors ${styles.confirmButton} cursor-pointer`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
