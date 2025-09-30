import { useState } from 'react';

const PasswordField = ({ label, error, className = '', ...props }) => {
    const [show, setShow] = useState(false);
    return (
        <label className="block">
            {label && <span className="text-sm text-gray-700 font-medium">{label}</span>}
            <div className={[
                "mt-1 flex items-center rounded-xl border bg-white backdrop-blur",
                error ? "border-red-300" : "border-gray-200",
                className
            ].join(' ')}>
                <input
                    {...props}
                    type={show ? 'text' : 'password'}
                    className="w-full px-3.5 py-2.5 outline-none rounded-xl bg-transparent"
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="px-3 text-sm text-gray-600 hover:text-brand-600 transition-colors"
                >
                    {show ? 'Hide' : 'Show'}
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </label>
    );
};

export default PasswordField;
