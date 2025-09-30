// src/shared/components/AvatarUpload.jsx
import { useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

export default function AvatarUpload({ src, alt = "Avatar", onFileSelected, size = 80 }) {
    const inputRef = useRef(null);
    const prevBlobRef = useRef(null);

    useEffect(() => {
        return () => {
            if (prevBlobRef.current) {
                URL.revokeObjectURL(prevBlobRef.current);
                prevBlobRef.current = null;
            }
        };
    }, []);

    function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        // create preview blob url and hand to parent
        const blobUrl = URL.createObjectURL(file);
        prevBlobRef.current = blobUrl;
        onFileSelected?.(file, blobUrl);
        e.target.value = "";
    }

    return (
        <div className="relative w-fit">
            <img
                src={src || 'https://via.placeholder.com/100x100/10b981/ffffff?text=JD'}
                alt={alt}
                className=" rounded-full border-4 border-gray-200 object-cover"
                style={{ width: size, height: size }}
            />
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFile}
                aria-hidden="true"
            />
            <button
                type="button"
                aria-label="Change profile photo"
                onClick={() => inputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition"
            >
                <Camera className="w-3 h-3" />
            </button>
        </div>
    );
}
