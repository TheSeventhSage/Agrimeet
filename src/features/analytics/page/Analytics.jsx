import { useState } from 'react';
import { subDays } from 'date-fns';
import DashboardLayout from '../../../layouts/DashboardLayout';
import KpiCards from '../components/KpiCards';
import AnalyticsHeader from '../components/AnalyticsHeader';
import RevenueChart from '../components/RevenueChart';
import CategoryChart from '../components/CategoryChart';
import ProductsTable from '../components/ProductsTable';
import LowStockWidget from '../components/LowStockWidget';
import TopCategoriesChart from '../components/TopCategoriesChart';
import RevenueGrowthChart from '../components/RevenueGrowthChart';

/**
 * Utility to format date filters for the API
 * @param {object} dateRange - { from: Date, to: Date }
 * @returns {object} - { start_date, end_date }
 */
const formatDateFilter = (dateRange) => {
    if (!dateRange || !dateRange.from) {
        return { last_days: 30 }; // Default
    }
    // Note: Adjust 'start_date'/'end_date' if your API doc meant 'year', 'month' etc.
    // Based on 'last_days', we'll use that.
    const diffInDays = Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24));
    return { last_days: diffInDays + 1 };
};

const Analytics = () => {
    // Default to last 30 days
    const [dateRange, setDateRange] = useState({
        from: subDays(new Date(), 29),
        to: new Date(),
    });

    // This object will be passed to all queries
    const apiFilters = formatDateFilter(dateRange);

    const revenueGrowthFilters = {
        filter: 'month', // Use 'month' filter
        months: 12,      // To show last 12 months
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header with Date Picker */}
                <AnalyticsHeader
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                />

                {/* KPI Cards Section */}
                <KpiCards filters={apiFilters} />

                {/* Charts Section */}
                {/* Main Revenue Chart */}
                <div className="lg:col-span-3">
                    <RevenueChart filters={apiFilters} />
                </div>
                {/* Top Categories Chart */}
                <div className="lg:col-span-2">
                    <CategoryChart filters={apiFilters} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Revenue Growth Chart (New) */}
                    <div>
                        <RevenueGrowthChart filters={revenueGrowthFilters} />
                    </div>

                    {/* Top Categories Over Time (Existing) */}
                    <div>
                        <TopCategoriesChart filters={apiFilters} />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                </div>

                {/* Other Widgets */}
                <LowStockWidget />

                {/* Full Products Table */}
                <ProductsTable />
            </div>
        </DashboardLayout>
    );
};

export default Analytics;