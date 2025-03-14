import PageContainer from '@/components/layouts/PageContainer';
import { DashboardHeading } from '../../components/DashboardHeading';
import { KanbanBoard } from './components/KanbanBoard';
import NewTaskDialog from './components/NewTaskDialog';

export default function KanbanPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <DashboardHeading title={`Kanban`} description="Manage tasks by dnd" />
          <NewTaskDialog />
        </div>
        <KanbanBoard />
      </div>
    </PageContainer>
  );
}
