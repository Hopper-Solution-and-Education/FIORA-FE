import { Label } from '@/components/ui/label';
import RichTextEditor from '@/features/faqs/presentation/atoms/RichTextEditor';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ParsedFaqContent from '../atoms/ParsedFaqContent';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

interface PanelHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
  disabled?: boolean;
  isEditor?: boolean;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  isExpanded,
  onToggle,
  disabled = false,
  isEditor = true,
}) => {
  const ChevronIcon = isEditor
    ? isExpanded
      ? ChevronLeft
      : ChevronRight
    : isExpanded
      ? ChevronRight
      : ChevronLeft;

  const title = isEditor ? 'Content' : 'Preview';

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
      {isEditor ? (
        <>
          <div className="flex items-center gap-2">
            {isExpanded && <Label className="text-sm text-gray-700 font-medium">{title}</Label>}
          </div>
          <button
            data-test="content-editor-toggle"
            type="button"
            onClick={onToggle}
            disabled={disabled}
            className={`
              flex items-center justify-center p-1 rounded hover:bg-gray-200 transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={isExpanded ? 'Collapse editor' : 'Expand editor'}
          >
            <ChevronIcon size={16} className="text-gray-600" />
          </button>
        </>
      ) : (
        <>
          <button
            data-test="content-editor-toggle"
            type="button"
            onClick={onToggle}
            disabled={disabled}
            className={`
              flex items-center justify-center p-1 rounded hover:bg-gray-200 transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={isExpanded ? 'Collapse preview' : 'Expand preview'}
          >
            <ChevronIcon size={16} className="text-gray-600" />
          </button>
          {isExpanded && <Label className="text-sm text-gray-700 font-medium">{title}</Label>}
        </>
      )}
    </div>
  );
};

const ContentEditor: React.FC<ContentEditorProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  showPreview = true,
}) => {
  const [isEditorExpanded, setIsEditorExpanded] = useState(true);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(showPreview);

  // Prevent both panels from being collapsed
  useEffect(() => {
    if (!isEditorExpanded && !isPreviewExpanded && showPreview) {
      setIsEditorExpanded(true);
    }
  }, [isEditorExpanded, isPreviewExpanded, showPreview]);

  // Calculate panel widths
  const editorWidth =
    !showPreview || !isPreviewExpanded ? 'w-full' : !isEditorExpanded ? 'w-12' : 'w-1/2';

  const previewWidth = !showPreview
    ? 'w-0'
    : !isEditorExpanded
      ? 'w-full'
      : !isPreviewExpanded
        ? 'w-12'
        : 'w-1/2';

  return (
    <div className="space-y-4">
      {/* Editor Container */}
      <div className="flex border rounded-lg overflow-hidden bg-white ">
        {/* Editor Panel */}
        <div
          className={`
          relative transition-all duration-300 ease-in-out 
          ${showPreview ? 'border-r border-gray-200' : ''}
          ${editorWidth}
        `}
        >
          <PanelHeader
            isExpanded={isEditorExpanded}
            onToggle={() => setIsEditorExpanded(!isEditorExpanded)}
            disabled={disabled}
            isEditor={true}
          />

          {isEditorExpanded && (
            <div>
              <div className={`h-full ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
                <RichTextEditor
                  key={`editor-${isEditorExpanded}`}
                  value={value}
                  onChange={onChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className={`relative transition-all duration-300 ease-in-out ${previewWidth}`}>
            <PanelHeader
              isExpanded={isPreviewExpanded}
              onToggle={() => setIsPreviewExpanded(!isPreviewExpanded)}
              disabled={disabled}
              isEditor={false}
            />

            {isPreviewExpanded && (
              <div>{value ? <ParsedFaqContent htmlContent={value} /> : <p></p>}</div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default ContentEditor;
