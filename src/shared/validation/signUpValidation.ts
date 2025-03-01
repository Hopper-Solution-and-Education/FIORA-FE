import { EMAIL_REGEX, PASSWORD_REGEX } from '../constants';

const validateEmail = (value: string) => {
  if (!value) return 'Email is required';
  if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address (e.g., m@example.com)';
  return '';
};

const validatePassword = (value: string) => {
  if (!value) return 'Password is required';
  if (!PASSWORD_REGEX.test(value)) {
    return 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number';
  }
  return '';
};

const validateConfirmPassword = (value: string, passwordValue: string) => {
  if (!value) return 'Confirm Password is required';
  if (value !== passwordValue) return 'Passwords do not match';
  return '';
};

export { validateEmail, validatePassword, validateConfirmPassword };
