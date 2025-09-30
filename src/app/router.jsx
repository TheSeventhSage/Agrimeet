// router.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import HomePage from '../pages/HomePage';
import KycRegister from '../pages/KycRegister';
import { KycPending } from '../pages/KycPending';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyOtp from '../pages/VerifyOtp';
import HelpSupport from '../pages/HelpSupport';
import Dashboard from '../features/dashboard/pages/Dashboard';
import ViewProfile from '../features/dashboard/pages/ViewProfile';
import Settings from '../features/dashboard/pages/Settings';
import ProductGrid from '../features/products/pages/Product';
import AddProduct from '../features/products/pages/AddProduct';
import EditProduct from '../features/products/pages/EditProduct';
import KYCPage from '../features/kyc/pages/KycVerify';
import KYCStatusPage from '../features/kyc/pages/KycVerified';
import Payouts from '../features/payouts/pages/Payouts';
import Orders from '../features/orders/pages/Orders';
import Unauthorized from '../pages/Unauthorized';

const NotFound = () => <div className="p-8">404 — Not found</div>;

export default function Router() {
    return (
        <Routes>
            {/* Home routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/index" element={<HomePage />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/kyc-register" element={<KycRegister />} />
            <Route path="/kyc-pending" element={<KycPending />} />

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoutes allowedRoles={['seller']}><Dashboard /></ProtectedRoutes>} />
            <Route path="/profile" element={<ProtectedRoutes allowedRoles={['seller']}><ViewProfile /></ProtectedRoutes>} />
            <Route path="/settings" element={<ProtectedRoutes allowedRoles={['seller']}><Settings /></ProtectedRoutes>} />

            {/* Product routes */}
            <Route path="/products" element={<ProtectedRoutes allowedRoles={['seller']}><ProductGrid /></ProtectedRoutes>} />
            <Route path="/products/add" element={<ProtectedRoutes allowedRoles={['seller']}><AddProduct /></ProtectedRoutes>} />
            <Route path="/products/edit/:id" element={<ProtectedRoutes allowedRoles={['seller']}><EditProduct /></ProtectedRoutes>} />

            {/* KYC routes */}
            <Route path="/kyc" element={<ProtectedRoutes allowedRoles={['seller']}><KYCPage /></ProtectedRoutes>} />
            <Route path="/kyc/status" element={<ProtectedRoutes allowedRoles={['seller']}><KYCStatusPage /></ProtectedRoutes>} />

            {/* Payouts */}
            <Route path="/payouts" element={<ProtectedRoutes allowedRoles={['seller']}><Payouts /></ProtectedRoutes>} />

            {/* Orders */}
            <Route path="/orders" element={<ProtectedRoutes allowedRoles={['seller']}><Orders /></ProtectedRoutes>} />

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
    );
}