export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const parseRecipients = (recipientString: string): string[] => {
  return recipientString
    .split(',')
    .map((email) => email.trim())
    .filter((email) => validateEmail(email));
};

export const formatRecipientCount = (count: number): string => {
  if (count <= 1) return '';
  return `+${count - 1}`;
};

export const getTemplateTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    'System Default': 'bg-green-100 text-green-800',
    System: 'bg-green-100 text-green-800',
    Marketing: 'bg-purple-100 text-purple-800',
    KYC: 'bg-blue-100 text-blue-800',
    Deposit: 'bg-orange-100 text-orange-800',
  };
  return colorMap[type] || 'bg-gray-100 text-gray-800';
};
