// utils/kycDataConfig.js
export const businessInfoConfig = [
  { key: 'businessName', label: 'Business Name' },
  { key: 'businessType', label: 'Business Type' },
  { key: 'businessPhone', label: 'Business Phone' },
  { key: 'businessAddress', label: 'Business Address' },
  { key: 'state', label: 'State' },
  { key: 'city', label: 'City' },
  { key: 'businessBio', label: 'Business Bio', span: 'md:col-span-2' },
];

export const ownerInfoConfig = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'gender', label: 'Gender' },
  { key: 'state', label: 'State' },
];

export const bankInfoConfig = [
  { key: 'accountHolderName', label: 'Account Holder Name' },
  { key: 'accountType', label: 'Account Type', transform: (value, types) => types[value] },
  { key: 'bankName', label: 'Bank Name' },
  { key: 'accountNumber', label: 'Account Number' },
];