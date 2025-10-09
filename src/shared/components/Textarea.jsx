import React from 'react';

const Textarea = ({
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    rows = 4,
    className = '',
    ...props
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                rows={rows}
                className={`
          w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Textarea;
