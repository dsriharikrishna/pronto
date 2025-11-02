import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "../../services/ApiMethods";
import ApiConfigures from "../../services/ApiConfigures";
import { formatDateTime } from "../../utils/helper";

// Initial state
const initialState = {
  data: null,
  dashboardData: null,
  postedOrder: null,
  tableData: null,
  workers: null,
  chartData: null,
  allUsers: null,
  hubsData: null,
  ordersByDateData: null,
  sectorsData: null,
  sectorSaveData: null,
  loading: false,
  error: null,
  sectorTableData: null,
  sectorList: null,
  statusCancel: null,
  recurringData: null,
  maidData: null,
  hubSelectionData: null,
};

// Fetch all users
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        ApiConfigures.ENDPOINTS.PRONTO_USERS
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch dashboard users data"
      );
    }
  }
);

// Fetch sector data
export const fetchSectorList = createAsyncThunk(
  "dashboard/fetchSectorList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        ApiConfigures.ENDPOINTS.GET_SECTOR_LIST
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch sector list"
      );
    }
  }
);

// Post a new order
export const postDashboardData = createAsyncThunk(
  "dashboard/postData",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post(
        ApiConfigures.ENDPOINTS.PRONTO_MATCH,
        orderData
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post dashboard data"
      );
    }
  }
);

// Fetch table data
export const fetchDashboardTable = createAsyncThunk(
  "dashboard/fetchTable",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        ApiConfigures.ENDPOINTS.PRONTO_TABLE
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch dashboard table data"
      );
    }
  }
);

// Fetch chart data
export const fetchDashboardChart = createAsyncThunk(
  "dashboard/fetchChart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        ApiConfigures.ENDPOINTS.PRONTO_CHART
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch dashboard chart data"
      );
    }
  }
);

// Fetch all users (not just workers)
export const fetchAllUsers = createAsyncThunk(
  "dashboard/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(ApiConfigures.ENDPOINTS.USERS_ALL);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch all users"
      );
    }
  }
);

// Create Users
export const createCustomer = createAsyncThunk(
  "dashboard/createCustomer",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post(
        ApiConfigures.ENDPOINTS.CREATE_PARTNER,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post dashboard data"
      );
    }
  }
);

// Fetch orders by date
export const fetchOrdersByDate = createAsyncThunk(
  "dashboard/fetchOrdersByDate",
  async (
    {
      selectedTimeFilter,
      serviceTypeFilter,
      selectedStatus,
      selectedRecurringType,
      page,
      limit,
      search,
    },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        timeLine: selectedTimeFilter || "",
        bookingType: serviceTypeFilter || "",
        statusType: selectedStatus || "",
        recurringType: selectedRecurringType || "",
        page: page || 1,
        limit: limit || 20,
        search: search || "",
      });

      const response = await apiMethods.get(
        `${ApiConfigures.ENDPOINTS.ORDERS_BY_DATE_OLD}?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch orders by date"
      );
    }
  }
);

export const fetchSectorsData = createAsyncThunk(
  "dashboard/fetchSectorsData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(ApiConfigures.ENDPOINTS.SECTORS);
      // Returning both id and name
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

export const createSector = createAsyncThunk(
  "dashboard/createSector",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post(
        ApiConfigures.ENDPOINTS.CREATE_SECTOR,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post dashboard data"
      );
    }
  }
);

export const getCatalogData = createAsyncThunk(
  "dashboard/getCatalogData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        `${ApiConfigures.ENDPOINTS.GET_CATALOG_DATA}?sector_id=${payload}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post dashboard data"
      );
    }
  }
);

export const saveCatalogData = createAsyncThunk(
  "dashboard/saveCatalogData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS.SAVE_CATALOG_DATA,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post dashboard data"
      );
    }
  }
);

export const postSectorSavedata = createAsyncThunk(
  "dashboard/postSectorSavedata",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS.SECTORSAVE,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post dashboard data"
      );
    }
  }
);

export const fetchHubsData = createAsyncThunk(
  "dashboard/fetchHubsData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(ApiConfigures.ENDPOINTS.HUBS);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post dashboard data"
      );
    }
  }
);

export const createNewHub = createAsyncThunk(
  "dashboard/createNewHub",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post(
        ApiConfigures.ENDPOINTS.CREATEHUB,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post dashboard data"
      );
    }
  }
);

