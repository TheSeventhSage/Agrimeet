import { AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../../../shared/components/Loader';

// Main container for all charts
export const ChartContainer = ({ title, children, isLoading }) => (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 md:p-6 h-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-full">
            {isLoading ? (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                    <LoadingSpinner message={`Loading ${title}...`} />
                </div>
            ) : (
                children
            )}
        </div>
    </div>
);

// A reusable error state
export const DataErrorState = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-600 bg-red-50 rounded-lg p-4 min-h-[300px]">
        <AlertCircle className="w-12 h-12 mb-2" />
        <p className="font-semibold">Could not load data</p>
        <p className="text-sm">{message}</p>
    </div>
);

// A reusable container for the text-based insights
export const ChartInsights = ({ children }) => (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Insights</h4>
        <div className="text-sm text-gray-600 space-y-2">{children}</div>
    </div>
);