import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createShift,
  listShifts,
  getShiftById,
  updateShift,
  endShift,
  cancelShift,
  getPartnerShiftHistory
} from '../../services/ApiMethods';

// Async thunks
export const fetchShifts = createAsyncThunk(
  'shifts/fetchShifts',
  async (params, { rejectWithValue }) => {
    try {
      // Only send non-empty, non-null params
      const filteredParams = Object.fromEntries(
        Object.entries(params || {}).filter(
          ([, v]) => v !== '' && v !== null && v !== undefined
        )
      );
      const response = await listShifts(filteredParams);
      console.log('[fetchShifts] API response:', response);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchShiftById = createAsyncThunk(
  'shifts/fetchShiftById',
  async (id, { rejectWithValue }) => {
    try {
      return await getShiftById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createNewShift = createAsyncThunk(
  'shifts/createNewShift',
  async (data, { rejectWithValue }) => {
    try {
      return await createShift(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateExistingShift = createAsyncThunk(
  'shifts/updateExistingShift',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateShift(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const endExistingShift = createAsyncThunk(
  'shifts/endExistingShift',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await endShift(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const cancelExistingShift = createAsyncThunk(
  'shifts/cancelExistingShift',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await cancelShift(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchPartnerShiftHistory = createAsyncThunk(
  'shifts/fetchPartnerShiftHistory',
  async ({ partner_id, params }, { rejectWithValue }) => {
    try {
      return await getPartnerShiftHistory(partner_id, params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  shifts: [],
  total: 0,
  loading: false,
  error: null,
  filters: {
    partner_id: '',
    hub_id: '',
    status: '',
    start_date: '',
    end_date: '',
  },
  pagination: {
    page: 1,
    limit: 20,
  },
  selectedShift: null,
  partnerHistory: [],
};

const shiftSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination(state, action) {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearSelectedShift(state) {
      state.selectedShift = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List Shifts
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload.data.data || [];
        state.total = action.payload.data.total || 0;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Shift by ID
      .addCase(fetchShiftById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShiftById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShift = action.payload;
      })
      .addCase(fetchShiftById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Shift
      .addCase(createNewShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewShift.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally add to shifts list
      })
      .addCase(createNewShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Shift
      .addCase(updateExistingShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingShift.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update in shifts list
      })
      .addCase(updateExistingShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // End Shift
      .addCase(endExistingShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endExistingShift.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(endExistingShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Shift
      .addCase(cancelExistingShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelExistingShift.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(cancelExistingShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Partner Shift History
      .addCase(fetchPartnerShiftHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerShiftHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.partnerHistory = action.payload.data || action.payload || [];
      })
      .addCase(fetchPartnerShiftHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setPagination, clearSelectedShift } = shiftSlice.actions;
export default shiftSlice.reducer; 