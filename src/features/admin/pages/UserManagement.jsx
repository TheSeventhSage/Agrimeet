import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    Users,
    Search,
    Filter,
    Download,
    UserCheck,
    UserX,
    Trash2,
    Eye,
    MoreVertical,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Phone,
    Calendar,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import adminService from '../api/adminService';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import { showSuccess, showError } from '../../../shared/utils/alert';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [showDropdown, setShowDropdown] = useState(null);
    
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        role: 'all',
        page: 1,
        per_page: 10
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total: 0
    });

    useEffect(() => {
        loadUsers();
        loadStats();
    }, [filters]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await adminService.getUsers(filters);
            setUsers(response.data.data || response.data);
            setPagination(response.data.meta || response.data.pagination || {
                current_page: 1,
                total_pages: 1,
                total: response.data.length || 0
            });
        } catch (error) {
            console.error('Failed to load users:', error);
            showError('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await adminService.getUserStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleViewUser = async (user) => {
        try {
            const response = await adminService.getUserById(user.id);
            setSelectedUser(response.data);
            setShowUserModal(true);
        } catch (error) {
            showError('Failed to load user details');
        }
    };

    const handleSuspendUser = (user) => {
        setSelectedUser(user);
        setConfirmAction({
            type: 'suspend',
            title: 'Suspend User',
            message: `Are you sure you want to suspend ${user.name}? They will not be able to access their account.`,
            confirmText: 'Suspend',
            onConfirm: async () => {
                try {
                    await adminService.suspendUser(user.id, 'Suspended by admin');
                    showSuccess('User suspended successfully');
                    loadUsers();
                    loadStats();
                    setShowConfirmModal(false);
                } catch (error) {
                    showError('Failed to suspend user');
                }
            }
        });
        setShowConfirmModal(true);
    };

    const handleActivateUser = (user) => {
        setSelectedUser(user);
        setConfirmAction({
            type: 'activate',
            title: 'Activate User',
            message: `Are you sure you want to activate ${user.name}?`,
            confirmText: 'Activate',
            onConfirm: async () => {
                try {
                    await adminService.activateUser(user.id);
                    showSuccess('User activated successfully');
                    loadUsers();
                    loadStats();
                    setShowConfirmModal(false);
                } catch (error) {
                    showError('Failed to activate user');
                }
            }
        });
        setShowConfirmModal(true);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setConfirmAction({
            type: 'delete',
            title: 'Delete User',
            message: `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`,
            confirmText: 'Delete',
            onConfirm: async () => {
                try {
                    await adminService.deleteUser(user.id);
                    showSuccess('User deleted successfully');
                    loadUsers();
                    loadStats();
                    setShowConfirmModal(false);
                } catch (error) {
                    showError('Failed to delete user');
                }
            }
        });
        setShowConfirmModal(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
            suspended: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Suspended' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
            inactive: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Inactive' }
        };
        
        const config = statusConfig[status] || statusConfig.inactive;
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

    const statCards = [
        {
            title: 'Total Users',
            value: stats.total || 0,
            change: stats.growth || '+0%',
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'Active Users',
            value: stats.active || 0,
            change: stats.activeGrowth || '+0%',
            icon: UserCheck,
            color: 'bg-green-500'
        },
        {
            title: 'Suspended',
            value: stats.suspended || 0,
            change: stats.suspendedChange || '0',
            icon: UserX,
            color: 'bg-red-500'
        },
        {
            title: 'New This Month',
            value: stats.newThisMonth || 0,
            change: stats.monthlyGrowth || '+0%',
            icon: Users,
            color: 'bg-purple-500'
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-2">Manage all platform users and their accounts</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
                                    <p className="text-sm text-green-600 mt-2">{stat.change}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or ID..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="pending">Pending</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Role Filter */}
                        <div>
                            <select
                                value={filters.role}
                                onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="seller">Seller</option>
                                <option value="buyer">Buyer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-brand-700">
                                                            {user.name?.charAt(0)?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 flex items-center gap-1">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getRoleBadge(user.roles || user.role || 'user')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(user.status || 'active')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(user.created_at || Date.now()).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewUser(user)}
                                                        className="text-brand-600 hover:text-brand-900 p-2 hover:bg-brand-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    {user.status === 'active' ? (
                                                        <button
                                                            onClick={() => handleSuspendUser(user)}
                                                            className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                                                            title="Suspend"
                                                        >
                                                            <UserX className="w-5 h-5" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleActivateUser(user)}
                                                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Activate"
                                                        >
                                                            <UserCheck className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && users.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{((pagination.current_page - 1) * filters.per_page) + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(pagination.current_page * filters.per_page, pagination.total)}</span> of{' '}
                                <span className="font-medium">{pagination.total}</span> users
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    disabled={pagination.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {pagination.current_page} of {pagination.total_pages}
                                </span>
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    disabled={pagination.current_page === pagination.total_pages}
                                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && confirmAction && (
                <ConfirmationModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={confirmAction.onConfirm}
                    title={confirmAction.title}
                    message={confirmAction.message}
                    confirmText={confirmAction.confirmText}
                    type={confirmAction.type === 'delete' ? 'danger' : 'warning'}
                />
            )}

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                                <button
                                    onClick={() => setShowUserModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <XCircle className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-bold text-brand-700">
                                        {selectedUser.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h4>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        {getStatusBadge(selectedUser.status || 'active')}
                                        {getRoleBadge(selectedUser.roles || selectedUser.role || 'user')}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">User ID</label>
                                    <p className="text-gray-900">{selectedUser.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Phone</label>
                                    <p className="text-gray-900">{selectedUser.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Joined Date</label>
                                    <p className="text-gray-900">
                                        {new Date(selectedUser.created_at || Date.now()).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Last Login</label>
                                    <p className="text-gray-900">
                                        {selectedUser.last_login 
                                            ? new Date(selectedUser.last_login).toLocaleDateString()
                                            : 'Never'}
                                    </p>
                                </div>
                            </div>

                            {selectedUser.address && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Address</label>
                                    <p className="text-gray-900">{selectedUser.address}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default UserManagement;