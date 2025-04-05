import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MODULE } from '@/shared/constants';

interface ModuleState {
  currentModule: string;
}

const initialState: ModuleState = {
  currentModule: MODULE.HOME,
};

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    setModule: (state, action: PayloadAction<string>) => {
      state.currentModule = action.payload;
    },
  },
});

export const { setModule } = moduleSlice.actions;
export default moduleSlice.reducer;
