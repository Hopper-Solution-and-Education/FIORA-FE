import * as yup from 'yup';

export interface ImportValidationError {
  field: string;
  message: string;
  type?: string;
}

export interface ImportValidatedRow {
  isValid: boolean;
  validationErrors: any[];
}

export interface ImportValidationSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  hasErrors: boolean;
}

/**
 * Generic function to validate a single field using Yup schema
 */
export const validateField = <T extends ImportValidationError>(
  fieldName: string,
  value: any,
  schema: yup.Schema,
  missingColumns: string[] = [],
  errorTypeMapping?: { required: T['type']; format: T['type'] },
): T | null => {
  // Check if column is missing
  if (missingColumns.includes(fieldName)) {
    return {
      field: fieldName,
      message: 'Column is missing from the file',
      type: errorTypeMapping?.required || 'required',
    } as T;
  }

  try {
    schema.validateSync(value);
    return null;
  } catch (error) {
    return {
      field: fieldName,
      message: error instanceof yup.ValidationError ? error.message : 'Invalid value',
      type: errorTypeMapping?.format || 'format',
    } as T;
  }
};

/**
 * Create validation errors for missing columns
 */
export const createMissingColumnErrors = <T extends ImportValidationError>(
  missingColumns: string[],
  errorType: T['type'] = 'required' as T['type'],
): T[] => {
  return missingColumns.map((column) => ({
    field: column,
    message: 'Column is missing from the file',
    type: errorType,
  })) as T[];
};

/**
 * Calculate validation summary statistics
 */
export const calculateValidationSummary = <T extends ImportValidatedRow>(
  validatedRows: T[],
  missingColumns: string[] = [],
): ImportValidationSummary => {
  const validRows = validatedRows.filter((row) => row.isValid).length;
  const invalidRows = validatedRows.length - validRows;
  const hasErrors = invalidRows > 0 || missingColumns.length > 0;

  return {
    totalRows: validatedRows.length,
    validRows,
    invalidRows,
    hasErrors,
  };
};

/**
 * Create structural error message for missing columns
 */
export const createStructuralErrorMessage = (missingColumns: string[]): string | undefined => {
  return missingColumns.length > 0
    ? `File is missing required columns: ${missingColumns.join(', ')}. Please check the template format.`
    : undefined;
};
