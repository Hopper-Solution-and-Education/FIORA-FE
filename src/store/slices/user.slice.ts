import { GetCurrentTierResponse } from '@/features/home/module/membership/domain/entities';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCurrentTierAsyncThunk } from '../actions';
import { initialUserState, User } from '../types/user.type';

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setCurrentTierMembership: (state, action: PayloadAction<GetCurrentTierResponse | null>) => {
      state.userTier.data = action.payload;
    },
    setUserData: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
      state.userTier.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentTierAsyncThunk.pending, (state) => {
      state.userTier.isLoading = true;
    });
    builder.addCase(getCurrentTierAsyncThunk.fulfilled, (state, action) => {
      state.userTier.data = action.payload;
      state.userTier.isLoading = false;
    });
    builder.addCase(getCurrentTierAsyncThunk.rejected, (state) => {
      state.userTier.isLoading = false;
    });
  },
});

export const { setCurrentTierMembership, setUserData, logout } = userSlice.actions;

export default userSlice.reducer;
