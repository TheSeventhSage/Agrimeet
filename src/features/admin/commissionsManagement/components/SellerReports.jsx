// admin/commission/components/SellerReports.jsx
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import adminCommissionService from '../api/adminCommissionService';

const SellerReports = () => {
    const [sellers, setSellers] = useState([]);
    const [filters, setFilters] = useState({ period: 'month', payout_status: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSellers = async () => {
            setIsLoading(true);
            try {
                const response = await adminCommissionService.getCommissionBySeller(filters);
                setSellers(response.data.data || response.data || []);
            } catch (error) {
                console.error('Failed to load seller data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSellers();
    }, [filters]);

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search sellers..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    />
                </div> */}
                <select
                    value={filters.period}
                    onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                </select>
                {/* <select
                    value={filters.payout_status}
                    onChange={(e) => setFilters({ ...filters, payout_status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="held">Held</option>
                </select> */}
            </div>

            <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Seller</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Commission</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Seller Earnings</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Orders</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                            ) : sellers.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No seller records found</td></tr>
                            ) : (
                                sellers.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{item.seller_name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">${item.total_sales}</td>
                                        <td className="px-6 py-4 font-medium text-green-600">${item.total_commission}</td>
                                        <td className="px-6 py-4 font-medium text-yellow-500">${item.total_seller_earnings}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {item.order_count}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerReports;