// admin/components/UserManagement/UsersTable.jsx
import {
    Users,
    Eye,
    UserCheck,
    UserX,
    Mail,
    Phone,
    Ban,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle
} from 'lucide-react';

const UsersTable = ({
    users,
    isLoading,
    onViewUser,
    onSuspendUser,
    onUnsuspendUser
}) => {
    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
            suspended: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Suspended' },
            banned: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Banned' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
            inactive: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Inactive' }
        };

        const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const getRoleBadge = (roles) => {
        const roleColors = {
            admin: 'bg-purple-100 text-purple-800',
            seller: 'bg-blue-100 text-blue-800',
            buyer: 'bg-green-100 text-green-800',
            user: 'bg-gray-100 text-gray-800'
        };

        const primaryRole = Array.isArray(roles) ? roles[0] : roles;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[primaryRole] || roleColors.user}`}>
                {primaryRole}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Suspensions
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No users found</p>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => {
                                const userStatus = user.user_status || 'active';
                                const isSuspended = userStatus === 'suspended' || userStatus === 'banned';
                                const suspendCount = user.suspension_count || 0;

                                return (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {user.profile_photo ? (
                                                    <img
                                                        src={user.profile_photo}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-brand-700">
                                                            {user.name?.charAt(0)?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center gap-1">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {user.email}
                                            </div>
                                            {user.phone_number && (
                                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    {user.phone_number}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRoleBadge(user.roles || 'buyer')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(userStatus)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Ban className={`w-4 h-4 ${suspendCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                                                <span className={`text-sm font-medium ${suspendCount > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                                    {suspendCount} {suspendCount === 1 ? 'time' : 'times'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onViewUser(user)}
                                                    className="text-brand-600 hover:text-brand-900 p-2 hover:bg-brand-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                {isSuspended ? (
                                                    <button
                                                        onClick={() => onUnsuspendUser(user)}
                                                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Unsuspend"
                                                    >
                                                        <UserCheck className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onSuspendUser(user)}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Suspend"
                                                    >
                                                        <UserX className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;