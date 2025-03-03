export interface Option {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'multiselect' | 'checkbox' | 'textarea';
  required: boolean;
  options?: Option[];
}

export interface Page {
  data: {
    heading: string;
    subheading: string;
    button: string;
  };
  questions: Question[];
}
