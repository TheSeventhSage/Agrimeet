import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

const ProductActionsDropdown = ({ product, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEdit = () => {
        if (onEdit) onEdit(product);
        setIsOpen(false);
    };

    const handleDelete = () => {
        if (onDelete) onDelete(product);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Three Dots Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                        <button
                            onClick={handleEdit}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>

                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductActionsDropdown;
