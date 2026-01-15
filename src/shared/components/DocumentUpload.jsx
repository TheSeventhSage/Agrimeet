import { useState, useCallback, useEffect } from 'react';
import { Upload, Trash2, FileText } from 'lucide-react';
import { showError } from '../utils/alert';

const DocumentUpload = ({
    label = "Document",
    maxSizeMB = 10,
    acceptedTypes = ".pdf,.jpg,.jpeg,.png",
    value = null,
    onChange,
    error,
    helperText = "PDF, JPG, PNG up to 10MB",
    maxFiles = 1
}) => {
    const [uploadedFiles, setUploadedFiles] = useState(Array.isArray(value) ? value : (value ? [value] : []));

    // Cleanup object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            uploadedFiles.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
    }, [uploadedFiles]);

    const handleFileUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (uploadedFiles.length >= maxFiles) {
            showError(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);
            return;
        }

        const fileObject = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            // Create a preview URL if it's an image
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        };

        const newFiles = [...uploadedFiles, fileObject];
        setUploadedFiles(newFiles);
        onChange?.(newFiles);

        event.target.value = '';
    }, [uploadedFiles, onChange, maxFiles]);

    const removeFile = useCallback((fileId) => {
        const newFiles = uploadedFiles.filter(file => file.id !== fileId);
        setUploadedFiles(newFiles);
        onChange?.(newFiles);
    }, [uploadedFiles, onChange]);

    const getFileIcon = (fileName) => {
        if (fileName?.endsWith('.pdf')) return '📄';
        if (fileName?.endsWith('.jpg') || fileName?.endsWith('.jpeg')) return '🖼️';
        if (fileName?.endsWith('.png')) return '🖼️';
        return '📁';
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {maxFiles > 1 && <span className="text-xs text-gray-500">(Max {maxFiles} files)</span>}
            </label>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-500 transition-colors">
                <input
                    type="file"
                    accept={acceptedTypes}
                    onChange={handleFileUpload}
                    className="hidden"
                    id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                />
                <label
                    htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                    className="cursor-pointer block"
                >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                        {helperText}
                    </p>
                </label>
            </div>

            {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
            )}

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    {uploadedFiles.map(file => (
                        <div key={file.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Preview Logic: Show Image if available, else Icon */}
                                    {file.preview ? (
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={file.preview}
                                                alt={file.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-lg">{getFileIcon(file.name)}</span>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-700 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(file.id)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;