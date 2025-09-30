import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../shared/components/Button';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Access Denied
                </h1>

                <p className="text-gray-600 mb-6">
                    You don't have permission to access this page. Please contact support if you believe this is an error.
                </p>

                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Go Back
                    </Button>
                    <Button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                    >
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;