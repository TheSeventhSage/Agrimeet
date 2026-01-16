const Button = ({
    children,
    className = '',
    loading,
    variant = 'default', // 'default', 'outline', 'secondary', 'ghost'
    size = 'default',    // 'default', 'sm', 'lg'
    ...props
}) => {
    // --- Base Styles ---
    // Your original styles are now the base
    const baseStyles = [
        "inline-flex items-center justify-center gap-2 rounded-xl",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "shadow-md transition-all duration-200",
        "font-medium cursor-pointer active:scale-[0.99]",
    ].join(' ');

    // --- Variant Styles ---
    // We define different styles for each variant
    const variants = {
        default: "bg-brand-500 text-white hover:bg-brand-600", // Your original style
        outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        ghost: "bg-transparent text-brand-700 hover:bg-gray-100 shadow-none",
    };

    // --- Size Styles ---
    // We define different padding/text sizes
    const sizes = {
        default: "px-4 py-2.5", // Your original size
        sm: "px-3 py-2 text-sm",
        lg: "px-6 py-3 text-lg",
    };

    // Combine all classes
    const combinedClasses = [
        baseStyles,
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className
    ].join(' ');

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={combinedClasses}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Please wait...
                </>
            ) : children}
        </button>
    );
};

export default Button;