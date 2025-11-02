import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "../../services/ApiMethods";
import ApiConfigures from "../../services/ApiConfigures";
import {
  convertUTCToIST,
  formatDateTime,
  formatTimeString,
  getMaxTimeIST,
} from "../../utils/helper";

const initialState = {
  data: null,
  dashboardData: null,
  ordersByDateData: null,
  loading: false,
  error: null,
  statusCancel: null,
  recurringData: null,
  sectorsData: null,
  sectorSaveData: null,
  maidData: null,
  hubSelectionData: null,
};

export const fetchOrdersByDate = createAsyncThunk(
  "orders/fetchOrdersByDate",
  async (
    {
      activeTab,
      bookingDropdownType,
      statusType,
      recurringType,
      hubsType,
      page,
      limit,
      search,
      dateRange,
      lastRecordData,
    },
    { rejectWithValue }
  ) => {
    try {
      // console.log("Fetching orders with params:", {
      //   activeTab,
      //   bookingDropdownType,
      //   statusType,
      //   recurringType,
      //   dateRange,
      //   lastRecordData
      // });

      const queryParams = new URLSearchParams({
        tab: activeTab || "UPCOMING",
        bookingType: bookingDropdownType || "",
        statusType: statusType || "",
        recurringType: recurringType || "",
        hubId: hubsType === "prontoHubsAll" ? "" : hubsType,
        lastRecordTimestamp: lastRecordData?.lastRecordDate || "",
        lastBookingId: lastRecordData?.lastRecordID || "",
        limit: limit?.toString() || "20",
        search: search || "",
        // startTime: dateRange?.start,
        startTime: dateRange?.start ? convertUTCToIST(dateRange.start) : "",
        endTime: dateRange?.end ? formatTimeString(dateRange.end) : "",
        // endTime: dateRange?.end.toISOString() || "",
      });

      const url = `${
        ApiConfigures.ENDPOINTS.ORDERS_BY_DATE
      }?${queryParams.toString()}`;
      // console.log("API URL:", url);

      const response = await apiMethods.get(url);
      // console.log("API Response:", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch orders by date"
      );
    }
  }
);

export const fetchOrdersByDateSearch = createAsyncThunk(
  "orders/fetchOrdersByDateSearch",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page || 1,
        limit: limit || 20,
        search: search || "",
      });

      const response = await apiMethods.get(
        `${ApiConfigures.ENDPOINTS.ORDERS_BY_DATE}?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch orders by date"
      );
    }
  }
);

// Fetch child orders
export const fetchChildOrders = createAsyncThunk(
  "orders/fetchChildOrders",
  async ({ parentId }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        parentId,
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

// Update booking status
export const updateBookingStatus = createAsyncThunk(
  "partner/updateBookingStatus",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS?.ORDERUPDATE,
        payload
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.message || "Failed to update booking status"
      );
    }
  }
);

// Update booking schedule
export const updateBookingSchedule = createAsyncThunk(
  "orders/updateBookingSchedule",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS?.UPDATE_BOOKING_SCHEDULE,
        payload
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.message || "Failed to update booking schedule"
      );
    }
  }
);

// Post sector save data
export const postSectorSavedata = createAsyncThunk(
  "orders/postSectorSavedata",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS.SECTORSAVE,
        payload
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to save sector data"
      );
    }
  }
);

export const saveMaidMatch = createAsyncThunk(
  "orders/saveMaidMatch",
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

export const saveHubSelection = createAsyncThunk(
  "orders/saveHubSelection",
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

export const ReScheduleDate = createAsyncThunk(
  "orders/ReScheduleDate",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS.RESCHEDULEDATE,
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

export const AdminAssignHubStatusPartner = createAsyncThunk(
  "orders/adminAssignHubStatusPartner",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS.ASSIGN_HUB_STATUS_PARTNER,
        payload
      );
      return response?.data;
    } catch (error) {
      throw error;
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

export const parentBookingMaidId = createAsyncThunk(
  "orders/parentBookingMaidId",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiMethods.patch(
        ApiConfigures.ENDPOINTS.UPDATEDPARENTBOOKINGPARTNER,
        payload
      );

      // console.log(response.data)
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.message || "Failed to update booking worker"
      );
    }
  }
);

// Slice
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateSchedule: (state, action) => {
      if (action.payload.activeTab === 5 && action?.payload?.isChild) {
        const booking = state.recurringData?.find(
          (item) => item.bookingId === action.payload.bookingId
        );
        if (booking) {
          booking.scheduledFor = action.payload.timeSlot;
        }
      } else {
        const booking = state.ordersByDateData?.data?.find(
          (item) => item.bookingId === action.payload.bookingId
        );
        if (booking) {
          booking.scheduledFor = formatDateTime(action.payload.timeSlot);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders By Date
      .addCase(fetchOrdersByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersByDateData = action.payload;
      })

      .addCase(fetchOrdersByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Booking Status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.statusCancel = action.payload;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Child Orders
      .addCase(fetchChildOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recurringData = action.payload;
      })
      .addCase(fetchChildOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Sector Save Data
      .addCase(postSectorSavedata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSectorSavedata.fulfilled, (state, action) => {
        state.loading = false;
        state.sectorSaveData = action.payload;
      })
      .addCase(postSectorSavedata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Booking Schedule
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
      })

      // Fetch Orders By Search
      .addCase(fetchOrdersByDateSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByDateSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersByDateData = action.payload;
      })
      .addCase(fetchOrdersByDateSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ReSchedule Date
      .addCase(ReScheduleDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ReScheduleDate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(ReScheduleDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin Assign Hub Status Worker
      .addCase(AdminAssignHubStatusPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AdminAssignHubStatusPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(AdminAssignHubStatusPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // parent booking Worker
      .addCase(parentBookingMaidId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parentBookingMaidId.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(parentBookingMaidId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateSchedule } = ordersSlice.actions;
export default ordersSlice.reducer;
