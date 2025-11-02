import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "../../services/ApiMethods";
import ApiConfigures from "../../services/ApiConfigures";

// Initial state
const initialState = {
  allPartners: null,
  loading: false,
  saveData: null,
  error: null,
  data: null,
  partnersHubsData: null,
  timeSlots: null,
  mobileVerfiy: null,
};

// Fetch all workers
export const fetchAllPartners = createAsyncThunk(
  "partners/fetchAllPartners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        ApiConfigures.ENDPOINTS.PARTNERS_ALL
      );
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch worker"
      );
    }
  }
);

// Create partner
export const createPartner = createAsyncThunk(
  "partners/createPartner",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post(
        ApiConfigures.ENDPOINTS.CREATE_PARTNER,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

// Edit worker
export const editPartner = createAsyncThunk(
  "partners/editPartner",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.put(
        `${ApiConfigures.ENDPOINTS.EDIT_PARTNER}`,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

// Delete worker
export const deletePartner = createAsyncThunk(
  "partners/deletePartner",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.delete(
        `${ApiConfigures.ENDPOINTS.DELETE_PARTNER}`,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete worker"
      );
    }
  }
);

// Save worker status
export const savePartnerStatus = createAsyncThunk(
  "partners/savePartnerStatus",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS.PARTNER_STATUS_SAVE,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to save worker status"
      );
    }
  }
);

export const fetchHubsDataForPartners = createAsyncThunk(
  "hubs/fetchHubsDataForPartners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(ApiConfigures.ENDPOINTS.HUBS);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch hubs data"
      );
    }
  }
);

export const fetchSlotTimings = createAsyncThunk(
  "hubs/fetchSlotTimings",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        `${ApiConfigures.ENDPOINTS.HUB}/${payload.id}/slots`
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch hubs data"
      );
    }
  }
);

export const partnerMobileNumberVerify = createAsyncThunk(
  "hubs/partnerMobileNumberVerify",
  async (payload, { rejectWithValue }) => {
    try {
      // Correct the spelling and use query params as per your comment
      const response = await apiMethods.get(
        `${ApiConfigures.ENDPOINTS?.PRATNERMOBILEVERIFY}?mobileNumber=${payload.mobileNumber}&type=PARTNER`
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to verify mobile number"
      );
    }
  }
);

// Slice
const partnersSlice = createSlice({
  name: "partners",
  initialState,
  reducers: {
    resetSaveData: (state) => {
      state.saveData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all partners
      .addCase(fetchAllPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.allPartners = action.payload;
      })
      .addCase(fetchAllPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create partner
      .addCase(createPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.saveData = action.payload;
      })
      .addCase(createPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit partner
      .addCase(editPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.saveData = action.payload;
      })
      .addCase(editPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete partner
      .addCase(deletePartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(deletePartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save partner status
      .addCase(savePartnerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePartnerStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.saveData = action.payload;
      })
      .addCase(savePartnerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch partner hubs
      .addCase(fetchHubsDataForPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHubsDataForPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partnersHubsData = action.payload?.data?.hubs;
      })
      .addCase(fetchHubsDataForPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch Slot timings
      .addCase(fetchSlotTimings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSlotTimings.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSlots = action.payload?.data;
      })
      .addCase(fetchSlotTimings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch Slot timings
      .addCase(partnerMobileNumberVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(partnerMobileNumberVerify.fulfilled, (state, action) => {
        state.loading = false;
        state.mobileVerfiy = action.payload;
      })
      .addCase(partnerMobileNumberVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSaveData } = partnersSlice.actions;

export default partnersSlice.reducer;
