// router.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import { LoadingSpinner } from '../shared/components/Loader';

// Lazy load all components
/** Home page */
const HomePage = lazy(() => import('../pages/HomePage'));
const PublicProductDetails = lazy(() => import('../pages/ProductDetailsPage'));
const BuyerApp = lazy(() => import('../pages/BuyerAppRedirect'));
const HelpSupport = lazy(() => import('../pages/HelpSupport'));
const AppDemo = lazy(() => import('../Add.demo'));
/** Auth pages */
const KycRegister = lazy(() => import('../pages/KycRegister'));
const KycPending = lazy(() => import('../pages/KycPending'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const VerifyOtp = lazy(() => import('../pages/VerifyOtp'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
/** Seller pages */
const Dashboard = lazy(() => import('../features/dashboard/pages/Dashboard'));
const ViewProfile = lazy(() => import('../features/dashboard/pages/ViewProfile'));
const Settings = lazy(() => import('../features/dashboard/pages/Settings'));
const ProductGrid = lazy(() => import('../features/products/pages/Product'));
const AddProduct = lazy(() => import('../features/products/pages/AddProduct'));
const AddVariant = lazy(() => import('../features/products/pages/AddVariant'));
const ProductDetails = lazy(() => import('../features/products/pages/ProductDetails'));
const VariantsList = lazy(() => import('../features/products/pages/VariantsList'));
const EditProduct = lazy(() => import('../features/products/pages/EditProduct'));
const EditVariant = lazy(() => import('../features/products/pages/EditVariant'));
const Analytics = lazy(() => import('../features/analytics/page/Analytics'));
const Messages = lazy(() => import('../features/messages/pages/Messages'));
const Reviews = lazy(() => import('../features/messages/pages/Reviews'));
const KYCPage = lazy(() => import('../features/kyc/pages/KycVerify'));
const KYCStatusPage = lazy(() => import('../features/kyc/pages/KycVerified'));
const Payouts = lazy(() => import('../features/payouts/pages/Payouts'));
const Orders = lazy(() => import('../features/orders/pages/Orders'));
/** Admin pages */
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard'));
const UserManagement = lazy(() => import('../features/admin/pages/UserManagement'));
const SellerApproval = lazy(() => import('../features/admin/pages/SellerApproval'));
const ProductModeration = lazy(() => import('../features/admin/pages/ProductModeration'));
const TransactionOversight = lazy(() => import('../features/admin/pages/TransactionOversight'));
const DisputeManagement = lazy(() => import('../features/admin/pages/DisputeManagement'));
const ReportsAnalytics = lazy(() => import('../features/admin/pages/ReportsAnalytics'));
const AdminDebug = lazy(() => import('../features/admin/pages/AdmiDebug'));

const NotFound = () => <div className="p-8">404 — Not found</div>;

export default function Router() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* Home routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/test" element={<AppDemo />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/index" element={<HomePage />} />
                <Route path="/details/:productId" element={<PublicProductDetails />} />
                <Route path="/product/download" element={<BuyerApp />} />

                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/help-support" element={<HelpSupport />} />
                <Route path="/kyc-register" element={<KycRegister />} />
                <Route path="/kyc-pending" element={<KycPending />} />

                {/* Vendor Dashboard routes */}
                <Route path="/dashboard" element={<ProtectedRoutes allowedRoles={['seller']}><Dashboard /></ProtectedRoutes>} />
                <Route path="/profile" element={<ProtectedRoutes allowedRoles={['seller']}><ViewProfile /></ProtectedRoutes>} />
                <Route path="/settings" element={<ProtectedRoutes allowedRoles={['seller']}><Settings /></ProtectedRoutes>} />
                {/* Product routes */}
                <Route path="/products" element={<ProtectedRoutes allowedRoles={['seller']}><ProductGrid /></ProtectedRoutes>} />
                <Route path="/products/add" element={<ProtectedRoutes allowedRoles={['seller']}><AddProduct /></ProtectedRoutes>} />
                <Route path="/products/:productId/variants/add" element={<ProtectedRoutes allowedRoles={['seller']}><AddVariant /></ProtectedRoutes>} />
                <Route path="/products/:id" element={<ProtectedRoutes allowedRoles={['seller']}><ProductDetails /></ProtectedRoutes>} />
                <Route path="/products/edit/:id" element={<ProtectedRoutes allowedRoles={['seller']}><EditProduct /></ProtectedRoutes>} />
                <Route path="/products/:productId/variants" element={<ProtectedRoutes allowedRoles={['seller']}><VariantsList /></ProtectedRoutes>} />
                <Route path="/products/:productId/variants/:variantId/edit" element={<ProtectedRoutes allowedRoles={['seller']}><EditVariant /></ProtectedRoutes>} />
                {/* Messages */}
                <Route path="/messages" element={<ProtectedRoutes allowedRoles={['seller']}><Messages /></ProtectedRoutes>} />
                <Route path="/reviews" element={<ProtectedRoutes allowedRoles={['seller']}><Reviews /></ProtectedRoutes>} />
                {/* Analytics */}
                <Route path="/analytics" element={<ProtectedRoutes allowedRoles={['seller']}><Analytics /></ProtectedRoutes>} />
                {/* KYC routes */}
                <Route path="/kyc" element={<ProtectedRoutes allowedRoles={['seller']}><KYCPage /></ProtectedRoutes>} />
                <Route path="/kyc/status" element={<ProtectedRoutes allowedRoles={['seller']}><KYCStatusPage /></ProtectedRoutes>} />
                {/* Payouts */}
                <Route path="/payouts" element={<ProtectedRoutes allowedRoles={['seller']}><Payouts /></ProtectedRoutes>} />
                {/* Orders */}
                <Route path="/orders" element={<ProtectedRoutes allowedRoles={['seller']}><Orders /></ProtectedRoutes>} />

                {/* Admin routes */}
                <Route path="/admin" element={<ProtectedRoutes allowedRoles={['admin']}><AdminDashboard /></ProtectedRoutes>} />
                <Route path="/admin/dashboard" element={<ProtectedRoutes allowedRoles={['admin']}><AdminDashboard /></ProtectedRoutes>} />
                <Route path="/admin/users" element={<ProtectedRoutes allowedRoles={['admin']}><UserManagement /></ProtectedRoutes>} />
                <Route path="/admin/seller-approval" element={<ProtectedRoutes allowedRoles={['admin']}><SellerApproval /></ProtectedRoutes>} />
                <Route path="/admin/products" element={<ProtectedRoutes allowedRoles={['admin']}><ProductModeration /></ProtectedRoutes>} />
                <Route path="/admin/transactions" element={<ProtectedRoutes allowedRoles={['admin']}><TransactionOversight /></ProtectedRoutes>} />
                <Route path="/admin/disputes" element={<ProtectedRoutes allowedRoles={['admin']}><DisputeManagement /></ProtectedRoutes>} />
                <Route path="/admin/reports" element={<ProtectedRoutes allowedRoles={['admin']}><ReportsAnalytics /></ProtectedRoutes>} />

                {/* 404 fallback */}
                <Route path="/admin/debug" element={<ProtectedRoutes allowedRoles={[]}><AdminDebug /></ProtectedRoutes>} />
                <Route path="*" element={<NotFound />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
        </Suspense>
    );
}