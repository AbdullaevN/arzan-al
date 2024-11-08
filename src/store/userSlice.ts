import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index';

interface UserState {
  user: any; // Define a more specific type for user if possible
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

interface RegisterUserData {
  username: string;
  password: string;
}

export const registerUser = createAsyncThunk<
  any, // Response type (replace with specific type if known)
  RegisterUserData, // Argument type
  { rejectValue: string } // Rejected action payload type
>('user/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('https://cargo-back.onrender.com/api/register', userData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to register user';
      });
  },
});

export default userSlice.reducer;
