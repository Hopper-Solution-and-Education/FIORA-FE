import * as XLSX from 'xlsx';
import { downloadBlob } from '@/shared/utils/downloadUtils';

/**
 * Generate and download Excel template with sample data
 */
export const downloadTemplate = () => {
  const sampleData = [
    {
      category: 'Category 1',
      type: 'FAQ',
      title: 'Title 1',
      description: 'Description 1',
      content: 'Content 1',
      url: 'Url 1',
      typeOfUrl: 'Type of Url 1',
    },
    {
      category: 'Category 2',
      type: 'FAQ',
      title: 'Title 2',
      description: 'Description 2',
      content: 'Content 2',
      url: 'Url 2',
      typeOfUrl: 'Type of Url 2',
    },
  ];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'FAQs');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  downloadBlob(blob, 'faqs_template.xlsx');
};

/**
 * Export problematic records to Excel for user to fix
 */
export const exportProblematicRecords = (validationResult: any) => {
  if (!validationResult) return;

  const problematicRecords = validationResult.rows
    .filter((row: any) => !row.isValid)
    .map((row: any) => ({
      name: row.name || '',
      taxNo: row.tax_code || '',
      orderNo: row.order_code || '',
      email: row.email || '',
      phone: row.phone_number || '',
      address: row.address || '',
      errors: row.validationErrors.map((error: any) => error.message).join('; '),
      issue_type: 'VALIDATION_ERROR',
    }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(problematicRecords);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Problematic_Records');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  downloadBlob(blob, 'problematic_invoices.xlsx');
};
