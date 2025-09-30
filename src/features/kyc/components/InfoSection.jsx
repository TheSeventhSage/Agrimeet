// components/InfoSection.jsx
import React from 'react';

const InfoSection = ({ title, icon: Icon, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 ${className}`}>
      <div className="flex items-center mb-6">
        <Icon className="w-6 h-6 text-gray-400 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
};

export default InfoSection;