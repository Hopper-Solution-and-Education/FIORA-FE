'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Card } from '@/components/ui/card';
import SendMailModal from '@/features/email-template/presentation/organisms/SendMailModal';
import TemplateEditor from '@/features/email-template/presentation/organisms/TemplateEditor';
import TemplatesSidebar from '@/features/email-template/presentation/organisms/TemplatesSidebar';

export default function EmailTemplate() {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex gap-4 h-full">
        {/* Main Editor */}
        <Card className="flex-1">
          <TemplateEditor />
        </Card>

        {/* Sidebar fixed with sticky */}
        <Card className="h-fit sticky top-4 self-start">
          <TemplatesSidebar />
        </Card>

        <SendMailModal />
      </div>

      <DefaultSubmitButton
        isSubmitting={false}
        disabled={false}
        onSubmit={() => {}}
        onBack={() => {}}
        className="m-0"
      />
    </div>
  );
}
