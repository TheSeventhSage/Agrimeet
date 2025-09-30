// components/InfoField.jsx
const InfoField = ({ label, value, children, className = '' }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children ? children : <p className="text-sm text-gray-900">{value || 'Not provided'}</p>}
    </div>
  );
};

export default InfoField;