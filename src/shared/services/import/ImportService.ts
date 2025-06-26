import { FileParsingService } from './FileParsingService';

/**
 * Generic Import Service that provides common import functionality
 * Can be extended by specific import features (FAQs, transactions, etc.)
 */
export class ImportService {
  protected fileParsingService: FileParsingService;

  constructor() {
    this.fileParsingService = new FileParsingService();
  }

  /**
   * Get the file parsing service for use in specific import features
   */
  getFileParsingService(): FileParsingService {
    return this.fileParsingService;
  }
}

// Create and export a singleton instance
export const importService = new ImportService();
