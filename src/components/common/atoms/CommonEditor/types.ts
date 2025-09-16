import { AnyExtension, Editor, UseEditorOptions } from '@tiptap/react';

export interface ToolbarItemProps {
  button: {
    component: React.ComponentType<any>;
    componentProps: Record<string, any>;
  };
  divider: boolean;
  spacer: boolean;
  type: string;
  name: string;
}

export interface ToolbarProps {
  render?: (
    props: ToolbarRenderProps,
    toolbarItems: ToolbarItemProps[],
    dom: any[],
    containerDom: (innerContent: React.ReactNode) => React.ReactNode,
  ) => React.ReactNode;
}

export interface ToolbarRenderProps {
  editor: Editor;
  disabled: boolean;
}

export interface RichTextEditorProps {
  /** Content of the editor */
  content: string;
  /** Extensions for the editor */
  extensions?: AnyExtension[];
  /** Output format */
  output: 'html' | 'json' | 'text';
  /** Model value */
  modelValue?: string | object;
  /** Dark mode flag */
  dark?: boolean;
  /** Dense mode flag */
  dense?: boolean;
  /** Disabled flag */
  disabled?: boolean;
  /** Label for the editor */
  label?: string;
  /** Hide toolbar flag */
  hideToolbar?: boolean;
  /** Disable bubble menu flag */
  disableBubble?: boolean;
  /** Hide bubble menu flag */
  hideBubble?: boolean;
  /** Remove default wrapper flag */
  removeDefaultWrapper?: boolean;
  /** Maximum width */
  maxWidth?: string | number;
  /** Minimum height */
  minHeight?: string | number;
  /** Maximum height */
  maxHeight?: string | number;
  /** Content class */
  contentClass?: string | string[] | Record<string, any>;
  /** Content change callback */
  onChangeContent?: (val: any) => void;
  /** Bubble menu props */
  bubbleMenu?: any;
  /** Toolbar props */
  toolbar?: ToolbarProps;
  /** Use editor options */
  useEditorOptions?: UseEditorOptions;
  /** Reset CSS flag */
  resetCSS?: boolean;
  /** Render immediately flag */
  immediatelyRender?: boolean;
}
