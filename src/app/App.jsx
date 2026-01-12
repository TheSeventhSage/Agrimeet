// App.jsx - Simplified
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../shared/contexts/AuthContext';
import Router from './router';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50">
                    <Router />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}