export const fetchChildOrders = createAsyncThunk(
  "dashboard/fetchChildOrders",
  async ({ parentId, timeline }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        parentId,
        timeLine: timeline,
      });
      const response = await apiMethods.get(
        `${ApiConfigures.ENDPOINTS.CHILD_ORDERS}?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch child orders"
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "partner/updateBookingStatus",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS?.ORDERUPDATE,
        payload
      );
      console.log(response.data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.message || "Failed to delete worker(s)"
      );
    }
  }
);

export const updateBookingSchedule = createAsyncThunk(
  "dashboard/updateBookingSchedule",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS?.UPDATE_BOOKING_SCHEDULE,
        payload
      );
      // console.log(response.data)
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.message || "Failed to update booking schedule"
      );
    }
  }
);

export const orderDetails = createAsyncThunk(
  "orderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        `https://devadminapi.withpronto.com/bookings/admin/get-booking-details?bookingId=${id}`
      );

      // console.log(response.data)
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.message || "Failed to update booking schedule"
      );
    }
  }
);

export const saveHubSelection = createAsyncThunk(
  "dashboard/saveHubSelection",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS.SAVE_HUB_SELECTION,
        payload
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to save hub selection"
      );
    }
  }
);


export const saveMaidMatch = createAsyncThunk(
  "dashboard/saveMaidMatch",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS.MAIDMATCH,
        payload
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to save worker data"
      );
    }
  }
);

// Slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateSchedule: (state, action) => {
      if (action.payload.activeTab === 5 && action?.payload?.isChild) {
        const booking = state.recurringData.find(
          (item) => item.bookingId === action.payload.bookingId
        );
        // console.log("aaaa", action.payload?.timeSlot);
        if (booking) {
          booking.scheduledFor = action.payload.timeSlot;
        }
      } else {
        const booking = state.ordersByDateData?.data?.find(
          (item) => item.bookingId === action.payload.bookingId
        );
        // console.log("bbbb", action.payload.timeSlot);
        if (booking) {
          booking.scheduledFor = formatDateTime(action.payload.timeSlot);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload?.data?.data;
        state.dashboardData = action.payload?.data;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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

      // Post Order
      .addCase(postDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.postedOrder = action.payload;
        if (state.dashboardData) {
          state.dashboardData = [...state.dashboardData, action.payload];
        } else {
          state.dashboardData = [action.payload];
        }
      })
      .addCase(postDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Table
      .addCase(fetchDashboardTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tableData = action.payload?.data;
      })
      .addCase(fetchDashboardTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Chart
      .addCase(fetchDashboardChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardChart.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload?.data;
      })
      .addCase(fetchDashboardChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;

        state.allUsers = action.payload.data?.data;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Users....
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
        state.data = action.payload;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Orders By Date
      .addCase(fetchOrdersByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByDate.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload.data?.data);
        state.ordersByDateData = action.payload;
      })
      .addCase(fetchOrdersByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // sectors data
      .addCase(fetchSectorsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectorsData.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.sectorsData = action.payload;
      })
      .addCase(fetchSectorsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // post create sector
      .addCase(createSector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSector.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(createSector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get catalog data
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

      // post catalog data
      .addCase(saveCatalogData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCatalogData.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(saveCatalogData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // post sector save data
      .addCase(postSectorSavedata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSectorSavedata.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
        state.sectorSaveData = action.payload;
      })
      .addCase(postSectorSavedata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // handle Update Status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
        state.statusCancel = action.payload;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get Hubs data
      .addCase(fetchHubsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHubsData.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.hubsData = action.payload;
      })
      .addCase(fetchHubsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  post create hub data
      .addCase(createNewHub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewHub.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.data = action.payload;
      })
      .addCase(createNewHub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //child records data
      .addCase(fetchChildOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildOrders.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
        state.recurringData = action.payload?.data;
      })
      .addCase(fetchChildOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //update booking schedule
      .addCase(updateBookingSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateBookingSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //update order Details
      .addCase(orderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(orderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

        // Save Worker Match
            .addCase(saveMaidMatch.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(saveMaidMatch.fulfilled, (state, action) => {
              state.loading = false;
              state.maidData = action.payload;
            })
            .addCase(saveMaidMatch.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })

      // Save Hub Selection
      .addCase(saveHubSelection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveHubSelection.fulfilled, (state, action) => {
        state.loading = false;
        state.hubSelectionData = action.payload;
      })
      .addCase(saveHubSelection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateSchedule } = dashboardSlice.actions;

export default dashboardSlice.reducer;
