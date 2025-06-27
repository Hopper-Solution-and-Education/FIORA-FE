import * as XLSX from 'xlsx';
import { downloadBlob } from '@/shared/utils/downloadUtils';

/**
 * Generate and download Excel template with sample data
 */
export const downloadTemplate = () => {
  const sampleData = [
    {
      category: 'Category',
      type: 'FAQ',
      title: 'Title',
      description: 'Description',
      content: 'Content',
      url: '',
      typeOfUrl: '',
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
