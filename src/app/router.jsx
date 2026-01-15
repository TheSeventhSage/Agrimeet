// router.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import { LoadingSpinner } from '../shared/components/Loader';

// Lazy load all components
/********* HOME PAGES *********/
const HomePage = lazy(() => import('../pages/HomePage'));
const Search = lazy(() => import('../pages/SearchResultsPage'));
const PublicProductDetails = lazy(() => import('../pages/ProductDetailsPage'));
const BuyerApp = lazy(() => import('../pages/BuyerAppRedirect'));
const HelpSupport = lazy(() => import('../pages/HelpSupport'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('../pages/TermsOfService'));
const FaqPage = lazy(() => import('../pages/FaqPage'));
const Contact = lazy(() => import('../pages/Contact'));
const AppDemo = lazy(() => import('../Add.demo'));


/********* AUTH PAGES *********/
const KycRegister = lazy(() => import('../pages/KycRegister'));
const KycPending = lazy(() => import('../pages/KycPending'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const VerifyOtp = lazy(() => import('../pages/VerifyOtp'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));


/********* SELLER PAGES *********/
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
const Notifications = lazy(() => import('../features/messages/pages/Notifications'));
const KYCPage = lazy(() => import('../features/kyc/pages/KycVerify'));
const KYCStatusPage = lazy(() => import('../features/kyc/pages/KycVerified'));
const Payouts = lazy(() => import('../features/payouts/pages/Payouts'));
const Orders = lazy(() => import('../features/orders/pages/Orders'));


/********* ADMIN PAGES *********/
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard'));
const UserManagement = lazy(() => import('../features/admin/userManagement/pages/UserManagement'));
const SellerManagement = lazy(() => import('../features/admin/sellerManagement/pages/SellerManagement'));
const ProductModeration = lazy(() => import('../features/admin/pages/ProductModeration'));
const TransactionOversight = lazy(() => import('../features/admin/commissionsManagement/pages/TransactionOversight'));
const CommissionManagement = lazy(() => import('../features/admin/commissionsManagement/pages/CommissionManagement'));
const DisputeManagement = lazy(() => import('../features/admin/disputeManagement/pages/DisputeManagement'));
const ReportsAnalytics = lazy(() => import('../features/admin/pages/ReportsAnalytics'));
const AdminDebug = lazy(() => import('../features/admin/pages/AdmiDebug'));
const AdminSettings = lazy(() => import('../features/admin/settings/pages/Settings'));
const PrivacyPolicies = lazy(() => import('../features/admin/legalContents/PrivacyPolicies'));
const TermsOfService = lazy(() => import('../features/admin/legalContents/TermsOfService'));
const FAQs = lazy(() => import('../features/admin/legalContents/Faqs'));

const NotFound = () => <div className="p-8">404 — Not found</div>;

export default function Router() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* -*-*-*-*-* WEBSITE ROUTES -*-*-*-*-*- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<Search />} />
                <Route path="/test" element={<AppDemo />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/index" element={<HomePage />} />
                <Route path="/details/:productId" element={<PublicProductDetails />} />
                <Route path="/product/download" element={<BuyerApp />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/faqs" element={<FaqPage />} />
                <Route path="/help-support" element={<HelpSupport />} />
                <Route path="/contact" element={<Contact />} />



                {/* -*-*-*-*-* AUTH ROUTES -*-*-*-*-*- */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/kyc-register" element={<KycRegister />} />
                <Route path="/kyc-pending" element={<KycPending />} />

                {/* -*-*-*-*-* VENDOR ROUTES -*-*-*-*-*- */}
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
                <Route path="/notifications" element={<ProtectedRoutes allowedRoles={['seller']}><Notifications /></ProtectedRoutes>} />
                {/* Analytics */}
                <Route path="/analytics" element={<ProtectedRoutes allowedRoles={['seller']}><Analytics /></ProtectedRoutes>} />
                {/* KYC routes */}
                <Route path="/kyc" element={<ProtectedRoutes allowedRoles={['seller']}><KYCPage /></ProtectedRoutes>} />
                <Route path="/kyc/status" element={<ProtectedRoutes allowedRoles={['seller']}><KYCStatusPage /></ProtectedRoutes>} />
                {/* Payouts */}
                <Route path="/payouts" element={<ProtectedRoutes allowedRoles={['seller']}><Payouts /></ProtectedRoutes>} />
                {/* Orders */}
                <Route path="/orders" element={<ProtectedRoutes allowedRoles={['seller']}><Orders /></ProtectedRoutes>} />


                {/* -*-*-*-*-* ADMIN ROUTES -*-*-*-*-*- */}
                <Route path="/admin" element={<ProtectedRoutes allowedRoles={['admin']}><AdminDashboard /></ProtectedRoutes>} />
                <Route path="/admin/dashboard" element={<ProtectedRoutes allowedRoles={['admin']}><AdminDashboard /></ProtectedRoutes>} />
                <Route path="/admin/users" element={<ProtectedRoutes allowedRoles={['admin']}><UserManagement /></ProtectedRoutes>} />
                <Route path="/admin/seller" element={<ProtectedRoutes allowedRoles={['admin']}><SellerManagement /></ProtectedRoutes>} />
                <Route path="/admin/products" element={<ProtectedRoutes allowedRoles={['admin']}><ProductModeration /></ProtectedRoutes>} />
                <Route path="/admin/transactions" element={<ProtectedRoutes allowedRoles={['admin']}><TransactionOversight /></ProtectedRoutes>} />
                <Route path="/admin/disputes" element={<ProtectedRoutes allowedRoles={['admin']}><DisputeManagement /></ProtectedRoutes>} />
                <Route path="/admin/commissions" element={<ProtectedRoutes allowedRoles={['admin']}><CommissionManagement /></ProtectedRoutes>} />
                <Route path="/admin/reports" element={<ProtectedRoutes allowedRoles={['admin']}><ReportsAnalytics /></ProtectedRoutes>} />
                <Route path="/admin/settings" element={<ProtectedRoutes allowedRoles={['admin']}><AdminSettings /></ProtectedRoutes>} />
                <Route path="/admin/privacy-policy" element={<ProtectedRoutes allowedRoles={['admin']}><PrivacyPolicies /></ProtectedRoutes>} />
                <Route path="/admin/terms-of-service" element={<ProtectedRoutes allowedRoles={['admin']}><TermsOfService /></ProtectedRoutes>} />
                <Route path="/admin/faqs" element={<ProtectedRoutes allowedRoles={['admin']}><FAQs /></ProtectedRoutes>} />


                {/* -*-*-*-*-* 404 FALLBACK -*-*-*-*-*- */}
                <Route path="/admin/debug" element={<ProtectedRoutes allowedRoles={[]}><AdminDebug /></ProtectedRoutes>} />
                <Route path="*" element={<NotFound />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
        </Suspense>
    );
}