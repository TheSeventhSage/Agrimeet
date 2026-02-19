// components/ProductsTable.jsx

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    ArrowDown,
    ArrowUp,
    ChevronLeft,
    ChevronRight,
    Search,
} from 'lucide-react';
import { getPopularProducts } from '../api/analyticsApi';
import { LoadingSpinner } from '../../../shared/components/Loader';
import Pagination from '../../../shared/components/Paginate';
import { DataErrorState } from './ChartComponents';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount);

const ProductsTable = () => {
    const [sorting, setSorting] = useState([{ id: 'total_revenue', desc: true }]);
    const [productName, setProductName] = useState('');
    const debouncedName = useDebounce(productName, 500);
    const [ratingFilter, setRatingFilter] = useState('');

    const apiFilters = useMemo(() => {
        const filters = {
            product_name: debouncedName || undefined,
            rating: ratingFilter ? Number(ratingFilter) : undefined,
        };

        if (sorting.length > 0) {
            filters.order = `${sorting[0].desc ? '-' : ''}${sorting[0].id}`;
        }
        return filters;
    }, [sorting, debouncedName, ratingFilter]);

    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['popularProducts', apiFilters],
        queryFn: () => getPopularProducts(apiFilters),
        placeholderData: (prev) => prev,
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Product',
                cell: ({ row }) => (
                    <div className="flex items-center">
                        <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={row.original.thumbnail}
                            alt={row.original.name}
                        />
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {row.original.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {formatCurrency(Number(row.original.price || 0))}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'category_name',
                header: 'Category',
                cell: (info) => (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {info.getValue()}
                    </span>
                ),
            },
            {
                accessorKey: 'total_revenue',
                header: 'Revenue',
                cell: (info) => (
                    <span className="font-medium text-green-600">
                        {/* ✅ FIX: Coerce revenue to a number */}
                        {formatCurrency(Number(info.getValue() || 0))}
                    </span>
                ),
            },
            {
                accessorKey: 'total_orders',
                header: 'Orders',
            },
            {
                accessorKey: 'total_ratings',
                header: 'Ratings',
            },
        ],
        []
    );

    const table = useReactTable({
        data: response?.data || [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualSorting: true,
        manualPagination: false,
    });

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
            <div className="space-y-3 p-4 md:p-6 md:flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                    Top Products by Revenue
                </h2>
                <div className="md:flex md:gap-2.5 space-y-2">
                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">All Ratings</option>
                        <option value="4">4 Stars & Up</option>
                        <option value="3">3 Stars & Up</option>
                        <option value="2">2 Stars & Up</option>
                        <option value="1">1 Star & Up</option>
                    </select>
                    <div className="w-full relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="p-6">
                    <LoadingSpinner message="Loading products..." />
                </div>
            )}
            {isError && (
                <div className="p-6">
                    <DataErrorState message={error.message} />
                </div>
            )}
            {!isLoading && !isError && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <span className="flex items-center gap-2">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getIsSorted() === 'desc' && (
                                                    <ArrowDown className="w-4 h-4" />
                                                )}
                                                {header.column.getIsSorted() === 'asc' && (
                                                    <ArrowUp className="w-4 h-4" />
                                                )}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            <Pagination
                currentPage={table.getState().pagination.pageIndex + 1}
                lastPage={table.getPageCount()}
                onPageChange={(page) => table.setPageIndex(page - 1)}
            />
        </div>
    );
};

export default ProductsTable;