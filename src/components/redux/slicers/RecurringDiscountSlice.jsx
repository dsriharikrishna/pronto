// src/store/slices/dataPageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "../../services/ApiMethods";
import ApiConfigures from "../../services/ApiConfigures";

// GET data
export const fetchRecurringDiscountPage = createAsyncThunk(
  "RecurringDiscount/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiMethods.get(
        `${ApiConfigures.BASE_URL}${ApiConfigures.ENDPOINTS.RECURRINGDISCOUNTPAGE}`
      );
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to fetch");
    }
  }
);

// POST data
export const updateRecurringDiscountPage = createAsyncThunk(
  "RecurringDiscount/update",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiMethods.patch(
        `${ApiConfigures.BASE_URL}${ApiConfigures.ENDPOINTS.UPDATERECURRINGDISCOUNTPAGE}`,
        payload
      );
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to update");
    }
  }
);

const RecurringDiscountSlice = createSlice({
  name: "RecurringDiscount",
  initialState: {
    data: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecurringDiscountPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecurringDiscountPage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRecurringDiscountPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateRecurringDiscountPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecurringDiscountPage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
      })
      .addCase(updateRecurringDiscountPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetSuccess } = RecurringDiscountSlice.actions;
export default RecurringDiscountSlice.reducer;
