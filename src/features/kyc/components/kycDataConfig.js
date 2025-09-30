// utils/kycDataConfig.js
export const businessInfoConfig = [
  { key: 'businessName', label: 'Business Name' },
  { key: 'businessType', label: 'Business Type', transform: (value, types) => types[value] },
  { key: 'registrationNumber', label: 'Registration Number' },
  { key: 'taxId', label: 'Tax ID Number' },
  { key: 'businessAddress', label: 'Business Address', span: 'md:col-span-2' },
  { key: 'businessPhone', label: 'Business Phone' }
];

export const ownerInfoConfig = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'idType', label: 'ID Type', transform: (value, types) => types[value] },
  { key: 'idNumber', label: 'ID Number' }
];

export const bankInfoConfig = [
  { key: 'accountHolderName', label: 'Account Holder Name' },
  { key: 'accountType', label: 'Account Type', transform: (value, types) => types[value] },
  { key: 'bankName', label: 'Bank Name' },
  { key: 'accountNumber', label: 'Account Number' },
  { key: 'routingNumber', label: 'Routing Number' },
  { key: 'iban', label: 'IBAN', condition: (data) => data.iban },
  { key: 'swiftCode', label: 'SWIFT/BIC Code', condition: (data) => data.swiftCode }
];