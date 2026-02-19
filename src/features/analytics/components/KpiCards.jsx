// components/KpiCards.jsx

import { useQuery } from '@tanstack/react-query';
import { DollarSign, Users, Package, Star } from 'lucide-react';
import { DataErrorState } from './ChartComponents';
import { getVendorStats } from '../api/analyticsApi';
import { LoadingSpinner } from '../../../shared/components/Loader';
import { NairaIcon } from '../../../shared/components/Currency';

const NGN = NairaIcon

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 1,
    }).format(amount);

const formatCompact = (num) => {
    return Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(num);
};

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
            value: +stats?.total_revenue || 0, // Keep as Number
            icon: NGN,
            color: 'text-green-600',
            isCurrency: true, // Add this flag
        },
        {
            title: 'Total Reviews',
            value: +stats?.total_reviews || 0,
            icon: Users,
            color: 'text-blue-600',
            isCurrency: false,
        },
        {
            title: 'Total Products',
            value: +stats?.total_products || 0,
            icon: Package,
            color: 'text-brand-600',
            isCurrency: false,
        },
        {
            title: 'Total Orders',
            value: +stats?.total_orders || 0, // Keep as Number
            icon: Star,
            color: 'text-yellow-500',
            isCurrency: false,
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
                                className={`mt-2 font-bold ${card.isText ? 'text-sm truncate' : 'text-xl'
                                    }`}
                            >
                                {card.value >= 1000000
                                    ? (card.isCurrency ? '₦' : '') + formatCompact(card.value)
                                    : (card.isCurrency ? formatCurrency(card.value) : card.value)
                                }
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