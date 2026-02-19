import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * A reusable pagination component.
 * @param {object} props
 * @param {number} props.currentPage - The current active page.
 * @param {number} props.lastPage - The total number of pages.
 * @param {function(number): void} props.onPageChange - Callback when a page is clicked.
 */
const Pagination = ({ currentPage, lastPage, onPageChange }) => {
    // --- Logic remains exactly the same ---
    const pages = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (lastPage <= maxPagesToShow) {
        startPage = 1;
        endPage = lastPage;
    } else {
        const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

        if (currentPage <= maxPagesBeforeCurrent) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrent >= lastPage) {
            startPage = lastPage - maxPagesToShow + 1;
            endPage = lastPage;
        } else {
            startPage = currentPage - maxPagesBeforeCurrent;
            endPage = currentPage + maxPagesAfterCurrent;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const hasLeftEllipsis = startPage > 1;
    const hasRightEllipsis = endPage < lastPage;

    // --- UI Updates start here ---
    return (
        <div className="flex  items-center justify-between px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center gap-2 px-2 md:px-4 h-8 md:h-10 text-sm font-medium transition-all duration-200 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className='hidden sm:inline'>
                    Previous
                </span>
            </button>

            {/* Page Numbers */}
            <nav className="flex items-center gap-1.5">
                {hasLeftEllipsis && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="flex items-center justify-center min-w-[2.5rem] h-10 px-3 text-sm font-medium text-gray-600 transition-all duration-200 border border-transparent rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
                        >
                            1
                        </button>
                        <span className="flex items-center justify-center w-8 h-10 text-sm font-medium text-gray-400">
                            ...
                        </span>
                    </>
                )}

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`flex items-center justify-center min-w-[2.5rem] h-10 px-3 text-sm font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 ${currentPage === page
                            ? 'bg-brand-500 text-white border border-brand-500 shadow-sm shadow-brand-500/30'
                            : 'text-gray-600 border border-transparent hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {hasRightEllipsis && (
                    <>
                        <span className="flex items-center justify-center w-8 h-10 text-sm font-medium text-gray-400">
                            ...
                        </span>
                        <button
                            onClick={() => onPageChange(lastPage)}
                            className="flex items-center justify-center min-w-[2.5rem] h-10 px-3 text-sm font-medium text-gray-600 transition-all duration-200 border border-transparent rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
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
                className="flex items-center justify-center gap-2 px-2 md:px-4 h-8 md:h-10  text-sm font-medium transition-all duration-200 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200"
            >
                <span className='hidden sm:inline'>
                    Next
                </span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;