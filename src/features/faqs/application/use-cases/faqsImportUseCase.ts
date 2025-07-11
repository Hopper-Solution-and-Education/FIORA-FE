import {
  FaqsImportResult,
  FaqsImportValidationResult,
  FaqsRowRaw,
} from '../../domain/entities/models/faqs';
import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';
import { FaqsValidationService } from '../../domain/services/FaqsValidationService';
import { FileParsingService } from '../../domain/services/FileParsingService';

interface ValidateFaqsImportFileParams {
  file: File;
  maxRecords: number;
  userId: string;
}

export class FaqsImportUseCase {
  constructor(
    private readonly faqsRepository: IFaqsRepository,
    private readonly validationService: FaqsValidationService,
    private readonly fileParsingService: FileParsingService,
  ) {}

  /**
   * Import validated FAQs data
   */
  async importFaqs(rows: FaqsRowRaw[], userId: string): Promise<FaqsImportResult> {
    return this.faqsRepository.importFaqs(rows, userId);
  }

  /**
   * Validate FAQs import file
   *
   * @param params - File and validation parameters
   * @returns Validation result with success/error details
   */
  async validateFaqsImportFile(
    params: ValidateFaqsImportFileParams,
  ): Promise<FaqsImportValidationResult> {
    try {
      // Parse the uploaded file
      const parseResult = await this.parseImportFile(params);

      // Handle parsing failures
      if (this.hasParsingErrors(parseResult)) {
        return this.createParsingErrorResult(parseResult);
      }

      // Transform the raw data
      const transformedData = parseResult.rawData.map((row) =>
        this.validationService.transformRow(row),
      );

      // Check for existing titles in database
      const existingTitles = await this.checkExistingTitles(transformedData, params.userId);

      // Validate the parsed data with duplicate checking
      return this.validationService.validateImportData(
        transformedData,
        parseResult.missingColumns,
        existingTitles,
      );
    } catch (error) {
      return this.createUnexpectedErrorResult(error);
    }
  }

  /**
   * Parse the import file and extract data
   */
  private async parseImportFile({ file, maxRecords }: ValidateFaqsImportFileParams) {
    const requiredColumns = this.validationService.getRequiredColumns();

    return await this.fileParsingService.parseImportFile<FaqsRowRaw>(file, requiredColumns, {
      maxRecords,
    });
  }

  /**
   * Check existing titles in database
   */
  private async checkExistingTitles(rawData: FaqsRowRaw[], userId: string): Promise<string[]> {
    try {
      // Extract unique titles from the raw data
      const titles = rawData
        .map((row) => row?.title)
        .filter((title): title is string => Boolean(title));

      const uniqueTitles = [...new Set(titles)];

      if (uniqueTitles.length === 0) {
        return [];
      }

      // Check which titles exist in the database
      return await this.faqsRepository.checkExistingTitles(uniqueTitles, userId);
    } catch (error) {
      console.error('Error checking existing titles:', error);
      return []; // Return empty array on error to continue validation
    }
  }

  /**
   * Check if parsing resulted in errors
   */
  private hasParsingErrors(parseResult: any): boolean {
    return parseResult.error || parseResult.isEmpty;
  }

  /**
   * Create error result for parsing failures
   */
  private createParsingErrorResult(parseResult: any): FaqsImportValidationResult {
    const requiredColumns = this.validationService.getRequiredColumns();
    const errorMessage = parseResult.error || 'No data found in file';

    return this.fileParsingService.createErrorResult(requiredColumns, errorMessage);
  }

  /**
   * Create error result for unexpected errors
   */
  private createUnexpectedErrorResult(error: unknown): FaqsImportValidationResult {
    const requiredColumns = this.validationService.getRequiredColumns();
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';

    return this.fileParsingService.createErrorResult(requiredColumns, errorMessage);
  }
}
