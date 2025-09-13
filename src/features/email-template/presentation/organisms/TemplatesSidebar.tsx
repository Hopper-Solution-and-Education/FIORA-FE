'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmailModal } from '@/features/email-template/hooks/useEmailModal';
import { RefreshCw, Search } from 'lucide-react';

export default function TemplatesSidebar() {
  const { handleOpenModal, selectedTemplate } = useEmailModal();

  return (
    <div className="min-w-80 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <span>📧</span>
            Templates (8)
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search templates..." className="pl-10 border-gray-200 bg-gray-50" />
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto">
        {/* {EMAIL_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-white transition-colors ${
              selectedTemplate === template.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {template.type && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getTemplateTypeColor(template.type)}`}
                    >
                      {template.type}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{template.name}</h4>
                {template.id === 'account-verification' && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getTemplateTypeColor('System')}`}
                  >
                    System
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))} */}
      </div>

      {/* Send Mail Button */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <Button onClick={handleOpenModal} className="w-full bg-blue-600 hover:bg-blue-700">
          Send Mail
        </Button>
      </div>
    </div>
  );
}
