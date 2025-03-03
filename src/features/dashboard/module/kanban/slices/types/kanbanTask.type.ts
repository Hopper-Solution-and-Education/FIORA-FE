export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
}

export interface Column {
  id: string;
  title: string;
}

interface TaskState {
  tasks: Task[];
  columns: Column[];
  draggedTask: string | null;
}

const initialState: TaskState = {
  tasks: [
    { id: 'task1', status: 'TODO', title: 'Project initiation and planning' },
    { id: 'task2', status: 'TODO', title: 'Gather requirements from stakeholders' },
  ],
  columns: [{ id: 'TODO', title: 'Todo' }],
  draggedTask: null,
};

export { initialState };
export type { TaskState };
