import { CheckCircle } from 'lucide-react';
import Button from '../shared/components/Button';
import BackgroundArt from '../shared/components/BackgroundArt';
import { performRedirect, ROUTES } from './utils/routingManager';

export const KycPending = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4 relative">
            <BackgroundArt />
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg relative z-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                <p className="text-gray-600 mb-6">
                    Your KYC application has been submitted for review. Our team will process it within 24-48 hours.
                </p>
                <div className="bg-green-50 rounded-2xl p-4 mb-6">
                    <p className="text-sm text-green-800">
                        <strong>Next Steps:</strong> Check your email for updates on the verification status.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={async () => performRedirect(ROUTES.LOGIN, 1000)}
                    >
                        Sign In to Check Status
                    </Button>
                    <Button
                        onClick={() => performRedirect(ROUTES.HOME)}
                        className="flex-1 bg-brand-900 text-white hover:bg-brand-800"
                    >
                        Return to Home
                    </Button>
                </div>
            </div>
        </div>

        
    )
}