// components/WalletOverview.jsx
import { Wallet, Clock, CreditCard, Plus, Download } from 'lucide-react';
import Button from '../../../shared/components/Button';

const WalletOverview = ({ data }) => {
    const balanceCards = [
        {
            title: 'Available Balance',
            value: data.balance,
            color: 'green',
            icon: Wallet
        },
        {
            title: 'Pending Balance',
            value: data.pendingBalance,
            color: 'yellow',
            icon: Clock
        },
        {
            title: 'Total Earnings',
            value: data.totalEarnings,
            color: 'blue',
            icon: CreditCard
        }
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Wallet Balance</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {balanceCards.map((card) => {
                    const IconComponent = card.icon;
                    const colorClasses = {
                        green: 'bg-green-50 border-green-200 text-green-600',
                        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
                        blue: 'bg-blue-50 border-blue-200 text-blue-600'
                    };

                    return (
                        <div key={card.title} className={`border rounded-lg p-6 ${colorClasses[card.color]}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm mb-1">{card.title}</p>
                                    <h4 className="text-2xl font-bold">
                                        ₦{card.value.toLocaleString()}
                                    </h4>
                                </div>
                                <IconComponent className="w-8 h-8" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
                {/* <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Bank Account
                </Button> */}
                <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Statements
                </Button>
            </div>
        </div>
    );
};

export default WalletOverview;