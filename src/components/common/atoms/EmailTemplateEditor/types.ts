export interface EmailEditorRef {
  editor: {
    loadDesign: (design: EmailDesign) => void;
    exportHtml: (callback: (data: ExportHtmlData) => void) => void;
  } | null;
}

export interface ExportHtmlData {
  html: string;
  design: EmailDesign;
}

export interface EmailDesign {
  body: {
    rows: EmailRow[];
  };
}

export interface EmailRow {
  cells: number[];
  columns: EmailColumn[];
}

export interface EmailColumn {
  contents: EmailContent[];
}

export interface EmailContent {
  type: string;
  values: {
    html?: string;
    [key: string]: unknown;
  };
}

export interface EmailTemplateEditorProps {
  onExport?: (html: string, design: EmailDesign) => void;
  onLoad?: (design: EmailDesign) => void;
  initialDesign?: EmailDesign;
  showHeader?: boolean;
  headerTitle?: string;
  headerDescription?: string;
  minHeight?: string;
  className?: string;
  uploadBasePath?: string;
}
