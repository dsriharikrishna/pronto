import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "../../services/ApiMethods";
import ApiConfigures from "../../services/ApiConfigures";

// Initial state
const initialState = {
  sectorList: null,
  sectorTableData: null,
  sectorsData: null,
  loading: false,
  error: null,
};

// Create Sector
export const createSector = createAsyncThunk(
  "sectors/createSector",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post(
        ApiConfigures.ENDPOINTS.CREATE_SECTOR,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create sector"
      );
    }
  }
);

// Fetch Sector List
export const fetchSectorList = createAsyncThunk(
  "sectors/fetchSectorList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(ApiConfigures.ENDPOINTS.GET_SECTOR_LIST);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch sector list"
      );
    }
  }
);

// Fetch All Sectors (Only id and name)
export const fetchSectorsData = createAsyncThunk(
  "sectors/fetchSectorsData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(ApiConfigures.ENDPOINTS.SECTORS);
      const sectors = response.data?.catalogs?.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      return sectors;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch sectors data"
      );
    }
  }
);

// Get Catalog Table Data by Sector
export const getCatalogData = createAsyncThunk(
  "sectors/getCatalogData",
  async (sectorId, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        `${ApiConfigures.ENDPOINTS.GET_CATALOG_DATA}?sector_id=${sectorId}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch catalog data"
      );
    }
  }
);

// Save Edited Catalog Data
export const saveCatalogData = createAsyncThunk(
  "sectors/saveCatalogData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS.SAVE_CATALOG_DATA,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to save catalog data"
      );
    }
  }
);

const sectorsSlice = createSlice({
  name: "sectors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Sector List
      .addCase(fetchSectorList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectorList.fulfilled, (state, action) => {
        state.loading = false;
        state.sectorList = action.payload;
      })
      .addCase(fetchSectorList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Catalog Data
      .addCase(getCatalogData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCatalogData.fulfilled, (state, action) => {
        state.loading = false;
        state.sectorTableData = action.payload;
      })
      .addCase(getCatalogData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save Catalog Data
      .addCase(saveCatalogData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCatalogData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveCatalogData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Sectors Data
      .addCase(fetchSectorsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectorsData.fulfilled, (state, action) => {
        state.loading = false;
        state.sectorsData = action.payload;
      })
      .addCase(fetchSectorsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Sector
      .addCase(createSector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSector.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sectorsSlice.reducer;
