// admin/commission/components/CommissionSettings.jsx
import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import adminCommissionService from '../api/adminCommissionService';
import Button from '../../../../shared/components/Button';
import { showSuccess, showError } from '../../../../shared/utils/alert';

const CommissionSettings = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState({
        commission_enabled: false,
        default_commission_rate: 0,
        minimum_payout: 0,
        payout_schedule: 'weekly'
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setIsLoading(true);
            const response = await adminCommissionService.getCommissionSettings();
            setSettings(response.data.data || response.data);
        } catch (error) {
            showError('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminCommissionService.updateCommissionSettings(settings);
            showSuccess('Settings updated successfully');
        } catch (error) {
            showError('Failed to update settings');
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading settings...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xs border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Commission Configuration
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                        <label className="font-medium text-gray-900 block">Enable Commissions</label>
                        <p className="text-sm text-gray-500">Turn commission tracking on or off</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.commission_enabled}
                            onChange={(e) => setSettings({ ...settings, commission_enabled: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Commission Rate (%)</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={settings.default_commission_rate}
                            onChange={(e) => setSettings({ ...settings, default_commission_rate: parseFloat(e.target.value) })}
                            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">%</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout Amount</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                        </div>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={settings.minimum_payout}
                            onChange={(e) => setSettings({ ...settings, minimum_payout: parseFloat(e.target.value) })}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payout Schedule</label>
                    <select
                        value={settings.payout_schedule}
                        onChange={(e) => setSettings({ ...settings, payout_schedule: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <Button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CommissionSettings;