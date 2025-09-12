'use client';

import { Card } from '@/components/ui/card';
import SendMailModal from '@/features/email-template/presentation/organisms/SendMailModal';
import TemplateEditor from '@/features/email-template/presentation/organisms/TemplateEditor';
import TemplatesSidebar from '@/features/email-template/presentation/organisms/TemplatesSidebar';

export default function EmailTemplate() {
  return (
    <div className="flex gap-4 mx-4">
      <Card>
        <TemplateEditor />
      </Card>
      <Card>
        <TemplatesSidebar />
      </Card>
      <SendMailModal />
    </div>
  );
}
