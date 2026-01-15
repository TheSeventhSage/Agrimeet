const BankAccountCard = ({ account }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-brand-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{account.bankName}</h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Primary
                </span>
            </div>
            <div className="space-y-2 text-sm">
                <p className="text-gray-600">Account Number: <span className="font-medium text-gray-900">{account.accountNumber}</span></p>
                <p className="text-gray-600">Account Name: <span className="font-medium text-gray-900">{account.accountName}</span></p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 italic">
                    To change these details, please visit your profile settings.
                </p>
            </div>
        </div>
    );
};

export default BankAccountCard;