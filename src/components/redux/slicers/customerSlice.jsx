import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "../../services/ApiMethods";
import ApiConfigures from "../../services/ApiConfigures";

// Initial state
const initialState = {
  createdCustomer: null,
  loading: false,
  error: null,
};

// Async thunk to create a customer
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post(
        ApiConfigures.ENDPOINTS.CREATE_USER,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create customer"
      );
    }
  }
);

// Slice
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.createdCustomer = action.payload;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
