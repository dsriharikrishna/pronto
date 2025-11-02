import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "../../services/ApiMethods";
import ApiConfigures from "../../services/ApiConfigures";

// Initial state
const initialState = {
  hubsData: null,
  createdHub: null,
  loading: false,
  error: null,
};

// Thunks

export const fetchHubsData = createAsyncThunk(
  "hubs/fetchHubsData",
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

export const createNewHub = createAsyncThunk(
  "hubs/createNewHub",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post(
        ApiConfigures.ENDPOINTS.CREATEHUB,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create hub"
      );
    }
  }
);






// Slice

const hubsSlice = createSlice({
  name: "hubs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch hubs
      .addCase(fetchHubsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHubsData.fulfilled, (state, action) => {
        state.loading = false;
        state.hubsData = action.payload;
      })
      .addCase(fetchHubsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create hub
      .addCase(createNewHub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewHub.fulfilled, (state, action) => {
        state.loading = false;
        state.createdHub = action.payload;
      })
      .addCase(createNewHub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hubsSlice.reducer;
