export const formatDate = (date: Date): string => {
  const day = date.toLocaleString('en-GB', { day: '2-digit' });
  const month = date.toLocaleString('en-GB', { month: 'short' }); // Sept
  const year = date.toLocaleString('en-GB', { year: 'numeric' });
  const time = date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return `${day}-${month}-${year}, ${time}`;
};

export const formatDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // AM/PM format
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};
