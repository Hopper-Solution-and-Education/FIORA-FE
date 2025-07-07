import {
  FaqsRowRaw,
  FaqsRowValidated,
  ValidationError,
  FaqsImportValidationResult,
} from '../entities/models/faqs';
import {
  calculateValidationSummary,
  createMissingColumnErrors,
  createStructuralErrorMessage,
  validateField,
} from '../../../../shared/lib/import/importValidator';
import { FAQS_VALIDATION_SCHEMAS, getFaqsRequiredColumns } from '../schemas/faqsValidationSchemas';

export class FaqsValidationService {
  private readonly VALIDATION_SCHEMAS = FAQS_VALIDATION_SCHEMAS;
  private readonly REQUIRED_COLUMNS = getFaqsRequiredColumns();

  /**
   * Validate all rows in the import data with duplicate checking
   */
  validateImportData(
    rawData: FaqsRowRaw[],
    missingColumns: string[],
    existingTitles: string[] = [],
  ): FaqsImportValidationResult {
    // Find duplicate titles within the file
    const fileDuplicateTitles = this.findDuplicateTitlesInFile(rawData);

    // Validate all rows
    const validatedRows = this.processRows(
      rawData,
      missingColumns,
      fileDuplicateTitles,
      existingTitles,
    );

    // Calculate summary statistics
    const summary = calculateValidationSummary(validatedRows, missingColumns);

    // Create structural error message
    const structuralError = createStructuralErrorMessage(missingColumns);

    return {
      totalRows: summary.totalRows,
      validRows: summary.validRows,
      invalidRows: summary.invalidRows,
      rows: validatedRows,
      hasErrors: summary.hasErrors,
      missingColumns: missingColumns.length > 0 ? missingColumns : undefined,
      structuralError,
    };
  }

  /**
   * Get required columns for validation
   */
  getRequiredColumns(): string[] {
    return [...this.REQUIRED_COLUMNS];
  }

  /**
   * Transform raw row data to the expected format
   * Converts all values to strings and trims whitespace for consistent processing
   */
  transformRow(row: FaqsRowRaw): FaqsRowRaw {
    const safeStringify = (value: any): string => {
      if (value === null || value === undefined || value === '') {
        return '';
      }
      return String(value).trim();
    };

    return {
      category: safeStringify(row.category),
      type: safeStringify(row.type) as any,
      title: safeStringify(row.title),
      description: safeStringify(row.description),
      content: safeStringify(row.content),
      url: safeStringify(row.url),
      typeOfUrl: safeStringify(row.typeOfUrl) as any,
    };
  }

  /**
   * Find duplicate titles within the file data
   */
  private findDuplicateTitlesInFile(rawData: FaqsRowRaw[]): Set<string> {
    const titleCounts = new Map<string, number>();
    const duplicates = new Set<string>();

    rawData.forEach((row) => {
      const title = row.title?.trim()?.toLowerCase();
      if (title) {
        const count = titleCounts.get(title) || 0;
        titleCounts.set(title, count + 1);

        if (count >= 1) {
          duplicates.add(title);
        }
      }
    });

    return duplicates;
  }

  /**
   * Check if a title is duplicate in file or database
   */
  private isDuplicateTitle(
    title: string,
    fileDuplicates: Set<string>,
    existingTitles: string[],
  ): { isDuplicate: boolean; type: 'file' | 'database' | null } {
    const normalizedTitle = title?.trim()?.toLowerCase();

    if (!normalizedTitle) {
      return { isDuplicate: false, type: null };
    }

    // Check if duplicate within file
    if (fileDuplicates.has(normalizedTitle)) {
      return { isDuplicate: true, type: 'file' };
    }

    // Check if exists in database
    const existsInDatabase = existingTitles.some(
      (existingTitle) => existingTitle?.trim()?.toLowerCase() === normalizedTitle,
    );

    if (existsInDatabase) {
      return { isDuplicate: true, type: 'database' };
    }

    return { isDuplicate: false, type: null };
  }

  private processRows(
    rawData: FaqsRowRaw[],
    missingColumns: string[],
    fileDuplicates: Set<string>,
    existingTitles: string[],
  ): FaqsRowValidated[] {
    return rawData.map((row) => {
      const validationErrors = this.validateRow(
        row,
        missingColumns,
        fileDuplicates,
        existingTitles,
      );
      const isValid = validationErrors.length === 0 && missingColumns.length === 0;

      const validatedRow: FaqsRowValidated = {
        isValid,
        validationErrors,
        rowData: row as FaqsRowRaw,
      };

      return validatedRow;
    });
  }

  private validateRow(
    row: FaqsRowRaw,
    missingColumns: string[],
    fileDuplicates: Set<string>,
    existingTitles: string[],
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Add errors for missing columns
    errors.push(...createMissingColumnErrors<ValidationError>(missingColumns, 'required'));

    // Validate all fields that have schemas (both required and optional)
    Object.keys(this.VALIDATION_SCHEMAS).forEach((fieldName) => {
      if (missingColumns.includes(fieldName)) return;

      const schema = this.VALIDATION_SCHEMAS[fieldName as keyof typeof this.VALIDATION_SCHEMAS];
      const value = (row as any)[fieldName];

      const error = validateField<ValidationError>(fieldName, value, schema, missingColumns, {
        required: 'required',
        format: 'format',
      });
      if (error) {
        errors.push(error);
      }
    });

    // Check for duplicate titles
    if (row.title && !missingColumns.includes('title')) {
      const duplicateCheck = this.isDuplicateTitle(row.title, fileDuplicates, existingTitles);

      if (duplicateCheck.isDuplicate) {
        const duplicateError: ValidationError = {
          field: 'title',
          type: 'duplicate',
          message:
            duplicateCheck.type === 'file'
              ? 'Title is duplicated within the file'
              : 'Title already exists in the database',
        };
        errors.push(duplicateError);
      }
    }

    return errors;
  }

  private checkDuplicateRows(rawData: FaqsRowRaw[], columns: (keyof FaqsRowRaw)[]): FaqsRowRaw[] {
    const duplicateRows = rawData.filter(
      (row, index, self) => self.findIndex((t) => columns.every((c) => t[c] === row[c])) !== index,
    );
    return duplicateRows;
  }
}
