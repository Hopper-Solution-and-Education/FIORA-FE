export const formatReferralDateTime = (dateTime: string | null | undefined): string => {
  if (!dateTime) return 'N/A';
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Hiển thị định dạng 24 giờ
    });
  } catch (e) {
    console.error('Error formatting referral date:', e);
    return 'Invalid Date';
  }
};
