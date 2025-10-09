import { useRef } from 'react';

export default function OtpInput({ length = 6, value = "", onChange }) {
    const inputs = useRef([]);

    const setVal = (idx, v) => {
        const chars = value.split('');
        chars[idx] = v.replace(/\D/g, '').slice(-1) || '';
        const next = chars.join('').padEnd(length, '');
        onChange(next);

        if (v && idx < length - 1) inputs.current[idx + 1]?.focus();
    };

    const onKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !value[idx] && idx > 0) {
            inputs.current[idx - 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && idx > 0) inputs.current[idx - 1]?.focus();
        if (e.key === 'ArrowRight' && idx < length - 1) inputs.current[idx + 1]?.focus();
    };

    const onPaste = (e) => {
        const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
        if (text) {
            e.preventDefault();
            const padded = text.padEnd(length, '');
            onChange(padded);
            inputs.current[Math.min(text.length, length) - 1]?.focus();
        }
    };

    return (
        <div className="flex gap-2 justify-center" onPaste={onPaste}>
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    inputMode="numeric"
                    value={value[i] || ''}
                    onChange={(e) => setVal(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    ref={(el) => inputs.current[i] = el}
                    className="md:w-12 md:h-12 w-10 h-10 text-center text-lg font-medium rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/40 outline-hidden"
                />
            ))}
        </div>
    );
}
