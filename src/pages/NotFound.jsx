import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '../shared/components/Button';
import BackgroundArt from '../shared/components/BackgroundArt';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-linear-to-br from-brand-50 to-brand-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <BackgroundArt className="opacity-[0.2]" />

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center relative z-10 overflow-hidden">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-500"></div>

                {/* Icon Container */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-brand-100 rounded-full opacity-40"></div>
                    <div className="relative w-full h-full bg-brand-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <Compass className="w-10 h-10 text-brand-600" />
                    </div>
                </div>

                <p className="text-sm font-semibold text-brand-600 tracking-wide mb-2">
                    ERROR 404
                </p>

                <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                    Page Not Found
                </h1>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="ghost"
                        className="w-full sm:w-auto px-6 py-2.5 border text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
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
            <p className="mt-8 text-sm text-gray-400 relative z-10">
                Need help? <a href="mailto:support@agrimeetconnect.com" className="text-brand-600 hover:underline font-medium">Contact Support</a>
            </p>
        </div>
    );
};

export default NotFound;
