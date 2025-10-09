import { ChevronDown } from 'lucide-react';

const NavItem = ({ icon, label, active = false }) => {
    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active
            ? 'bg-orange-500 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}>
            <div className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`}>
                {/* Icon placeholder - you can replace with actual icons */}
                <div className="w-full h-full bg-current rounded-xs opacity-60"></div>
            </div>
            <span className="text-sm">{label}</span>
            {!active && <ChevronDown className="w-3 h-3 ml-auto" />}
        </div>
    );
};

export default NavItem;
