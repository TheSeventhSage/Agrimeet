const Button = ({ children, className = '', loading, ...props }) => {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={[
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5",
                "bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.99]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "shadow-md transition-all duration-200",
                "font-medium",
                className
            ].join(' ')}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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