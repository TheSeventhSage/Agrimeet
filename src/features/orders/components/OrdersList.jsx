// components/OrdersList.jsx
import { useState } from 'react';
import { Search, Filter, Download, Calendar, X } from 'lucide-react';
import Button from '../../../shared/components/Button';
import LoadingSpinner from '../../../shared/components/Loading';
import OrderCard from './OrderCard';

const OrdersList = ({
    orders,
    isLoading,
    onViewDetails,
    onUpdateStatus,
    onPrintInvoice,
    onExportOrders,
    onApplyFilters,
    currentFilters = {}
}) => {
    const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        dateFrom: currentFilters.dateFrom || '',
        dateTo: currentFilters.dateTo || '',
        paymentMethod: currentFilters.paymentMethod || '',
        minAmount: currentFilters.minAmount || '',
        maxAmount: currentFilters.maxAmount || ''
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onApplyFilters({ ...currentFilters, search: searchTerm });
    };

    const handleApplyFilters = () => {
        onApplyFilters({
            ...currentFilters,
            ...filters,
            search: searchTerm
        });
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        setFilters({
            dateFrom: '',
            dateTo: '',
            paymentMethod: '',
            minAmount: '',
            maxAmount: ''
        });
        setSearchTerm('');
        onApplyFilters({ status: currentFilters.status });
    };

    const hasActiveFilters = Object.values({ ...filters, search: searchTerm }).some(value => value !== '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Search */}
                    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search orders, customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>
                    </form>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`relative ${hasActiveFilters ? 'border-brand-500 text-brand-600' : ''}`}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full"></span>
                                )}
                            </Button>

                            {/* Filters Dropdown */}
                            {showFilters && (
                                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-80">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900">Filter Orders</h3>
                                            <button
                                                onClick={() => setShowFilters(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Date Range */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        From Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={filters.dateFrom}
                                                        onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        To Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={filters.dateTo}
                                                        onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Payment Method */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Payment Method
                                                </label>
                                                <select
                                                    value={filters.paymentMethod}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                                                >
                                                    <option value="">All Methods</option>
                                                    <option value="Card">Card</option>
                                                    <option value="Bank Transfer">Bank Transfer</option>
                                                    <option value="Cash">Cash</option>
                                                </select>
                                            </div>

                                            {/* Amount Range */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Min Amount
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="₦0"
                                                        value={filters.minAmount}
                                                        onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Max Amount
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="₦999,999"
                                                        value={filters.maxAmount}
                                                        onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Filter Actions */}
                                        <div className="flex space-x-2 mt-6 pt-4 border-t border-gray-200">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleClearFilters}
                                                className="flex-1"
                                            >
                                                Clear All
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleApplyFilters}
                                                className="flex-1"
                                            >
                                                Apply Filters
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            onClick={onExportOrders}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-600">
                        {hasActiveFilters
                            ? "Try adjusting your search or filter criteria."
                            : "Orders will appear here once customers start placing them."
                        }
                    </p>
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            onClick={handleClearFilters}
                            className="mt-4"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Amount</th>
                                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        onViewDetails={onViewDetails}
                                        onUpdateStatus={onUpdateStatus}
                                        onPrintInvoice={onPrintInvoice}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Click outside handler for filters */}
            {showFilters && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFilters(false)}
                />
            )}
        </div>
    );
};

export default OrdersList;