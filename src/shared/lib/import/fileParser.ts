import * as XLSX from 'xlsx';

export interface FileParseOptions {
  maxRecords?: number;
  errorMessage?: string;
}

/**
 * Generic function to parse Excel/CSV files and extract raw data
 * Can be used across different import features (invoices, orders, etc.)
 */
export const parseFile = async <T = any>(file: File, options?: FileParseOptions): Promise<T[]> => {
  const buffer = await file.arrayBuffer();
  const isCSV = file.name.toLowerCase().endsWith('.csv');

  const workbook = XLSX.read(buffer, isCSV ? { type: 'array' } : undefined);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const rawData: T[] = XLSX.utils.sheet_to_json(worksheet);

  // Check record limit if specified
  if (options?.maxRecords && rawData.length > options.maxRecords) {
    const message =
      options.errorMessage ||
      `File contains more than ${options.maxRecords} records, which exceeds the limit`;
    throw new Error(message);
  }

  return rawData;
};

/**
 * Check which required columns are missing from the parsed data
 */
export const findMissingColumns = <T>(data: T[], requiredColumns: string[]): string[] => {
  if (data.length === 0) return [...requiredColumns];

  const availableColumns = Object.keys(data[0] as object);
  return requiredColumns.filter((column) => !availableColumns.includes(column));
};

/**
 * Check if file has no data
 */
export const isEmptyFile = <T>(data: T[]): boolean => {
  return data.length === 0;
};
