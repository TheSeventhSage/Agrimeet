const TextField = ({ label, hint, error, className = '', ...props }) => {
    return (
        <label className="block">
            {label && <span className="text-sm text-gray-700 font-medium">{label}</span>}
            <input
                {...props}
                className={[
                    "mt-1 w-full rounded-xl border px-3.5 py-2.5 outline-none",
                    "bg-white backdrop-blur",
                    "focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50",
                    error ? "border-red-300" : "border-gray-200",
                    className
                ].join(' ')}
            />
            {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </label>
    );
};

export default TextField;