import { downloadBlob } from '@/shared/utils/downloadUtils';
import * as XLSX from 'xlsx';

/**
 * Generate and download Excel template with sample data and instructions
 */
export const downloadTemplate = () => {
  // Sample FAQ data imported from JSON file
  const sampleData = [
    {
      category: '',
      type: '',
      title: '',
      description: '',
      content: '',
      url: '',
      typeOfUrl: '',
    },
  ];

  // Instructions data
  const instructionsData = [
    {
      Column: 'category',
      Description:
        'The topic category of the content, e.g., "System", "Economics – Banking", "Personal Finance".',
      'Data Type': 'Text ( max 100 characters )',
      Required: 'Yes',
    },
    {
      Column: 'type',
      Description:
        'The type of the post. Commonly "FAQ" (Frequently Asked Questions), but can also be "NEWS", "TUTORIAL", "ABOUT", or "INTRO".',
      'Data Type': 'Text',
      Required: 'Yes',
    },
    {
      Column: 'title',
      Description:
        'A concise title for the FAQ section. Clearly states the main topic or question being answered.',
      'Data Type': 'Text ( max 255 characters )',
      Required: 'Yes',
    },
    {
      Column: 'description',
      Description: 'A brief summary of the content. Displayed in previews or in post listings.',
      'Data Type': 'Text',
      Required: 'Yes',
    },
    {
      Column: 'content',
      Description:
        'The detailed content of the post. Provides full information, instructions, or answers.',
      'Data Type': 'Text',
      Required: 'Yes',
    },
    {
      Column: 'url',
      Description:
        'A link to supplementary resources such as videos, images, or attached documents.',
      'Data Type': 'URL',
      Required: 'No',
    },
    {
      Column: 'typeOfUrl',
      Description: 'The type of resource linked, e.g., "video", "image".',
      'Data Type': 'Text',
      Required: 'No (Required if url is provided)',
    },
  ];

  const workbook = XLSX.utils.book_new();

  // Create FAQs sheet (default/first sheet)
  const faqsWorksheet = XLSX.utils.json_to_sheet(sampleData);

  // Set column widths for FAQs sheet
  faqsWorksheet['!cols'] = [
    { wch: 30 }, // category
    { wch: 20 }, // type
    { wch: 50 }, // title
    { wch: 50 }, // description
    { wch: 80 }, // content
    { wch: 50 }, // url
    { wch: 15 }, // typeOfUrl
  ];

  XLSX.utils.book_append_sheet(workbook, faqsWorksheet, 'FAQs');

  // Create Instructions sheet
  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);

  // Set column widths for better readability
  instructionsWorksheet['!cols'] = [
    { wch: 20 }, // Column
    { wch: 60 }, // Description
    { wch: 15 }, // Data Type
    { wch: 30 }, // Required
  ];

  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'Instructions');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  downloadBlob(blob, 'faqs_template.xlsx');
};
