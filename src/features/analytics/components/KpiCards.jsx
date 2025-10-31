// components/KpiCards.jsx

import { useQuery } from '@tanstack/react-query';
import { getVendorStats } from '../api/analyticsApi';
import { DollarSign, Users, Package, Star } from 'lucide-react';
import { LoadingSpinner } from '../../../shared/components/Loader';
import { DataErrorState } from './ChartComponents';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);

const KpiCards = ({ filters }) => {
    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['vendorStats', filters],
        queryFn: () => getVendorStats(filters),
    });

    const stats = response?.data;

    const kpiData = [
        {
            title: 'Total Revenue',
            // ✅ FIX: Coerce total_revenue to a number before formatting
            value: formatCurrency(+stats?.total_revenue || 0),
            icon: DollarSign,
            color: 'text-green-600',
        },
        {
            title: 'Total Customers',
            // ✅ FIX: Coerce total_customers to a number
            value: +stats?.total_customers || 0,
            icon: Users,
            color: 'text-blue-600',
        },
        {
            title: 'Products Sold',
            // ✅ FIX: Coerce total_products_sold to a number
            value: +stats?.total_products_sold || 0,
            icon: Package,
            color: 'text-brand-600',
        },
        {
            title: 'Avg. Order Value',
            // ✅ FIX: Coerce average_order_value to a number
            value: formatCurrency(+stats?.average_order_value || 0),
            icon: Star,
            color: 'text-yellow-500',
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 h-32 flex items-center justify-center"
                    >
                        <LoadingSpinner />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return <DataErrorState message={error.message} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-xs border border-gray-100 p-6"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">
                                {card.title}
                            </p>
                            <p
                                className={`mt-2 font-bold ${card.isText ? 'text-xl truncate' : 'text-3xl'
                                    }`}
                            >
                                {card.value}
                            </p>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KpiCards;