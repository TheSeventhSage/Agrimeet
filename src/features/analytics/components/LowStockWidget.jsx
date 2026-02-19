import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getWeeklyOutOfStockProducts } from '../api/analyticsApi';
import { AlertCircle, Package } from 'lucide-react';
import { LoadingSpinner } from '../../../shared/components/Loader';
import { DataErrorState } from './ChartComponents';
import Button from '../../../shared/components/Button';

const LowStockWidget = () => {
    const navigate = useNavigate();
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
            <div className="flex gap-2 items-center justify-between md:justify-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 ">
                    Low Stock Products
                </h3>

                <span className="text-xs h-fit font-medium bg-white
                 text-gray-600">
                    {products.length} product{products.length === 1 ? '' : 's'}
                </span>

                <Button
                    className={`h-fit ml-auto`}
                    variant="ghost"
                    size="small"
                    onClick={() => navigate('/products')}
                >
                    View
                </Button>
            </div>
            {isLoading ? (
                <LoadingSpinner />
            ) : isError ? (
                <DataErrorState message={error.message} />
            ) : products.length > 0 ? (
                <div className="space-y-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {products.map((product) => {
                        // Calculate fill percentage based on threshold (max 100%)
                        const fillPercentage = Math.min((product.stock_quantity / product.low_stock_threshold) * 100, 100);
                        const isCritical = product.stock_quantity === 0;

                        return (
                            <div
                                key={product.id}
                                className="p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-full ${isCritical ? 'bg-red-100' : 'bg-orange-100'}`}>
                                            <AlertCircle className={`w-4 h-4 ${isCritical ? 'text-red-600' : 'text-orange-600'}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                                            <p className="text-xs text-gray-500">ID: #{product.id}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 shadow-sm">
                                        Min Req: {product.low_stock_threshold}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Availability</span>
                                        <span className={`font-bold ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
                                            {product.stock_quantity} / {product.low_stock_threshold} units
                                        </span>
                                    </div>
                                    {/* Visual Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-1.5 rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : 'bg-orange-500'}`}
                                            style={{ width: `${fillPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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