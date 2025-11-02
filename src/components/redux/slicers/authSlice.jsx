import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiMethods } from '../../services/ApiMethods'; 
import ApiConfigures from '../../services/ApiConfigures';

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk
export const AuthenticateUser = createAsyncThunk(
  'auth/AuthenticateUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post(`${ApiConfigures.BASE_URL}${ApiConfigures.ENDPOINTS.ADMIN_LOGIN}`, payload);
      return response; 
    } catch (error) {
      console.log('Authentication error:', error);
      return rejectWithValue(
        error.message || 'Failed to authenticate user' 
      );
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AuthenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AuthenticateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(AuthenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer AND the logout action
export const { logout } = authSlice.actions;
export default authSlice.reducer;
