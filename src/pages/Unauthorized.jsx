import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../shared/components/Button';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

                {/* Icon Container with subtle animation */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-25"></div>
                    <div className="relative w-full h-full bg-red-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                    Access Restricted
                </h1>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    It looks like you don't have the required seller permissions to view this dashboard. If you believe you should have access, please verify your account status.
                </p>

                {/* Helpful Next Steps Box */}
                <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">What can you do?</h3>
                    <ul className="text-sm text-gray-600 space-y-2.5">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            Ensure you are logged into the correct account.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            Complete your seller registration if you haven't yet.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            Contact support if your account is pending approval.
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => navigate('/kyc-register')}
                        variant='ghost'
                        className="w-full sm:w-auto px-6 py-2.5 border text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm"
                    >
                        KYC Registeration
                    </Button>
                    <Button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors font-medium shadow-sm"
                    >
                        Return Home
                    </Button>
                </div>
            </div>

            {/* Support Footer */}
            <p className="mt-8 text-sm text-gray-400">
                Need help? <a href="mailto:support@agrimeetconnect.com" className="text-brand-600 hover:underline font-medium">Contact Support</a>
            </p>
        </div>
    );
};

export default Unauthorized;