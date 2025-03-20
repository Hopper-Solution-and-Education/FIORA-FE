import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { Column, initialState, Task } from './types/kanbanTask.type';

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ title: string; description?: string }>) => {
      const newTask: Task = {
        id: uuid(),
        title: action.payload.title,
        description: action.payload.description,
        status: 'TODO',
      };
      state.tasks.push(newTask);
    },
    updateColumn: (state, action: PayloadAction<{ id: string; newName: string }>) => {
      const column = state.columns.find((col) => col.id === action.payload.id);
      if (column) {
        column.title = action.payload.newName;
      }
    },
    addColumn: (state, action: PayloadAction<{ title: string }>) => {
      const newColumn: Column = {
        id: action.payload.title.toUpperCase(),
        title: action.payload.title,
      };
      state.columns.push(newColumn);
    },
    dragTask: (state, action: PayloadAction<string | null>) => {
      state.draggedTask = action.payload;
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter((col) => col.id !== action.payload);
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
  },
});

export const {
  addTask,
  updateColumn,
  addColumn,
  dragTask,
  removeTask,
  removeColumn,
  setTasks,
  setColumns,
} = taskSlice.actions;

export default taskSlice.reducer;
