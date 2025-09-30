// components/LoadingSpinner.jsx
const LoadingSpinner = (
    { size = 'lg', className = '' }
    ) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex items-center justify-center py-12">
                <div className={`animate-spin rounded-full border-b-2 border-brand-600 ${className, sizeClasses[size]}`}></div>
            </div>
    );
};

export default LoadingSpinner;