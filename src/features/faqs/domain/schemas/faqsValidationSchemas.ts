import * as yup from 'yup';
import { PostType, UrlType } from '../entities/models/faqs';

/**
 * Validation schemas for FAQ import data
 */
export const FAQS_VALIDATION_SCHEMAS = {
  category: yup
    .string()
    .required('Category is required')
    .max(100, 'Category must be less than 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/, 'Category can not contain special characters'),

  type: yup
    .string()
    .required('Type is required')
    .oneOf(Object.values(PostType), 'Type is invalid')
    .max(10, 'Type must be less than 10 characters'),

  title: yup
    .string()
    .required('Title is required')
    .max(255, 'Title must be less than 255 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/, 'Title can not contain special characters'),

  description: yup
    .string()
    .required('Description is required')
    .max(255, 'Description must be less than 255 characters'),

  content: yup.string().required('Content is required'),

  url: yup
    .string()
    .optional()
    .test('valid-url', 'URL must be a valid URL format', function (value) {
      if (!value || value.trim().length === 0) {
        return true; // Allow empty URLs
      }

      const trimmedValue = value.trim();

      try {
        // Simply check if it's a valid URL
        new URL(trimmedValue);
        return true;
      } catch {
        // If it doesn't start with http/https, try adding https://
        try {
          new URL(`https://${trimmedValue}`);
          return true;
        } catch {
          return false;
        }
      }
    })
    .nullable(),

  typeOfUrl: yup
    .string()
    .optional()
    .test('valid-type-of-url', 'Type of URL is invalid', function (value) {
      if (!value || value.trim().length === 0) {
        return true; // Allow empty URLs
      }

      const trimmedValue = value.trim();

      return Object.values(UrlType).includes(trimmedValue as UrlType);
    }),
} as const;

/**
 * Get the required columns for FAQ validation
 */
export const getFaqsRequiredColumns = (): string[] => {
  return ['category', 'type', 'title', 'description', 'content'];
};
