// Admin API Service - Integrated with AgriMeet API v1
import axios from 'axios';
import { storageManager } from '../../../pages/utils/storageManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agrimeet.udehcoglobalfoodsltd.com';

// Create axios instance with default config
const adminApi = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
adminApi.interceptors.request.use(
    (config) => {
        const token = storageManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Admin Service Methods
const adminService = {
    // ============ USER MANAGEMENT ============
    // Note: These endpoints need to be implemented on the backend
    // The frontend is ready for when they're available
    
    async getUsers(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.role) params.append('role', filters.role);
        if (filters.page) params.append('page', filters.page);
        if (filters.per_page) params.append('per_page', filters.per_page);
        
        // TODO: Implement on backend as /admin/users
        // For now, returning mock structure
        return {
            data: {
                data: [],
                meta: {
                    current_page: 1,
                    total_pages: 1,
                    total: 0
                }
            }
        };
        // return adminApi.get(`/admin/users?${params.toString()}`);
    },

    async getUserById(userId) {
        // Using existing /buyer/users/{id} endpoint
        return adminApi.get(`/buyer/users/${userId}`);
    },

    async suspendUser(userId, reason) {
        // TODO: Implement on backend as /admin/users/{id}/suspend
        return adminApi.post(`/admin/users/${userId}/suspend`, { reason });
    },

    async activateUser(userId) {
        // TODO: Implement on backend as /admin/users/{id}/activate
        return adminApi.post(`/admin/users/${userId}/activate`);
    },

    async deleteUser(userId) {
        // Using existing /buyer/users/{id} endpoint
        return adminApi.delete(`/buyer/users/${userId}`);
    },

    async getUserStats() {
        // TODO: Implement on backend as /admin/users/stats
        return {
            data: {
                total: 0,
                active: 0,
                suspended: 0,
                newThisMonth: 0,
                growth: '+0%'
            }
        };
        // return adminApi.get('/admin/users/stats');
    },

    // ============ SELLER APPROVAL (KYC) ============
    // Using existing KYC endpoints
    
    async getPendingKyc(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status || 'pending');
        if (filters.page) params.append('page', filters.page);
        
        // TODO: Implement on backend as /admin/kyc/pending
        // Return mock data for now
        return {
            data: {
                data: [],
                meta: {
                    current_page: 1,
                    total_pages: 1,
                    total: 0
                }
            }
        };
        // return adminApi.get(`/admin/kyc/pending?${params.toString()}`);
    },

    async getKycById(kycId) {
        // TODO: Implement on backend as /admin/kyc/{id}
        return adminApi.get(`/admin/kyc/${kycId}`);
    },

    async approveKyc(kycId, notes) {
        // Using existing /seller/kyc/{submission}/review endpoint
        return adminApi.put(`/seller/kyc/${kycId}/review`, {
            status: 'approved',
            admin_notes: notes
        });
    },

    async rejectKyc(kycId, reason) {
        // Using existing /seller/kyc/{submission}/review endpoint
        return adminApi.put(`/seller/kyc/${kycId}/review`, {
            status: 'rejected',
            admin_notes: reason
        });
    },

    async getKycStats() {
        // TODO: Implement on backend as /admin/kyc/stats
        return {
            data: {
                pending: 0,
                approvedToday: 0,
                totalApproved: 0,
                rejected: 0
            }
        };
        // return adminApi.get('/admin/kyc/stats');
    },

    // ============ PRODUCT MODERATION ============
    
    async getPendingProducts(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search_global', filters.search);
        if (filters.category) params.append('category_name', filters.category);
        if (filters.status) params.append('status', filters.status || 'draft');
        if (filters.page) params.append('page', filters.page);
        params.append('per_page', 12);
        
        // Using existing /allproducts endpoint with status filter
        return adminApi.get(`/allproducts?${params.toString()}`);
    },

    async getProductById(productId) {
        // Using existing /seller/products/{id}/show_product endpoint
        return adminApi.get(`/seller/products/${productId}/show_product`);
    },

    async approveProduct(productId, notes) {
        // TODO: Implement on backend as /admin/products/{id}/approve
        // For now, can update product status
        return adminApi.put(`/seller/products/${productId}`, {
            status: 'active',
            admin_notes: notes
        });
    },

    async rejectProduct(productId, reason) {
        // TODO: Implement on backend as /admin/products/{id}/reject
        // For now, can update product status
        return adminApi.put(`/seller/products/${productId}`, {
            status: 'inactive',
            admin_notes: reason
        });
    },

    async getProductStats() {
        // TODO: Implement on backend as /admin/products/stats
        return {
            data: {
                pending: 0,
                approvedToday: 0,
                totalApproved: 0,
                rejected: 0
            }
        };
        // return adminApi.get('/admin/products/stats');
    },

    // ============ TRANSACTION OVERSIGHT ============
    
    async getTransactions(filters = {}) {
        // TODO: Implement on backend as /admin/transactions
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.type) params.append('type', filters.type);
        if (filters.date_from) params.append('date_from', filters.date_from);
        if (filters.date_to) params.append('date_to', filters.date_to);
        if (filters.page) params.append('page', filters.page);
        
        return {
            data: {
                data: [],
                meta: {
                    current_page: 1,
                    total_pages: 1,
                    total: 0
                }
            }
        };
        // return adminApi.get(`/admin/transactions?${params.toString()}`);
    },

    async getTransactionById(transactionId) {
        // TODO: Implement on backend as /admin/transactions/{id}
        return adminApi.get(`/admin/transactions/${transactionId}`);
    },

    async getTransactionStats() {
        // TODO: Implement on backend as /admin/transactions/stats
        return {
            data: {
                totalRevenue: 0,
                todayTransactions: 0,
                pendingCount: 0,
                pendingAmount: 0,
                failedCount: 0,
                revenueGrowth: '+0%'
            }
        };
        // return adminApi.get('/admin/transactions/stats');
    },

    async exportTransactions(filters = {}) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        
        // TODO: Implement on backend as /admin/transactions/export
        const response = await adminApi.get(`/admin/transactions/export?${params.toString()}`, {
            responseType: 'blob'
        });
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        return response;
    },

    // ============ DISPUTE MANAGEMENT ============
    
    async getDisputes(filters = {}) {
        // TODO: Implement on backend as /admin/disputes
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.page) params.append('page', filters.page);
        
        return {
            data: {
                data: [],
                meta: {
                    current_page: 1,
                    total_pages: 1,
                    total: 0
                }
            }
        };
        // return adminApi.get(`/admin/disputes?${params.toString()}`);
    },

    async getDisputeById(disputeId) {
        // TODO: Implement on backend as /admin/disputes/{id}
        return adminApi.get(`/admin/disputes/${disputeId}`);
    },

    async updateDisputeStatus(disputeId, status, resolution) {
        // TODO: Implement on backend as /admin/disputes/{id}/status
        return adminApi.post(`/admin/disputes/${disputeId}/status`, { status, resolution });
    },

    async addDisputeNote(disputeId, note) {
        // TODO: Implement on backend as /admin/disputes/{id}/notes
        return adminApi.post(`/admin/disputes/${disputeId}/notes`, { note });
    },

    async resolveDispute(disputeId, resolution, refundAmount) {
        // TODO: Implement on backend as /admin/disputes/{id}/resolve
        return adminApi.post(`/admin/disputes/${disputeId}/resolve`, { resolution, refundAmount });
    },

    async getDisputeStats() {
        // TODO: Implement on backend as /admin/disputes/stats
        return {
            data: {
                open: 0,
                inProgress: 0,
                resolvedToday: 0,
                totalResolved: 0
            }
        };
        // return adminApi.get('/admin/disputes/stats');
    },

    // ============ REPORTS & ANALYTICS ============
    
    async getDashboardStats() {
        // TODO: Implement on backend as /admin/dashboard/stats
        // For now, aggregate data from existing endpoints
        return {
            data: {
                stats: {
                    totalUsers: 0,
                    activeProducts: 0,
                    totalRevenue: 0,
                    totalOrders: 0,
                    userGrowth: '+0%',
                    productGrowth: '+0%',
                    revenueGrowth: '+0%',
                    orderGrowth: '+0%',
                    pendingKyc: 0,
                    pendingProducts: 0,
                    openDisputes: 0,
                    activeToday: 0
                },
                activities: []
            }
        };
        // return adminApi.get('/admin/dashboard/stats');
    },

    async getRevenueAnalytics(period = '30days') {
        // TODO: Implement on backend as /admin/analytics/revenue
        return {
            data: {
                total: 0,
                growth: '+0%',
                chartData: []
            }
        };
        // return adminApi.get(`/admin/analytics/revenue?period=${period}`);
    },

    async getUserGrowthAnalytics(period = '30days') {
        // TODO: Implement on backend as /admin/analytics/users
        return {
            data: {
                newUsers: 0,
                activeUsers: 0,
                retentionRate: 0,
                growth: '+0%'
            }
        };
        // return adminApi.get(`/admin/analytics/users?period=${period}`);
    },

    async getProductAnalytics(period = '30days') {
        // TODO: Implement on backend as /admin/analytics/products
        return {
            data: {
                topProducts: [],
                topCategories: [],
                totalProducts: 0
            }
        };
        // return adminApi.get(`/admin/analytics/products?period=${period}`);
    },

    async getOrderAnalytics(period = '30days') {
        // TODO: Implement on backend as /admin/analytics/orders
        return {
            data: {
                totalOrders: 0,
                completedRate: 0,
                pending: 0,
                shipped: 0,
                cancelled: 0
            }
        };
        // return adminApi.get(`/admin/analytics/orders?period=${period}`);
    },

    async getPlatformMetrics() {
        // TODO: Implement on backend as /admin/analytics/metrics
        return {
            data: {
                totalRevenue: 0,
                totalUsers: 0,
                totalOrders: 0,
                activeProducts: 0,
                avgOrderValue: 0,
                conversionRate: 0,
                activeSellers: 0,
                satisfaction: 0,
                topSellers: []
            }
        };
        // return adminApi.get('/admin/analytics/metrics');
    },

    async exportReport(reportType, filters = {}) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        
        // TODO: Implement on backend as /admin/reports/{reportType}/export
        const response = await adminApi.get(`/admin/reports/${reportType}/export?${params.toString()}`, {
            responseType: 'blob'
        });
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportType}_report_${Date.now()}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        return response;
    },

    // ============ EXISTING API INTEGRATIONS ============
    // Methods that use your actual API endpoints
    
    // Business Types
    async getBusinessTypes() {
        return adminApi.get('/admin/business_types');
    },

    async createBusinessType(data) {
        return adminApi.post('/admin/business_types', data);
    },

    async updateBusinessType(id, data) {
        return adminApi.put(`/admin/business_types/${id}`, data);
    },

    async deleteBusinessType(id) {
        return adminApi.delete(`/admin/business_types/${id}`);
    },

    // Categories
    async getCategories() {
        return adminApi.get('/admin/categories');
    },

    async getAllCategories() {
        return adminApi.get('/allcategories');
    },

    async createCategory(formData) {
        return adminApi.post('/admin/categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    async updateCategory(id, formData) {
        return adminApi.put(`/admin/categories/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    async deleteCategory(id) {
        return adminApi.delete(`/admin/categories/${id}`);
    },

    async getSubcategories(categoryId) {
        return adminApi.get(`/admin/${categoryId}/subcategories`);
    },

    // Units
    async getUnits() {
        return adminApi.get('/admin/units');
    },

    async getAllUnits() {
        return adminApi.get('/seller/products/allUnits');
    },

    async createUnit(data) {
        return adminApi.post('/admin/units', data);
    },

    async updateUnit(id, data) {
        return adminApi.put(`/admin/units/${id}`, data);
    },

    async deleteUnit(id) {
        return adminApi.delete(`/admin/units/${id}`);
    },

    // Coupons
    async getCoupons(page = 1) {
        return adminApi.get(`/buyer/coupons?page=${page}`);
    },

    async createCoupon(data) {
        return adminApi.post('/admin/coupons', data);
    },

    async getCouponById(id) {
        return adminApi.get(`/buyer/coupons/${id}`);
    },

    async updateCoupon(id, data) {
        return adminApi.put(`/admin/coupons/${id}`, data);
    },

    async deleteCoupon(id) {
        return adminApi.delete(`/admin/coupons/${id}`);
    },

    async validateCoupon(code) {
        return adminApi.post('/buyer/coupons/validate', { code });
    },

    // Products (Seller endpoints - can be used for admin)
    async getSellerProducts(page = 1) {
        return adminApi.get(`/seller/products?page=${page}`);
    },

    async getAllProducts(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search_global) params.append('search_global', filters.search_global);
        if (filters.category_name) params.append('category_name', filters.category_name);
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page);
        if (filters.per_page) params.append('per_page', filters.per_page);
        
        return adminApi.get(`/allproducts?${params.toString()}`);
    },
};

export default adminService;