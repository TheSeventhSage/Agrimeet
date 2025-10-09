
// components/shared/LoadingSpinner.jsx
export const LoadingSpinner = ({ 
    size = 'md', 
    fullScreen = false, 
    message = 'Loading...',
    showMessage = true 
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-3',
        xl: 'h-16 w-16 border-4'
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`
                    ${sizeClasses[size]} 
                    border-brand-200 
                    border-t-brand-600 
                    rounded-full 
                    animate-spin
                `}
                role="status"
                aria-label="Loading"
            />
            {showMessage && (
                <p className="text-gray-600 text-sm font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
};


// Optional: Specialized variants for common use cases

export const PageLoader = ({ message = 'Loading page...' }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" message={message} />
    </div>
);

export const CardLoader = ({ message = 'Loading...' }) => (
    <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="md" message={message} />
    </div>
);

export const InlineLoader = () => (
    <LoadingSpinner size="sm" showMessage={false} />
);

export const Loading = (
    { size = 'lg', className = '', message }
    ) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex items-center justify-center py-12">
                <div className={`animate-spin rounded-full border-b-2 border-brand-600 ${className, sizeClasses[size]}`}>{message}</div>
            </div>
    );
};

