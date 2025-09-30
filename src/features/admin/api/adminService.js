// Admin API Service
import axios from 'axios';
import { storageManager } from '../../../pages/utils/storageManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.agrimeet.com';

// Create axios instance with default config
const adminApi = axios.create({
    baseURL: `${API_BASE_URL}/api/admin`,
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
    async getUsers(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.role) params.append('role', filters.role);
        if (filters.page) params.append('page', filters.page);
        if (filters.per_page) params.append('per_page', filters.per_page);
        
        return adminApi.get(`/users?${params.toString()}`);
    },

    async getUserById(userId) {
        return adminApi.get(`/users/${userId}`);
    },

    async suspendUser(userId, reason) {
        return adminApi.post(`/users/${userId}/suspend`, { reason });
    },

    async activateUser(userId) {
        return adminApi.post(`/users/${userId}/activate`);
    },

    async deleteUser(userId) {
        return adminApi.delete(`/users/${userId}`);
    },

    async getUserStats() {
        return adminApi.get('/users/stats');
    },

    // ============ SELLER APPROVAL ============
    async getPendingKyc(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page);
        
        return adminApi.get(`/kyc/pending?${params.toString()}`);
    },

    async getKycById(kycId) {
        return adminApi.get(`/kyc/${kycId}`);
    },

    async approveKyc(kycId, notes) {
        return adminApi.post(`/kyc/${kycId}/approve`, { notes });
    },

    async rejectKyc(kycId, reason) {
        return adminApi.post(`/kyc/${kycId}/reject`, { reason });
    },

    async getKycStats() {
        return adminApi.get('/kyc/stats');
    },

    // ============ PRODUCT MODERATION ============
    async getPendingProducts(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page);
        
        return adminApi.get(`/products/pending?${params.toString()}`);
    },

    async getProductById(productId) {
        return adminApi.get(`/products/${productId}`);
    },

    async approveProduct(productId, notes) {
        return adminApi.post(`/products/${productId}/approve`, { notes });
    },

    async rejectProduct(productId, reason) {
        return adminApi.post(`/products/${productId}/reject`, { reason });
    },

    async getProductStats() {
        return adminApi.get('/products/stats');
    },

    // ============ TRANSACTION OVERSIGHT ============
    async getTransactions(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.type) params.append('type', filters.type);
        if (filters.date_from) params.append('date_from', filters.date_from);
        if (filters.date_to) params.append('date_to', filters.date_to);
        if (filters.page) params.append('page', filters.page);
        
        return adminApi.get(`/transactions?${params.toString()}`);
    },

    async getTransactionById(transactionId) {
        return adminApi.get(`/transactions/${transactionId}`);
    },

    async getTransactionStats() {
        return adminApi.get('/transactions/stats');
    },

    async exportTransactions(filters = {}) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        
        const response = await adminApi.get(`/transactions/export?${params.toString()}`, {
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
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.page) params.append('page', filters.page);
        
        return adminApi.get(`/disputes?${params.toString()}`);
    },

    async getDisputeById(disputeId) {
        return adminApi.get(`/disputes/${disputeId}`);
    },

    async updateDisputeStatus(disputeId, status, resolution) {
        return adminApi.post(`/disputes/${disputeId}/status`, { status, resolution });
    },

    async addDisputeNote(disputeId, note) {
        return adminApi.post(`/disputes/${disputeId}/notes`, { note });
    },

    async resolveDispute(disputeId, resolution, refundAmount) {
        return adminApi.post(`/disputes/${disputeId}/resolve`, { resolution, refundAmount });
    },

    async getDisputeStats() {
        return adminApi.get('/disputes/stats');
    },

    // ============ REPORTS & ANALYTICS ============
    async getDashboardStats() {
        return adminApi.get('/dashboard/stats');
    },

    async getRevenueAnalytics(period = '30days') {
        return adminApi.get(`/analytics/revenue?period=${period}`);
    },

    async getUserGrowthAnalytics(period = '30days') {
        return adminApi.get(`/analytics/users?period=${period}`);
    },

    async getProductAnalytics(period = '30days') {
        return adminApi.get(`/analytics/products?period=${period}`);
    },

    async getOrderAnalytics(period = '30days') {
        return adminApi.get(`/analytics/orders?period=${period}`);
    },

    async getPlatformMetrics() {
        return adminApi.get('/analytics/metrics');
    },

    async exportReport(reportType, filters = {}) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        
        const response = await adminApi.get(`/reports/${reportType}/export?${params.toString()}`, {
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
};

export default adminService;