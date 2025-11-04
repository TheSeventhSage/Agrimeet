// admin/components/sellers/SellerFilters.jsx
import { useState } from 'react';
import { Search } from 'lucide-react';

const SellerFilters = ({ filters, onFilterChange, businessTypes = [] }) => {
    const [searchInput, setSearchInput] = useState(filters.search_global || '');

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onFilterChange({ ...filters, search_global: searchInput.trim(), page: 1 });
        }
    };

    const handleSearchClear = () => {
        setSearchInput('');
        onFilterChange({ ...filters, search_global: '', page: 1 });
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        onFilterChange({ ...filters, status: newStatus, page: 1 });
    };

    const handleBusinessTypeChange = (e) => {
        const newBusinessType = e.target.value;
        onFilterChange({ ...filters, business_type: newBusinessType, page: 1 });
    };

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search sellers... (Press Enter)"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                        />
                        {searchInput && (
                            <button
                                onClick={handleSearchClear}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Press Enter to search</p>
                </div>

                {/* KYC Status Filter */}
                <div>
                    <select
                        value={filters.status || ''}
                        onChange={(e) => onFilterChange({ ...filters, status: e.target.value, page: 1 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="all">All KYC Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Business Type Filter */}
                <div>
                    <select
                        value={filters.business_type || ''}
                        onChange={(e) => onFilterChange({ ...filters, business_type: e.target.value, page: 1 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="all">All Business Types</option>
                        {businessTypes.map((type) => (
                            <option key={type.id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SellerFilters;