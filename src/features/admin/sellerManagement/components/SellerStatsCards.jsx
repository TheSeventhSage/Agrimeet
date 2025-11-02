// admin/components/sellers/SellerStatsCards.jsx
import { Store, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

const SellerStatsCards = ({ stats, sellers }) => {
    // Calculate stats from sellers data
    const calculateStats = () => {
        if (!sellers || sellers.length === 0) {
            return {
                total: stats.total || 0,
                verified: 0,
                pending: 0,
                rejected: 0,
                suspended: 0
            };
        }

        const verified = sellers.filter(s => s.latest_kyc?.status === 'approved').length;
        const pending = sellers.filter(s => s.latest_kyc?.status === 'pending' || !s.latest_kyc).length;
        const rejected = sellers.filter(s => s.latest_kyc?.status === 'rejected').length;
        const suspended = sellers.filter(s => s.user?.user_status === 'suspended' || s.user?.user_status === 'banned').length;

        return {
            total: stats.total || sellers.length,
            verified,
            pending,
            rejected,
            suspended
        };
    };

    const calculatedStats = calculateStats();

    const statCards = [
        {
            title: 'Total Sellers',
            value: calculatedStats.total,
            icon: Store,
            color: 'bg-blue-500'
        },
        {
            title: 'KYC Approved',
            value: calculatedStats.verified,
            icon: CheckCircle,
            color: 'bg-green-500'
        },
        {
            title: 'KYC Pending',
            value: calculatedStats.pending,
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            title: 'Suspended',
            value: calculatedStats.suspended,
            icon: AlertTriangle,
            color: 'bg-red-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {stat.value.toLocaleString()}
                            </p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SellerStatsCards;