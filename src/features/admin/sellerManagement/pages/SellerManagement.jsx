// admin/pages/SellerManagement.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import { Store } from 'lucide-react';
import { showError, showSuccess } from '../../../../shared/utils/alert';
import adminSellerService from '../api/adminSellerService';

// Reuse existing components
import SuspendUserModal from '../../userManagement/components/SuspendUserModal';
import ConfirmationModal from '../../../../shared/components/ConfirmationModal';

// Seller-specific components
import SellerStatsCards from '../components/SellerStatsCards';
import SellerFilters from '../components/SellerFilters';
import SellerCard from '../components/SellerCard';
import SellerDetailsModal from '../components/SellerDetailsModal';
import Pagination from '../../../../shared/components/Pagination';

const SellerManagement = () => {
    const [sellers, setSellers] = useState([]);
    const [stats, setStats] = useState({});
    const [businessTypes, setBusinessTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const [filters, setFilters] = useState({
        search_global: '',
        status: 'all',
        business_type: 'all',
        page: 1
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0,
        total: 0,
        per_page: 20
    });

    // Load sellers whenever filters change
    useEffect(() => {
        loadSellers();
    }, [filters]);

    // Load initial data
    useEffect(() => {
        loadStats();
        loadBusinessTypes();
    }, []);

    const loadSellers = async () => {
        try {
            setIsLoading(true);
            const response = await adminSellerService.getAllSellers(
                filters.page,
                20,
                {
                    search_global: filters.search_global,
                    status: filters.status,
                    business_type: filters.business_type
                }
            );

            const sellersData = response.data?.data || response.data || [];
            const meta = response.data?.meta || {};

            setSellers(sellersData);
            setPagination({
                current_page: meta.current_page || 1,
                last_page: meta.last_page || 1,
                from: meta.from || 0,
                to: meta.to || 0,
                total: meta.total || 0,
                per_page: meta.per_page || 20
            });

        } catch (error) {
            console.error('Failed to load sellers:', error);
            showError('Failed to load sellers');
            setSellers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await adminSellerService.getSellerStats();
            const meta = response.data?.meta || {};

            setStats({
                total: meta.total || 0
            });
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const loadBusinessTypes = async () => {
        try {
            const response = await adminSellerService.getBusinessTypes();
            setBusinessTypes(response.data?.data || []);
        } catch (error) {
            console.error('Failed to load business types:', error);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handlePageChange = (page) => {
        setFilters({ ...filters, page });
    };

    const handleViewDetails = (seller) => {
        setSelectedSeller(seller);
        setShowDetailsModal(true);
    };

    const handleSuspendSeller = (seller) => {
        setSelectedSeller(seller);
        setShowSuspendModal(true);
    };

    const handleUnsuspendSeller = (seller) => {
        setSelectedSeller(seller);
        setShowUnsuspendModal(true);
    };

    const confirmSuspendSeller = async (reason) => {
        if (!selectedSeller?.user?.id) return;

        try {
            setIsActionLoading(true);
            await adminSellerService.suspendSeller(selectedSeller.user.id, reason);
            showSuccess('Seller suspended successfully');
            setShowSuspendModal(false);
            setShowDetailsModal(false);
            loadSellers();
            loadStats();
        } catch (error) {
            console.error('Failed to suspend seller:', error);
            showError('Failed to suspend seller');
        } finally {
            setIsActionLoading(false);
        }
    };

    const confirmUnsuspendSeller = async () => {
        if (!selectedSeller?.user?.id) return;

        try {
            setIsActionLoading(true);
            await adminSellerService.unsuspendSeller(selectedSeller.user.id);
            showSuccess('Seller unsuspended successfully');
            setShowUnsuspendModal(false);
            setShowDetailsModal(false);
            loadSellers();
            loadStats();
        } catch (error) {
            console.error('Failed to unsuspend seller:', error);
            showError('Failed to unsuspend seller');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Transform seller to user object for SuspendUserModal
    const getSellerAsUser = (seller) => {
        if (!seller) return null;
        const user = seller.user;
        return {
            ...user,
            name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || seller.store_name || 'Unknown'
        };
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
                    <p className="text-gray-600 mt-2">Manage and monitor all sellers on the platform</p>
                </div>

                {/* Stats Cards */}
                <SellerStatsCards stats={stats} sellers={sellers} />

                {/* Filters */}
                <SellerFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    businessTypes={businessTypes}
                />

                {/* Sellers Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isLoading ? (
                        <div className="lg:col-span-2 flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        </div>
                    ) : sellers.length === 0 ? (
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-gray-100 p-12 text-center">
                            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No sellers found</p>
                            {(filters.search_global || filters.status !== 'all' || filters.business_type !== 'all') && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Try adjusting your filters
                                </p>
                            )}
                        </div>
                    ) : (
                        sellers.map((seller) => (
                            <SellerCard
                                key={seller.id}
                                seller={seller}
                                onViewDetails={handleViewDetails}
                                onSuspendSeller={handleSuspendSeller}
                                onUnsuspendSeller={handleUnsuspendSeller}
                            />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && sellers.length > 0 && (
                    <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            {/* Seller Details Modal */}
            {showDetailsModal && selectedSeller && (
                <SellerDetailsModal
                    seller={selectedSeller}
                    onClose={() => setShowDetailsModal(false)}
                    onSuspendSeller={handleSuspendSeller}
                    onUnsuspendSeller={handleUnsuspendSeller}
                />
            )}

            {/* Reuse SuspendUserModal */}
            <SuspendUserModal
                user={getSellerAsUser(selectedSeller)}
                isOpen={showSuspendModal}
                onClose={() => setShowSuspendModal(false)}
                onConfirm={confirmSuspendSeller}
                isLoading={isActionLoading}
            />

            {/* Reuse ConfirmationModal for Unsuspend */}
            <ConfirmationModal
                isOpen={showUnsuspendModal}
                onClose={() => setShowUnsuspendModal(false)}
                onConfirm={confirmUnsuspendSeller}
                title="Unsuspend Seller"
                message={`Are you sure you want to unsuspend ${selectedSeller?.user
                        ? `${selectedSeller.user.first_name} ${selectedSeller.user.last_name}`
                        : selectedSeller?.store_name
                    }? This will restore their access to the platform.`}
                confirmText="Unsuspend"
                confirmButtonClass="bg-green-600 hover:bg-green-700"
                isLoading={isActionLoading}
            />
        </DashboardLayout>
    );
};

export default SellerManagement;