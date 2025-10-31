import { Users, UserCheck, UserX } from 'lucide-react';

const UserStatsCards = ({ stats, isLoading }) => {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.total || 0,
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'Active Users',
            value: stats.active || 0,
            icon: UserCheck,
            color: 'bg-green-500'
        },
        {
            title: 'Suspended',
            value: stats.suspended || 0,
            icon: UserX,
            color: 'bg-red-500'
        },
        {
            title: 'New This Month',
            value: stats.newThisMonth || 0,
            icon: Users,
            color: 'bg-purple-500'
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
                            {isLoading ? (
                                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
                            ) : (
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {stat.value.toLocaleString()}
                                </p>
                            )}
                            <p className="text-sm text-green-600 mt-2">{stat.change}</p>
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

export default UserStatsCards;