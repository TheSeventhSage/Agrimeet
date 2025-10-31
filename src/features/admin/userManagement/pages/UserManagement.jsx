// admin/pages/UserManagement/UserManagement.jsx
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import { showSuccess, showError } from '../../../../shared/utils/alert';
import { getErrorMessage } from '../../../../shared/utils/apiClient';
import adminUserService from '../api/adminUserService';
import ConfirmationModal from '../../../../shared/components/ConfirmationModal';

// Import sub-components
import UserStatsCards from '../components/UserStatsCards';
import UserFilters from '../components/UserFilters';
import UsersTable from '../components/UsersTable';
import UserDetailsModal from '../components/UserDetailsModal';
import SuspendUserModal from '../components/SuspendUserModal';
import TablePagination from '../components/TablePagination';

const UserManagement = () => {
    // State Management
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Modal States
    const [showUserModal, setShowUserModal] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);

    // Filters and Pagination
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        sortBy: '',
        sortOrder: 'desc',
        page: 1,
        per_page: 20
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        from: 0,
        to: 0
    });

    // Prevent multiple simultaneous calls
    const loadUsersRef = useRef(false);
    const initialLoadRef = useRef(false);

    // Load users when filters change (except search)
    useEffect(() => {
        if (!initialLoadRef.current) return; // Skip until initial load
        loadUsers();
    }, [filters.page, filters.status, filters.sortBy]);

    // Debounce search
    useEffect(() => {
        if (!initialLoadRef.current) return; // Skip until initial load

        const timer = setTimeout(() => {
            if (filters.search || filters.search === '') {
                loadUsers();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [filters.search]);

    // Load users on mount only once
    useEffect(() => {
        if (!initialLoadRef.current) {
            initialLoadRef.current = true;
            loadUsers();
        }
    }, []);

    // Calculate stats from users data
    useEffect(() => {
        if (users.length > 0) {
            calculateStats(users);
        }
    }, [users]);

    // Calculate statistics from user data
    const calculateStats = (usersData) => {
        const activeUsers = usersData.filter(u => u.user_status?.toLowerCase() === 'active').length;
        const suspendedUsers = usersData.filter(u =>
            u.user_status?.toLowerCase() === 'suspended' ||
            u.user_status?.toLowerCase() === 'banned'
        ).length;

        setStats({
            total: pagination.total || usersData.length,
            active: activeUsers,
            suspended: suspendedUsers,
            newThisMonth: 0, // This would need a specific API endpoint
            growth: '+0%',
            activeGrowth: '+0%',
            suspendedChange: '0',
            monthlyGrowth: '+0%'
        });
    };

    // Data Loading Functions
    const loadUsers = async () => {
        // Prevent multiple simultaneous calls
        if (loadUsersRef.current) {
            console.log('Load already in progress, skipping...');
            return;
        }

        try {
            loadUsersRef.current = true;
            setIsLoading(true);

            const filterParams = {
                search_global: filters.search,
                status: filters.status,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
            };

            const response = await adminUserService.getAllCustomers(
                filters.page,
                filters.per_page,
                filterParams
            );

            const responseData = response.data;
            console.log(responseData)
            // Handle nested data structure from Laravel pagination
            if (response.data && Array.isArray(response.data)) {
                setUsers(response.data);
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setUsers(response.data.data);
            } else {
                setUsers([]);
            }

            if (responseData.meta) {
                setPagination({
                    current_page: responseData.meta.current_page || 1,
                    last_page: responseData.meta.last_page || 1,
                    total: responseData.meta.total || 0,
                    from: responseData.meta.from || 0,
                    to: responseData.meta.to || 0
                });
            }
        } catch (error) {
            console.error('Failed to load users:', error);
            // Only show error if it's not a duplicate request
            if (!error.message?.includes('aborted')) {
                showError(getErrorMessage(error));
            }
        } finally {
            setIsLoading(false);
            loadUsersRef.current = false;
        }
    };

    // Action Handlers
    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleSuspendUser = (user) => {
        setSelectedUser(user);
        setShowSuspendModal(true);
    };

    const handleConfirmSuspend = async (reason) => {
        if (!selectedUser) return;

        try {
            setActionLoading(true);
            const response = await adminUserService.suspendUser(selectedUser.id, reason);

            if (response.message) {
                showSuccess(response.message);
            } else {
                showSuccess('User suspended successfully');
            }

            setShowSuspendModal(false);
            setSelectedUser(null);
            loadUsers();
        } catch (error) {
            console.error('Failed to suspend user:', error);
            showError(getErrorMessage(error));
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnsuspendUser = (user) => {
        setSelectedUser(user);
        setShowUnsuspendModal(true);
    };

    const handleConfirmUnsuspend = async () => {
        if (!selectedUser) return;

        try {
            setActionLoading(true);
            const response = await adminUserService.unsuspendUser(selectedUser.id);

            if (response.message) {
                showSuccess(response.message);
            } else {
                showSuccess('User unsuspended successfully');
            }

            setShowUnsuspendModal(false);
            setSelectedUser(null);
            loadUsers();
        } catch (error) {
            console.error('Failed to unsuspend user:', error);
            showError(getErrorMessage(error));
        } finally {
            setActionLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setFilters({ ...filters, page: newPage });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-2">Manage all platform users and their accounts</p>
                </div>

                {/* Stats Cards */}
                <UserStatsCards stats={stats} isLoading={false} />

                {/* Filters */}
                <UserFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                {/* Users Table */}
                <UsersTable
                    users={users}
                    isLoading={isLoading}
                    onViewUser={handleViewUser}
                    onSuspendUser={handleSuspendUser}
                    onUnsuspendUser={handleUnsuspendUser}
                />

                {/* Pagination */}
                {!isLoading && users.length > 0 && (
                    <TablePagination
                        pagination={pagination}
                        filters={filters}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                    />
                )}
            </div>

            {/* User Details Modal */}
            <UserDetailsModal
                user={selectedUser}
                isOpen={showUserModal}
                onClose={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                }}
            />

            {/* Suspend User Modal */}
            <SuspendUserModal
                user={selectedUser}
                isOpen={showSuspendModal}
                onClose={() => {
                    setShowSuspendModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleConfirmSuspend}
                isLoading={actionLoading}
            />

            {/* Unsuspend Confirmation Modal */}
            {showUnsuspendModal && selectedUser && (
                <ConfirmationModal
                    isOpen={showUnsuspendModal}
                    onClose={() => {
                        setShowUnsuspendModal(false);
                        setSelectedUser(null);
                    }}
                    onConfirm={handleConfirmUnsuspend}
                    title="Unsuspend User"
                    message={`Are you sure you want to unsuspend ${selectedUser.name}? They will regain access to the platform.`}
                    confirmText="Unsuspend"
                    type="success"
                    isLoading={actionLoading}
                />
            )}
        </DashboardLayout>
    );
};

export default UserManagement;