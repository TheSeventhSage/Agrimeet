// admin/components/shared/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange, itemsPerPage = 20 }) => {
    const { current_page, last_page, from, to, total } = pagination;

    if (!total || total === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{from || 1}</span> to{' '}
                <span className="font-medium">{to || 0}</span> of{' '}
                <span className="font-medium">{total}</span> results
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-700">
                    Page {current_page} of {last_page}
                </span>
                <button
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === last_page}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;