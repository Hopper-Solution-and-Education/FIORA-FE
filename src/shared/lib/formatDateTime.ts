export const formatDateTime = (dateTime: string | null | undefined): string => {
  if (!dateTime) return 'N/A';
  try {
    const date = new Date(dateTime);
    // Kiểm tra xem đối tượng Date có hợp lệ không
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    // Định dạng theo MM/DD/YYYY, HH:MM:SS AM/PM
    return date.toLocaleString('en-US', {
      // Sử dụng locale 'en-US' hoặc locale mặc định nếu không chỉ định
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // Hiển thị định dạng 12 giờ với AM/PM
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid Date';
  }
};
