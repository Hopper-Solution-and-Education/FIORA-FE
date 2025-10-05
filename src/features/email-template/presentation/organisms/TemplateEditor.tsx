'use client';

import {
  createDesignFromHtml,
  EmailTemplateEditor,
} from '@/components/common/atoms/EmailTemplateEditor';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TEMPLATE_TYPES } from '@/features/email-template/constants';
import { useAppSelector } from '@/store';

export default function TemplateEditor() {
  const { selectedTemplate } = useAppSelector((state) => state.email);

  return (
    <div className="flex flex-col gap-4 h-full p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Name
          </label>
          <Input
            value={selectedTemplate?.name || ''}
            onChange={() => {}}
            className="border-gray-200"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Template Type
          </label>
          <Select value={selectedTemplate?.EmailTemplateType?.type || ''} onValueChange={() => {}}>
            <SelectTrigger className="border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Area */}
      <EmailTemplateEditor initialDesign={createDesignFromHtml(selectedTemplate?.content || '')} />
    </div>
  );
}
