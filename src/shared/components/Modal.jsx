// shared/components/Modal.jsx
import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, titleColor = {}, children, size = 'md', header }) => {
    console.log(titleColor);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div
            className="ml-0 lg:ml-64 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} ${titleColor.border || ''} overflow-hidden animate-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {header ? (header) :
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h3 className={`text-xl font-bold text-gray-900 ${titleColor.text || ''}`} >{title}</h3>

                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full hover:${titleColor.bg || 'bg-gray-100'} transition-colors text-gray-500`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                }

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;