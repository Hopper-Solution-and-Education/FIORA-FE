'use client';

export const usePhoneFormatter = () => {
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Limit to 10 digits (Vietnamese phone number format)
    const limitedDigits = digits.substring(0, 10);

    if (limitedDigits.length <= 4) {
      return limitedDigits;
    } else if (limitedDigits.length <= 7) {
      return `${limitedDigits.substring(0, 4)} ${limitedDigits.substring(4)}`;
    } else {
      return `${limitedDigits.substring(0, 4)} ${limitedDigits.substring(4, 7)} ${limitedDigits.substring(7)}`;
    }
  };

  return { formatPhoneNumber };
};
