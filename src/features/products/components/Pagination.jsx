import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * A reusable pagination component.
 * @param {object} props
 * @param {number} props.currentPage - The current active page.
 * @param {number} props.lastPage - The total number of pages.
 * @param {function(number): void} props.onPageChange - Callback when a page is clicked.
 */
const Pagination = ({ currentPage, lastPage, onPageChange }) => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (lastPage <= maxPagesToShow) {
        // Show all pages
        startPage = 1;
        endPage = lastPage;
    } else {
        // Calculate start and end pages with ellipsis logic
        const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

        if (currentPage <= maxPagesBeforeCurrent) {
            // Near the start
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrent >= lastPage) {
            // Near the end
            startPage = lastPage - maxPagesToShow + 1;
            endPage = lastPage;
        } else {
            // In the middle
            startPage = currentPage - maxPagesBeforeCurrent;
            endPage = currentPage + maxPagesAfterCurrent;
        }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    // Add ellipsis and first/last page
    const hasLeftEllipsis = startPage > 1;
    const hasRightEllipsis = endPage < lastPage;

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Previous
            </button>

            {/* Page Numbers */}
            <nav className="hidden md:flex items-center gap-2">
                {hasLeftEllipsis && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-3 py-1 text-sm rounded-md hover:bg-gray-100"
                        >
                            1
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-500">...</span>
                    </>
                )}
                
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            currentPage === page
                                ? 'bg-brand-500 text-white font-semibold'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {hasRightEllipsis && (
                    <>
                        <span className="px-3 py-1 text-sm text-gray-500">...</span>
                        <button
                            onClick={() => onPageChange(lastPage)}
                            className="px-3 py-1 text-sm rounded-md hover:bg-gray-100"
                        >
                            {lastPage}
                        </button>
                    </>
                )}
            </nav>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
                Next
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;