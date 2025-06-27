import { findMissingColumns, isEmptyFile, parseFile } from '../../lib/import/fileParser';

export interface FileParsingConfig {
  maxRecords: number;
}

export interface FileParseResult<T> {
  rawData: T[];
  missingColumns: string[];
  isEmpty: boolean;
  error?: string;
}

export interface ImportValidationResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  rows: any[];
  hasErrors: boolean;
  missingColumns?: string[];
  structuralError?: string;
}

/**
 * Generic file parsing service for all import features
 */
export class FileParsingService {
  /**
   * Parse and prepare file data for validation
   */
  async parseImportFile<T>(
    file: File,
    requiredColumns: string[],
    config: FileParsingConfig,
  ): Promise<FileParseResult<T>> {
    try {
      // Step 1: Parse the file
      const rawData = await parseFile<T>(file, {
        maxRecords: config.maxRecords,
        errorMessage: `File contains too many records (maximum 1001). Please reduce the number of records and try again.`,
      });

      // Step 2: Handle empty file
      const isEmpty = isEmptyFile(rawData);
      if (isEmpty) {
        return {
          rawData: [],
          missingColumns: requiredColumns,
          isEmpty: true,
          error: 'No data found in file',
        };
      }

      // Step 3: Check for missing columns
      const missingColumns = findMissingColumns(rawData, requiredColumns);

      return {
        rawData,
        missingColumns,
        isEmpty: false,
      };
    } catch (error) {
      return {
        rawData: [],
        missingColumns: requiredColumns,
        isEmpty: true,
        error: error instanceof Error ? error.message : 'Failed to parse file',
      };
    }
  }

  /**
   * Create error result for file parsing failures
   */
  createErrorResult(requiredColumns: string[], error: string): ImportValidationResult {
    return {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      duplicateRows: 0,
      rows: [],
      hasErrors: true,
      missingColumns: requiredColumns,
      structuralError: error,
    };
  }
}
