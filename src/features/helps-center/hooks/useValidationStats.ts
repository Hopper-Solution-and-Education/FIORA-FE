import { useMemo } from 'react';
import { FaqsImportValidationResult } from '../domain/entities/models/faqs';

interface ValidationSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  validationRate: number;
  hasErrors: boolean;
  canImport: boolean;
}

export const useValidationStats = (validationResult: FaqsImportValidationResult | null) => {
  const summary = useMemo((): ValidationSummary => {
    if (!validationResult) {
      return {
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        validationRate: 0,
        hasErrors: false,
        canImport: false,
      };
    }

    const validationRate =
      validationResult.totalRows > 0
        ? Math.round((validationResult.validRows / validationResult.totalRows) * 100)
        : 0;

    return {
      totalRows: validationResult.totalRows,
      validRows: validationResult.validRows,
      invalidRows: validationResult.invalidRows,
      validationRate,
      hasErrors: validationResult.hasErrors,
      canImport: validationResult.validRows > 0 && !validationResult.structuralError,
    };
  }, [validationResult]);

  return summary;
};
