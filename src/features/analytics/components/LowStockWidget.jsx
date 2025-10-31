import { useQuery } from '@tanstack/react-query';
import { getWeeklyOutOfStockProducts } from '../api/analyticsApi';
import { AlertCircle, Package } from 'lucide-react';
import { LoadingSpinner } from '../../../shared/components/Loader';
import { DataErrorState } from './ChartComponents';

const LowStockWidget = () => {
    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['lowStockProducts'],
        queryFn: getWeeklyOutOfStockProducts,
    });

    const products = response?.data || [];

    return (
        <div className="bg-white h-full rounded-xl shadow-xs border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Low Stock Products
            </h3>
            {isLoading ? (
                <LoadingSpinner />
            ) : isError ? (
                <DataErrorState message={error.message} />
            ) : products.length > 0 ? (
                <div className="space-y-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                        >
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                                <p className="font-medium text-gray-800">
                                    {product.name}
                                </p>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-red-600">
                                    {product.stock_quantity}
                                </span>
                                <span className="text-gray-500">
                                    {' '}
                                    / {product.low_stock_threshold} threshold
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <Package className="w-12 h-12 mb-2" />
                    <p>All products are well-stocked!</p>
                </div>
            )}
        </div>
    );
};

export default LowStockWidget;