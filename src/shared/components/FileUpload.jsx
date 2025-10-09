import { useState, useCallback } from 'react';
import { Upload, Trash2 } from 'lucide-react';

const ImageUploader = ({
    label = "Images",
    maxSizeMB = 10,
    acceptedTypes = "image/*",
    multiple = true,
    value = [],
    onChange,
    error,
    previewHeight = "h-24",
    maxFiles,
    helperText = "PNG, JPG, GIF up to 10MB each"
}) => {
    const [uploadedImages, setUploadedImages] = useState(value);

    const handleImageUpload = useCallback((event) => {
        const files = Array.from(event.target.files);

        if (maxFiles && uploadedImages.length + files.length > maxFiles) {
            alert(`Maximum ${maxFiles} files allowed`);
            return;
        }

        const newImages = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
            size: file.size
        }));

        const updatedImages = [...uploadedImages, ...newImages];
        setUploadedImages(updatedImages);
        onChange?.(updatedImages);

        // Clear the input
        event.target.value = '';
    }, [uploadedImages, onChange, maxFiles]);

    const removeImage = useCallback((imageId) => {
        const updatedImages = uploadedImages.filter(img => img.id !== imageId);
        setUploadedImages(updatedImages);
        onChange?.(updatedImages);
    }, [uploadedImages, onChange]);

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{label}</h2>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-500 transition-colors">
                <input
                    type="file"
                    multiple={multiple}
                    accept={acceptedTypes}
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 mb-2">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                        {helperText}
                    </p>
                </label>
            </div>

            {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
            )}

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-4">
                        Uploaded Files ({uploadedImages.length}{maxFiles ? `/${maxFiles}` : ''})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImages.map((image) => (
                            <div key={image.id} className="relative group">
                                <img
                                    src={image.preview}
                                    alt="Preview"
                                    className={`w-full ${previewHeight} object-cover rounded-lg`}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(image.id)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                    {image.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;