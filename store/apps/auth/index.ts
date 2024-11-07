import { axiosInstance } from '@/store/httpclient';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  user_email: string;
  isLoggedIn: boolean;
}

interface LoginPayload {
  data: {
    user_email: string;
    user_password: string;
  };
}

// Define the initial state
const initialState: LoginState = {
  user_email: '',
  isLoggedIn: false,
};

// Define async thunk for login
export const LOGIN = createAsyncThunk('auth/login', async ({ data }: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/users/login', data);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  });
  

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(LOGIN.fulfilled, (state, action: PayloadAction<{ user_email: string }>) => {
        state.user_email = action.payload.user_email;
        state.isLoggedIn = true;
      })
      .addCase(LOGIN.rejected, (state) => {
        state.isLoggedIn = false;
      });
  },
});

export default authSlice.reducer;
