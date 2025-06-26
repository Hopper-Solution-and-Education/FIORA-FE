import { FAQ_IMPORT_CONSTANTS } from '../constants/import';
import { FaqsRowValidated, ValidationError } from '../domain/entities/models/faqs';

/**
 * Filter records based on the selected filter type
 */
export const filterRecords = (records: FaqsRowValidated[], filter: string): FaqsRowValidated[] => {
  if (!records || !Array.isArray(records)) {
    return [];
  }

  switch (filter) {
    case FAQ_IMPORT_CONSTANTS.FILTER_TYPES.VALID:
      return records.filter((record) => record.isValid);
    case FAQ_IMPORT_CONSTANTS.FILTER_TYPES.INVALID:
      return records.filter((record) => !record.isValid);
    case FAQ_IMPORT_CONSTANTS.FILTER_TYPES.ALL:
    default:
      return records;
  }
};

/**
 * Check if a field has validation errors
 */
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some((error) => error.field === fieldName);
};

/**
 * Get CSS class name for table cell based on validation errors
 */
export const getCellClassName = (errors: ValidationError[], fieldName: string): string => {
  return hasFieldError(errors, fieldName) ? 'text-red-600' : '';
};

/**
 * Get CSS class name for table row based on validation status
 */
export const getRowClassName = (record: FaqsRowValidated): string => {
  const classes = [];

  if (!record.isValid) {
    classes.push('bg-muted/30');
  }

  if (record.validationErrors.length > 0) {
    classes.push('border-l-2 border-l-red-500');
  }

  return classes.join(' ');
};
