'use client';

import CommonEditor from '@/components/common/atoms/CommonEditor';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TEMPLATE_TYPES } from '@/features/email-template/constants';
import {
  setTemplateName,
  setTemplateType,
} from '@/features/email-template/store/slices/emailSlice';
import { useAppDispatch, useAppSelector, type RootState } from '@/store';
import { useState } from 'react';

export default function TemplateEditor() {
  const dispatch = useAppDispatch();
  const { templateName, templateType } = useAppSelector((state: RootState) => state.email);
  const [content, setContent] = useState('');

  return (
    <div className="flex flex-col gap-4 h-full p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Name
          </label>
          <Input
            value={templateName}
            onChange={(e) => dispatch(setTemplateName(e.target.value))}
            className="border-gray-200"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Template Type
          </label>
          <Select value={templateType} onValueChange={(value) => dispatch(setTemplateType(value))}>
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
      <CommonEditor content={content} output="html" onChangeContent={setContent} />
    </div>
  );
}
