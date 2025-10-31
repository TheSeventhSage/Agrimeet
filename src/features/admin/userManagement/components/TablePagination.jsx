// admin/components/UserManagement/TablePagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TablePagination = ({ pagination, filters, onPageChange, isLoading }) => {
    const { current_page, last_page, total, from, to } = pagination;

    return (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{from || 0}</span> to{' '}
                <span className="font-medium">{to || 0}</span> of{' '}
                <span className="font-medium">{total || 0}</span> users
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1 || isLoading}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-700">
                    Page {current_page} of {last_page}
                </span>
                <button
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === last_page || isLoading}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default TablePagination;