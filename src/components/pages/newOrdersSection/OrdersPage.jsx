import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  Stack,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChildOrders,
  fetchOrdersByDate,
  fetchOrdersByDateSearch,
  postSectorSavedata,
  updateBookingSchedule,
  updateBookingStatus,
  updateSchedule,
  saveHubSelection,
  saveMaidMatch,
  ReScheduleDate,
  AdminAssignHubStatusPartner,
  parentBookingMaidId,
} from "../../redux/slicers/ordersSlice";
import { fetchDashboardData } from "../../redux/slicers/dashboardSlice";
import { styled } from "@mui/system";
import { formatTimeString } from "../../utils/helper";
import CustomLoader from "../../components/Models/CustomLoader";
import debounce from "lodash.debounce";
import { ShowToast } from "../../components/ToastAndSnacks/ShowToast";
import { fetchHubsDataForPartners } from "../../redux/slicers/partnerSlice";
import NewTableFilters from "../../components/new orders/NewTableFilters";
import NewTableComponent from "../../components/new orders/NewTableComponent";
import NewPagination from "../../components/new orders/NewPagination";
import {
  TABS,
  bookingTypes,
  recurringTypeOptions,
  statusOptions,
  statusOptionsRecurring,
  statusTypeOptions,
} from "../../utils/orders";
import * as XLSX from "xlsx";
import bookings from "../../data/TableData";
import { useDebounce } from "../../hooks/useDebounce";
import ViewDetailsModal from "../../components/new orders/ViewDetailsModal";
import DateRangePicker from "../../components/new orders/DateRangePicker";
import AutoRefreshPage from "../../components/new orders/AutoRefreshPage";
import { checkAndNotify } from "../../../utils/simpleNotification";

const IconWrapper = styled(Box)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor,
  color: theme?.palette?.text?.primary,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1),
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(0.5),
}));

const OrdersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { tab } = useParams();
  const dispatch = useDispatch();

  // Memoize normalizedTabs to avoid recalculation
  const normalizedTabs = useMemo(
    () => TABS.map((t) => t.key.toLowerCase()),
    []
  );
  const activeTabFromUrl = normalizedTabs.indexOf(tab || "");
  const [activeTab, setActiveTab] = useState(
    activeTabFromUrl >= 0 ? activeTabFromUrl : 0
  );
  // Set initial pageSize based on activeTab
  const [pageSize, setPageSize] = useState(
    (activeTabFromUrl >= 0 ? activeTabFromUrl : 0) === 2 ? 100 : 20
  );

  // Redux selectors
  const ordersByDateData = useSelector(
    (state) => state.orders?.ordersByDateData?.data
  );

  // Check for notifications when orders data changes
  useEffect(() => {
    console.log('🔄 OrdersPage: Orders data changed, checking notifications...');
    console.log('📊 Full ordersByDateData:', ordersByDateData);
    console.log('📊 Orders data:', ordersByDateData?.bookings?.length || 0, 'bookings');
    console.log('📊 Active tab:', activeTab, '(0=upcoming, 1=historical, 2=alerts)');

    // Only check notifications for upcoming tab (index 0)
    if (activeTab === 0 && ordersByDateData?.bookings) {
      console.log('🔔 Checking notifications for upcoming tab...');
      checkAndNotify(ordersByDateData.bookings);
    } else {
      console.log('ℹ️ OrdersPage: Not checking notifications - not on upcoming tab or no data');
    }
  }, [ordersByDateData, activeTab]);

  // const RecurringData = useSelector((state) => state.dashboard?.recurringData);
  // console.log(ordersByDateData);

  // States
  const [hubsDropdown, setHubsDropdown] = useState([]);
  const [hubSelection, setHubSelection] = useState({});
  const [errors, setErrors] = useState({});
  const [bookingDropdownType, setBookingDropdownType] = useState("ALL");
  const [statusType, setStatusType] = useState(["PENDING_MATCH"]);
  const [recurringType, setRecurringType] = useState("ALL");
  const [expandedRows, setExpandedRows] = useState({});
  const [childData, setChildData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState({});
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const [isBundleRecord, setIsBundleRecord] = useState(false);
  const [slotOne, setSlotOne] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [maidName, setMaidName] = useState([]);
  const [maidNameMap, setMaidNameMap] = useState({});
  const [initialMaidMap, setInitialMaidMap] = useState({});
  const [secondaryPartnerMap, setSecondaryPartnerMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [viewDetailsData, setViewDetailsData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [lastRecordData, setLastRecordedData] = useState({});
  const [localData, setLocalData] = useState(null || []);
  const [allFetchedData, setAllFetchedData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [dropdownDialogOpen, setDropdownDialogOpen] = useState(false);
  const [dropdownDialogRow, setDropdownDialogRow] = useState(null);
  const [selectedHub, setSelectedHub] = useState({
    id: "",
    address: "",
  });
  const [parentBookingPartner, setParentBookingPartner] = useState({
    maidId: "",
    parentBookingId: "",
  });
  // const [showDatePicker, setShowDatePicker] = useState(false);

  const debouncedInput = useDebounce(searchText, 300);

  // console.log(dateRange, startDate);

  // Add missing bookingType state
  const [bookingType, setBookingType] = useState("ALL");

  // Add state to store alerts count
  const [alertsCount, setAlertsCount] = useState(0);

  // Add states for secondary worker functionality
  const [showSecondaryMaidSection, setShowSecondaryMaidSection] = useState({});
  const [maidOperationLoading, setMaidOperationLoading] = useState({});

  // Function to fetch alerts count
  const fetchAlertsCount = useCallback(async () => {
    try {
      const params = {
        activeTab: 2, // Alerts tab
        bookingDropdownType: "ALL",
        statusType: "PENDING_MATCH",
        hubsType: selectedHub?.id,
        recurringType: "ALL",
        lastRecordData: {},
        limit: 1000, // Get all alerts for count
        search: "",
      };

      const response = await dispatch(fetchOrdersByDate(params)).unwrap();
      const alertsData = response?.data?.bookings || [];
      setAlertsCount(alertsData.length);
      console.log(`📊 Alerts count updated: ${alertsData.length}`);
    } catch (error) {
      console.error('❌ Error fetching alerts count:', error);
      setAlertsCount(0);
    }
  }, [selectedHub, dispatch]);

  // Fetch alerts count when component mounts and when hub changes
  useEffect(() => {
    fetchAlertsCount();
  }, [fetchAlertsCount]);

  // Fetch hubs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchHubsDataForPartners()).unwrap();
        const hubs = response?.data?.hubs || [];
        const filteredHubs = hubs
          .filter((item) => item.address)
          .map((item) => ({
            id: item.id,
            address: item.address,
          }));
        setHubsDropdown(filteredHubs);
      } catch {
        ShowToast("error", "Failed to load hubs data");
      }
    };
    fetchData();
  }, [dispatch]);

  // Fetch worker names
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchDashboardData()).unwrap();
        const toTitleCase = (str) =>
          str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        const maidNames = response?.data?.data
          .filter(
            (item) =>
              item.name &&
              item.id &&
              item.gender &&
              item.mobile_number &&
              (item.status === "active" || item.status === "unavailable")
          )
          .map((item) => ({
            id: item.id,
            name: toTitleCase(item.name),
            status: item.status,
            gender: item.gender,
            mobile_number: item.mobile_number,
          }));
        setMaidName(maidNames);
      } catch (error) {
        // No need to log error in production
      }
    };
    fetchData();
  }, [dispatch, refreshData]);

  const handleBookingDropdownType = (e) => {
    setBookingDropdownType(e.target.value);
    setAllFetchedData([]);
    setLastRecordedData({});
    setDropdownDialogOpen(false);
    setDropdownDialogRow(null);
  };

  const handleRecurringTypeChange = (e) => {
    setRecurringType(e.target.value);
    setAllFetchedData([]);
    setLastRecordedData({});
    setDropdownDialogOpen(false);
    setDropdownDialogRow(null);
  };

  const ALL_VALUE = "ALL";
  const PENDING_MATCH = "PENDING_MATCH"

  const handleSelectChange = (event) => {
    const selected = event.target.value; 
    const allValues = statusTypeOptions.map((opt) => opt.value);

    // Check if user selected all options
    const isAllSelected = selected.length === allValues.length;

    if(selected.length == 0) {
       handleStatusTypeChange([PENDING_MATCH]);
    } else if (isAllSelected) {
      // All options selected → store ["ALL"]
      handleStatusTypeChange([ALL_VALUE]);
    } else if (statusType.includes(ALL_VALUE)) {
      const updated = selected.filter(value => value !== "ALL");
      handleStatusTypeChange(updated);
    } else {
      // Normal selection update
      handleStatusTypeChange(selected);
    }
  };


  const handleStatusTypeChange = (value) => {
    setStatusType(value);
    setAllFetchedData([]);
    setLastRecordedData({});
    setDropdownDialogOpen(false);
    setDropdownDialogRow(null);
  };

  const handleHubsTypeChange = useCallback(
    (hubId) => {
      if (hubId === "prontoHubsAll") {
        setSelectedHub({ id: "prontoHubsAll", address: "All" });
        setAllFetchedData([]);
        setLastRecordedData({});
        return;
      }
      const hub = hubsDropdown.find((h) => h.id === hubId);
      if (hub) {
        setSelectedHub({ id: hub.id, address: hub.address });
        setAllFetchedData([]);
        setLastRecordedData({});
      }
      setDropdownDialogOpen(false);
      setDropdownDialogRow(null);
    },
    [hubsDropdown]
  );

  // console.log(selectedHub);

  const handleSearchChange = (e) => {
    // debouncedSearch(e.target.value);
    setSearchText(e.target.value);
    setCurrentPage(0);
    setAllFetchedData([]);
    setLastRecordedData({});
    setDropdownDialogOpen(false);
    setDropdownDialogRow(null);
  };

  useEffect(() => {
    if (dateRange.end || dateRange?.start) {
      setAllFetchedData([]);
      setLastRecordedData({});
    }
  }, [dateRange?.end, dateRange?.start]);

  const selectedTab = TABS[activeTab]?.key || "UPCOMING";
  const fetchDataWithLoading = useCallback(async () => {
    // clear lastRecordData

    setIsLoading(true);
    try {
      const params = {
        activeTab: selectedTab,
        bookingDropdownType,
        statusType:
          selectedTab === "MISSED_ASSIGNMENTS" ? "PENDING_MATCH" : statusType,
        hubsType: selectedHub?.id,
        recurringType,
        lastRecordData,
        limit: selectedTab === "MISSED_ASSIGNMENTS" ? 100 : pageSize,
        search: searchText,
      };

      if (dateRange?.start && dateRange?.end) {
        params.dateRange = {
          start: new Date(dateRange.start),
          end: new Date(dateRange.end),
        };
      }

      const response = await dispatch(fetchOrdersByDate(params)).unwrap();
      const initialData = response?.data?.bookings || [];

      if (response?.data?.bookings.length === 0) {
        setIsNextDisabled(true);
      }

      // If no more data returned from API
      if (initialData.length === 0) {
        setIsNextDisabled(true);
        return;
      }

      const lastRecord = initialData[initialData.length - 1];

      const isDuplicate = allFetchedData.some((item) => {
        return item.bookingId === lastRecord.bookingId;
      });

      // console.log(isDuplicate);

      if (isDuplicate) {
        setIsNextDisabled(true);
      } else {
        // setAllFetchedData((prev) => [...prev, ...initialData]);
        setAllFetchedData([ ...initialData]);

        setLastRecordedData({
          lastRecordID: lastRecord.bookingId,
          lastRecordDate: lastRecord.bookingScheduledAt,
        });

        // Re-enable "Next" button if needed
        setIsNextDisabled(false);
      }
    } catch (error) {
      ShowToast("error", "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedTab,
    bookingDropdownType,
    statusType,
    recurringType,
    lastRecordData,
    pageSize,
    searchText,
    dateRange?.start,
    dateRange?.end,
    allFetchedData,
    selectedHub,
  ]);

  // Pagination handlers
  const handleNextPage = async () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    console.log("....", currentPage);
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(0);
    setLastRecordedData(null);
    setAllFetchedData([]);
  };

  const FetchSearchApi = useCallback(() => {
    dispatch(
      fetchOrdersByDate({
        activeTab: selectedTab,
        bookingDropdownType,
        statusType,
        recurringType,
        limit: pageSize,
        search: searchText,
        lastRecordData,
      })
    );
  });

  useEffect(() => {
    if (debouncedInput) {
      // FetchSearchApi();
      fetchDataWithLoading();
    } else {
      fetchDataWithLoading();
    }
    // const intervalId = setInterval("", 60000);
    // return () => clearInterval(intervalId);
  }, [
    dispatch,
    activeTab,
    refreshData,
    statusType,
    recurringType,
    bookingDropdownType,
    pageSize,
    debouncedInput,
    dateRange.start,
    dateRange.end,
    currentPage,
    selectedHub,
  ]);

  const handleSortRequest = useCallback(
    (property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [order, orderBy]
  );

  // Date change
  const handleDateChange = async (date, bookingId, isChild) => {
    const payload = {
      bookingId,
      isBundleRecord,
      slot: slotOne,
      timeSlot: `${formatTimeString(date)}`,
    };
    try {
      const response = await dispatch(updateBookingSchedule(payload)).unwrap();
      if (response?.success === true) {
        ShowToast("success", "Date updated Successfully!!");
        setRefreshData((prev) => !prev);
      }
      dispatch(updateSchedule({ ...payload, activeTab, isChild }));
    } catch { }
    setShowDatePicker(null);
    setSelectedRowId(null);
  };

  // Table headers
  const headers = useMemo(
    () => [
      { id: "bookingId", label: "Order ID", sortable: false },
      { id: "bookingType", label: "Booking Type", sortable: false },
      // { id: "submitTime", label: "Submit Time", sortable: true },
      { id: "scheduledAt", label: "Scheduled Time", sortable: false, width: "160px" },
      { id: "customerDetails", label: "Customer Details", sortable: false },
      { id: "address", label: "Address", sortable: false },
      { id: "bhk", label: "BHK", sortable: false },
      { id: "services", label: "Services", sortable: false },
      { id: "maidName", label: "Worker Name", sortable: false },
      { id: "hubName", label: "Hub Name", sortable: false },
      { id: "status", label: "Status", sortable: false },
      { id: "totalPrice", label: "Price", sortable: true },
      { id: "actions", label: "Actions", sortable: false },
    ],
    []
  );

  const fetchDataWithTimer = useCallback(async () => {
    console.log('🔄 fetchDataWithTimer: Starting refresh...');
    console.log('📊 Current state - activeTab:', activeTab, 'pageSize:', pageSize, 'searchText:', searchText);

    try {
      const params = {
        activeTab,
        bookingDropdownType,
        statusType,
        hubsType: selectedHub?.id,
        recurringType,
        lastRecordData: {}, // Reset to get fresh data
        limit: activeTab === 2 ? 100 : pageSize, // Use 100 for alerts tab, pageSize for others
        search: searchText,
      };

      if (dateRange?.start && dateRange?.end) {
        params.dateRange = {
          start: new Date(dateRange.start),
          end: new Date(dateRange.end),
        };
      }

      console.log('📊 fetchDataWithTimer: Fetching with params:', params);
      const response = await dispatch(fetchOrdersByDate(params)).unwrap();
      const initialData = response?.data?.bookings || [];

      console.log('📊 fetchDataWithTimer: Received', initialData.length, 'bookings');

      // Reset data and set fresh data (like initial load)
      setAllFetchedData(initialData);
      setLastRecordedData({});
      setIsNextDisabled(initialData.length === 0);

      // Also refresh alerts count
      fetchAlertsCount();
    } catch (error) {
      console.error('❌ fetchDataWithTimer: Error:', error);
      ShowToast("error", "Failed to load orders");
    }
  }, [
    activeTab,
    bookingDropdownType,
    statusType,
    recurringType,
    pageSize,
    searchText,
    dateRange,
    selectedHub,
    dispatch,
    fetchAlertsCount,
  ]);

  const reverseArray = (arr) => {
    const result = [...arr];
    let left = 0;
    let right = result.length - 1;

    while (left < right) {
      [result[left], result[right]] = [result[right], result[left]];
      left++;
      right--;
    }

    return result;
  };

  const sortedOrders = useMemo(() => {
    let source = Array.isArray(allFetchedData) ? allFetchedData : [];
    let sortableOrders = [...source];

    if (order === "asc") {
      // sortableOrders = reverseArray(sortableOrders);
      // console.log("");
    }

    return sortableOrders;
  }, [allFetchedData, order, orderBy]);

  const exportExcel = useCallback(() => {
    const formatDate = (dateStr) => {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      return isNaN(date)
        ? "N/A"
        : new Intl.DateTimeFormat("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(date);
    };

    const headers = [
      "Booking Id",
      "Booking Type",
      "Booking Created At",
      "Booking Scheduled At",
      "Parent Booking Id",
      "Customer Name",
      "Customer Phone Number",
      "House No",
      "Landmark",
      "Delivery Address",
      "Booking Status",
      "Services",
      "Coordinates",
      "Reason",
      "Bundle Id",
      "Recurring Type",
      "Total Time Taken (minutes)",
      "Total Price",
      "Total Price After Discount",
      "Razorpay Order Id",
      "Razorpay Payment Id",
      "Bhk",
      "Balcony",
      "Bathroom",
      "Customer Id",
      "Booking Reason",
      "Worker Id",
      "Worker Name",
      "Worker Phone No",
      "Hub Id",
      "Hub Name",
    ];

    const data = sortedOrders.map((row) => [
      row.bookingId || "N/A",
      row.recurringType && row.recurringType !== "null"
        ? `${row.bookingType} ${row.recurringType}`
        : row.bookingType || "",
      formatDate(row.bookingCreatedAt),
      formatDate(row.bookingScheduledAt),
      row.parentBookingId || "N/A",
      row.customerName || "N/A",
      row.customerPhoneNumber || "N/A",
      row.houseNo || "N/A",
      row.landmark || "N/A",
      row.deliveryAddress || "N/A",
      row.bookingStatus || "N/A",
      Array.isArray(row.services) ? row.services.join(", ") : "N/A",
      typeof row.coordinates === "object"
        ? JSON.stringify(row.coordinates)
        : row.coordinates || "N/A",
      row.reason || "N/A",
      row.bundleId || "N/A",
      row.recurringType || "N/A",
      row.totalTimeTaken || "N/A",
      row.totalPrice || "N/A",
      row.totalAfterDiscount || "N/A",
      row.razorpayOrderId || "N/A",
      row.razorpayPaymentId || "N/A",
      row.bhk || "N/A",
      row.balcony || "N/A",
      row.bathroom || "N/A",
      row.customerId || "N/A",
      row.bookingReason || "N/A",
      row.partnerId || "N/A",
      row.partnerName || "N/A",
      row.partnerPhoneNo || "N/A",
      row.hubId || "N/A",
      row.hubName || "N/A",
    ]);

    const aoa = [headers, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    worksheet["!cols"] = headers.map((label) => ({
      wch: Math.max(15, label.length + 2),
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Orders");

    XLSX.writeFile(workbook, `orders_${new Date().toISOString()}.xlsx`);
  }, [sortedOrders]);

  // Render icons
  const renderIcons = useCallback((order) => {
    const icons = [];

    const styles = {
      label: {
        color: "#fff",
        fontWeight: 500,
        fontSize: "0.75rem",
      },
      neutralLabel: {
        color: "#333",
        fontWeight: 500,
        fontSize: "0.75rem",
      },
    };

    if (order.bookingType === "INSTANT") {
      icons.push(
        <IconWrapper key="I" bgcolor="#e53935">
          <Typography sx={styles.label}>Instant</Typography>
        </IconWrapper>
      );
    }

    if (order.bookingType === "RECURRING") {
      icons.push(
        <IconWrapper key="R" bgcolor="#ffe082">
          <Typography sx={styles.neutralLabel}>Recurring</Typography>
        </IconWrapper>
      );
    }

    if (order.bookingType === "SCHEDULED") {
      icons.push(
        <IconWrapper key="S" bgcolor="#e0e0e0">
          <Typography sx={styles.neutralLabel}>Scheduled</Typography>
        </IconWrapper>
      );
    }

    if (order.recurringType === "CUSTOM") {
      icons.push(
        <IconWrapper key="C" bgcolor="#f48fb1">
          <Typography sx={styles.neutralLabel}>Custom</Typography>
        </IconWrapper>
      );
    }

    if (order.recurringType === "DAILY") {
      icons.push(
        <IconWrapper key="D" bgcolor="#9fa8da">
          <Typography sx={styles.label}>Daily</Typography>
        </IconWrapper>
      );
    }

    if (order.recurringType === "WEEKLY") {
      icons.push(
        <IconWrapper key="W" bgcolor="#80cbc4">
          <Typography sx={styles.label}>Weekly</Typography>
        </IconWrapper>
      );
    }

    return icons;
  }, []);

  // Copy ID
  const handleCopyId = useCallback((id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  // Reschedule & Assign Hub & Partner
  const handleAdminAssignHubStatusPartner = useCallback(
    async (payload) => {
      try {
        const response = await dispatch(
          AdminAssignHubStatusPartner(payload)
        ).unwrap();
        // console.log("////////////////",response);
        // setDropdownDialogOpen(false);
        // setDropdownDialogRow(null)
        if (response) {
          // Get the specific success message based on the payload type
          let successMessage = response?.message;
          if (!successMessage) {
            switch (payload.type) {
              case "ASSIGN_SECONDARY_PARTNER":
                successMessage = "Secondary worker assigned successfully!";
                break;
              case "REMOVE_ASSIGN_SECONDARY_PARTNER":
                successMessage = "Secondary worker removed successfully!";
                break;
              case "ASSIGN_PARTNER":
                successMessage = "Worker assigned successfully!";
                break;
              case "ASSIGN_HUB":
                successMessage = "Hub assigned successfully!";
                break;
              case "BOOKING_STATUS":
                successMessage = "Booking status updated successfully!";
                break;
              default:
                successMessage = "Operation completed successfully!";
            }
          }
          ShowToast("success", successMessage);
          // Only clear data and refresh on successful operations
          setLastRecordedData({});
          setAllFetchedData([]);
          setRefreshData((prev) => !prev);
        } else {
          ShowToast("error", "Failed to complete operation");
        }
      } catch (error) {
        console.log("error sds", error)
        console.log("error message", error?.message)
        // Handle different error structures
        const errorMessage = 
          error?.response?.data?.error?.message ||  // Axios error: your API structure
          error?.message ||                         // Redux thunk error or direct error
          "Failed to complete operation";           // Fallback
        
        ShowToast("error", errorMessage);
        // Don't clear data or refresh on error - just show the toast
        // Re-throw the error so calling functions can handle rollback
        throw error;
      }
    },
    [dispatch]
  );

  // Status change
  const handleStatusChange = useCallback(
    (bookingId, newStatus) => {
      setStatusMap((prev) => ({
        ...prev,
        [bookingId]: newStatus,
      }));

      // console.log(payload)
      const payload = {
        bookingId,
        status: newStatus,
        type: "BOOKING_STATUS",
      };

      handleAdminAssignHubStatusPartner(payload);
    },
    [statusMap, handleAdminAssignHubStatusPartner]
  );

  // Worker name change
  const handleMaidNameChange = useCallback(
    async (bookingId, maidId) => {
      const loadingKey = `primary_${bookingId}`;
      setMaidOperationLoading(prev => ({ ...prev, [loadingKey]: true }));
      
      const payload = {
        type: "ASSIGN_PARTNER",
        bookingId,
        partnerId: maidId,
      };

      try {
        await handleAdminAssignHubStatusPartner(payload);
        // Only update the UI after successful API call
        setMaidNameMap((prev) => ({
          ...prev,
          [bookingId]: maidId,
        }));
      } catch {
        // Don't change the input on error - user will see the error toast
        // The input will remain in its previous state
      } finally {
        setMaidOperationLoading(prev => ({ ...prev, [loadingKey]: false }));
      }
    },
    [handleAdminAssignHubStatusPartner]
  );

  // Secondary partner assignment
  const handleSecondaryPartnerChange = useCallback(
    async (bookingId, maidId) => {
      const loadingKey = `secondary_${bookingId}`;
      setMaidOperationLoading(prev => ({ ...prev, [loadingKey]: true }));
      
      const payload = {
        type: "ASSIGN_SECONDARY_PARTNER",
        bookingId,
        partnerId: maidId,
      };

      try {
        await handleAdminAssignHubStatusPartner(payload);
        // Only update the UI after successful API call
        setSecondaryPartnerMap((prev) => ({
          ...prev,
          [bookingId]: maidId,
        }));
      } catch {
        // Don't change the input on error - user will see the error toast
        // The input will remain in its previous state
      } finally {
        setMaidOperationLoading(prev => ({ ...prev, [loadingKey]: false }));
      }
    },
    [handleAdminAssignHubStatusPartner]
  );

  // Remove secondary partner
  const handleRemoveSecondaryPartner = useCallback(
    async (bookingId) => {
      const loadingKey = `secondary_${bookingId}`;
      setMaidOperationLoading(prev => ({ ...prev, [loadingKey]: true }));
      
      const payload = {
        type: "REMOVE_ASSIGN_SECONDARY_PARTNER",
        bookingId,
      };

      try {
        await handleAdminAssignHubStatusPartner(payload);
        // Only update the UI after successful API call
        setSecondaryPartnerMap((prev) => ({
          ...prev,
          [bookingId]: null,
        }));
        // Hide secondary worker section after removal
        setShowSecondaryMaidSection((prev) => ({
          ...prev,
          [bookingId]: false,
        }));
      } catch {
        // Don't change the input on error - user will see the error toast
        // The input will remain in its previous state
      } finally {
        setMaidOperationLoading(prev => ({ ...prev, [loadingKey]: false }));
      }
    },
    [handleAdminAssignHubStatusPartner]
  );

  // Toggle secondary worker section
  const handleToggleSecondaryMaid = useCallback((bookingId) => {
    setShowSecondaryMaidSection((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  }, []);

  // Save status
  const handleSave = useCallback(
    async (rowId, value, isChild) => {
      const payload = {
        bookingId: rowId,
        status: value,
      };
      try {
        let response, toastMessage;
        if (activeTab !== 2 && activeTab === 5 && !isChild) {
          response = await dispatch(updateBookingStatus(payload)).unwrap();
          toastMessage =
            response?.message || "Booking Status updated Successfully!!";
          if (response?.status === true) {
            ShowToast("success", toastMessage);
          }
        } else {
          response = await dispatch(postSectorSavedata(payload)).unwrap();
          toastMessage =
            response?.data?.message || "Booking Status updated Successfully!!";
          if (response?.data?.success === true) {
            ShowToast("success", toastMessage);
          }
        }
        setRefreshData((prev) => !prev);
        setExpandedRows({});
      } catch { }
    },
    [dispatch, activeTab]
  );

  // Save Worker
  const handleSaveMaid = useCallback(
    async (bookingId, maidId) => {
      if (!maidId) {
        ShowToast("error", "Worker not selected");
        return;
      }
      const payload = {
        bookingId,
        partnerId: maidId,
      };
      try {
        const response = await dispatch(saveMaidMatch(payload)).unwrap();
        if (response?.success) {
          ShowToast("success", "Worker assigned successfully!");
          // setExpandedRows({});
          setRefreshData((prev) => !prev);
          setInitialMaidMap((prev) => ({
            ...prev,
            [bookingId]: maidId,
          }));
        } else {
          ShowToast("error", "Failed to assign worker");
        }
      } catch {
        ShowToast("error", "Failed to assign worker");
      }
    },
    [dispatch]
  );

  const handleReSechuleDateChange = (date, id) => {
    // console.log("?????", date);
    setStartDate((prev) => ({
      ...prev,
      bookingId: id,
      rescheduleDate: date,
    }));
    handleReSechuleDateAPI(id, date);
  };

  const handleReSechuleDateAPI = useCallback(
    async (bookingId, rescheduleDate) => {
      const payload = {
        bookingId,
        timeSlot: formatTimeString(rescheduleDate),
      };
      // console.log("payload", payload);

      try {
        const response = await dispatch(ReScheduleDate(payload)).unwrap();
        // console.log("response", response);
        setDropdownDialogOpen(false);
        setDropdownDialogRow(null);
        if (response) {
          ShowToast(
            "success",
            response?.message || "Reschedule the date successfully!"
          );
          // Only clear data and refresh on successful operations
          setLastRecordedData({});
          setAllFetchedData([]);
          setRefreshData((prev) => !prev);
        } else {
          ShowToast("error", "Failed to Reschedule the date");
        }
      } catch (error) {
        // Handle different error structures
        const errorMessage =                 // Direct API error structure
          error?.response?.data?.error?.message ||  // Axios error: your API structure
          error?.message ||                         // Redux thunk error or direct error
          "Failed to Reschedule the date";          // Fallback
        
        ShowToast("error", errorMessage);
        // Don't clear data or refresh on error - just show the toast
      }
    },
    [dispatch]
  );

  const handleParentBookingPartnerAPI = useCallback(
    async (payload) => {
      try {
        const response = await dispatch(parentBookingMaidId(payload)).unwrap();
        console.log("response", response);
        if (response) {
          ShowToast(
            "success",
            response?.message || "Parent booking worker assigned successfully!"
          );
          setRefreshData((prev) => !prev);
        } else {
          setParentBookingPartner({});
        }
      } catch (error) {
        ShowToast(
          "error",
          error?.message || "Failed to assign parent booking worker"
        );
      }
    },
    [dispatch]
  );

  const handleParentBookingPartnerChange = useCallback(
    (parentBookingId, maidId) => {
      setParentBookingPartner((prev) => ({
        ...prev,
        [parentBookingId]: maidId,
      }));

      const payload = {
        parentBookingId: parentBookingId,
        preferredPartnerId: maidId,
      };
      // console.log("payload", payload);
      handleParentBookingPartnerAPI(payload);
    },
    []
  );

  // Hub selection
  // const handleSaveHubSelection = async (bookingId, hubId) => {
  //   try {
  //     await dispatch(saveHubSelection({ bookingId, hubId })).unwrap();
  //     ShowToast("success", "Hub selection saved!");
  //   } catch {
  //     ShowToast("error", "Failed to save hub selection");
  //     setHubSelection({});
  //   }
  // };

  // Hub name change
  const handleHubNameChange = (e, bookingId) => {
    const selectedId = e.target.value;
    setHubSelection((prev) => ({
      ...prev,
      [bookingId]: selectedId,
    }));
    setErrors((prev) => ({
      ...prev,
      hub: false,
    }));
    // handleSaveHubSelection(bookingId, selectedId);
    handleAdminAssignHubStatusPartner({
      type: "ASSIGN_HUB",
      bookingId,
      hubId: selectedId,
    });
  };

  // Tab navigation
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    navigate(`/bookings/${normalizedTabs[newValue]}`);
    // Set pageSize to 100 for tab 2, else 20
    setPageSize(newValue === 2 ? 100 : 20);
    setRefreshData((prev) => !prev);
    setLastRecordedData({});
    setAllFetchedData([]);
    setExpandedRows({});
    setInitialMaidMap({});
    setMaidNameMap({});
    setSecondaryPartnerMap({});
    setHubSelection({});
    setErrors({});
    setStartDate({});
    setDateRange({});
    setDropdownDialogOpen(null);
    setDropdownDialogRow(null);
    setShowDatePicker(null);
    setParentBookingPartner({});
    setShowSecondaryMaidSection({});
    setMaidOperationLoading({});
  };

  //Order View details
  const handleViewDetails = useCallback((row) => {
    setViewDetailsData(row || {});
    setViewDetails(true);
  });

  const handleCloseViewDetails = useCallback(() => {
    setViewDetails(false);
    setViewDetailsData({});
  });

  // console.log(fetchDataWithTimer);

  const fetchClearDate = useCallback(() => {
    const startDate = new Date(dateRange.start).toDateString();
    const endDate = new Date(dateRange.end).toDateString();

    // console.log(startDate, endDate);

    // console.log(startDate === endDate);

    if (startDate === endDate) {
      setLastRecordedData(null);
      // console.log(lastRecordData);
    }
  }, [dateRange.start, dateRange.end]);

  useEffect(() => {
    fetchClearDate();
  }, [fetchClearDate]);

  const RemoveAllStates = useCallback(() => {
    setActiveTab(null);
    setLastRecordedData(null);
    setAllFetchedData([]);
    setBookingDropdownType(null);
    setCopied(null);
    setCurrentPage(null);
    setDropdownDialogOpen(null);
    setDateRange(null);
    setDropdownDialogRow(null);
    setErrors(null);
    setHubSelection(null);
    setInitialMaidMap(null);
    setIsLoading(null);
    setIsNextDisabled(null);
    setBookingType(null);
    setRecurringType(null);
    setRefreshData(null);
    setMaidName(null);
    setShowDatePicker(null);
  });

  // console.log(sortedOrders);

  return (
    <Box height="100vh" sx={{}}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={{ xs: 2, md: 0 }}
        sx={{ width: "100%", mb: 2 }}
      >
        {/* Tabs Section */}
        <Box sx={{ flex: 1, width: "100%" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{ minHeight: 0 }}
            TabIndicatorProps={{ style: { backgroundColor: "#00b664" } }}
          >
            {TABS.map((tab, idx) => {
              // For alerts tab (index 2), create custom label with notification icon
              if (idx === 2) {
                const alertCount = alertsCount > 100 ? "100+" : alertsCount;
                return (
                  <Tab
                    key={tab.key}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{tab.Label}</span>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alertsCount > 0 ? '#ff1744' : '#9e9e9e',
                            color: 'white',
                            borderRadius: '12px',
                            minWidth: '24px',
                            height: '24px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            padding: '0 8px',
                            boxShadow: alertsCount > 0 ? '0 2px 8px rgba(255, 23, 68, 0.4)' : 'none',
                            border: alertsCount > 0 ? '2px solid #ff1744' : '2px solid #9e9e9e',
                            animation: alertsCount > 0 ? 'alertsPulse 2s ease-in-out infinite' : 'none',
                            '@keyframes alertsPulse': {
                              '0%': {
                                transform: 'scale(1)',
                                boxShadow: '0 2px 8px rgba(255, 23, 68, 0.4)',
                              },
                              '50%': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 12px rgba(255, 23, 68, 0.6)',
                              },
                              '100%': {
                                transform: 'scale(1)',
                                boxShadow: '0 2px 8px rgba(255, 23, 68, 0.4)',
                              },
                            },
                          }}
                        >
                          {alertCount}
                        </Box>
                      </Box>
                    }
                    sx={{
                      textTransform: "capitalize",
                      color: activeTab === idx ? "#00b664" : "black",
                      fontWeight: activeTab === idx ? "bold" : "normal",
                      borderBottom:
                        activeTab === idx ? "2px solid #00b664" : "none",
                      "&.Mui-selected": {
                        color: "#00b664",
                      },
                    }}
                  />
                );
              }

              // For other tabs, use regular label
              return (
                <Tab
                  key={tab.key}
                  label={tab.Label}
                  sx={{
                    textTransform: "capitalize",
                    color: activeTab === idx ? "#00b664" : "black",
                    fontWeight: activeTab === idx ? "bold" : "normal",
                    borderBottom:
                      activeTab === idx ? "2px solid #00b664" : "none",
                    "&.Mui-selected": {
                      color: "#00b664",
                    },
                  }}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Auto Refresh Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
            alignItems: "center",
            width: { xs: "100%", md: "auto" },
            mt: { xs: 1, md: 0 },
          }}
        >
          <AutoRefreshPage fetchDataWithTimer={fetchDataWithTimer} />
        </Box>
      </Stack>

      <Box sx={{ mt: 2 }}>
        {isLoading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <CustomLoader />
          </Box>
        )}
        <NewTableFilters
          searchText={searchText}
          handleSearchChange={handleSearchChange}
          bookingDropdownType={bookingDropdownType}
          setBookingDropdownType={setBookingDropdownType}
          statusType={statusType}
          setStatusType={setStatusType}
          recurringType={recurringType}
          setRecurringType={setRecurringType}
          exportCSV={exportExcel}
          activeTab={activeTab}
          bookingType={bookingType}
          setBookingType={setBookingType}
          statusTypeOptions={statusTypeOptions}
          recurringTypeOptions={recurringTypeOptions}
          bookingTypes={bookingTypes}
          setDateRange={setDateRange}
          dateRange={dateRange}
          handleBookingDropdownType={handleBookingDropdownType}
          handleRecurringTypeChange={handleRecurringTypeChange}
          //handleStatusTypeChange={handleStatusTypeChange}
          handleSelectChange={handleSelectChange}
          hubsDropdown={hubsDropdown}
          handleHubsTypeChange={handleHubsTypeChange}
          selectedHub={selectedHub}
        />

        <Stack height={"76vh"}>
          <NewTableComponent
            headers={headers}
            // paginatedOrders={sortedOrders}
            paginatedOrders={sortedOrders}
            handleSortRequest={handleSortRequest}
            orderBy={orderBy}
            order={order}
            expandedRows={expandedRows}
            activeTab={activeTab}
            childData={childData}
            statusMap={statusMap}
            handleStatusChange={handleStatusChange}
            handleSave={handleSave}
            copied={copied}
            handleCopyId={handleCopyId}
            showDatePicker={showDatePicker}
            selectedRowId={selectedRowId}
            handleCalendarClick={setSelectedRowId}
            setShowDatePicker={setShowDatePicker}
            setSelectedRowId={setSelectedRowId}
            handleDateChange={handleDateChange}
            setIsBundleRecord={setIsBundleRecord}
            setSlotOne={setSlotOne}
            renderIcons={renderIcons}
            statusOptions={statusOptions}
            statusOptionsRecurring={statusOptionsRecurring}
            maidName={maidName}
            handleSaveMaid={handleSaveMaid}
            maidNameMap={maidNameMap}
            handleMaidNameChange={handleMaidNameChange}
            initialMaidMap={initialMaidMap}
            secondaryPartnerMap={secondaryPartnerMap}
            handleSecondaryPartnerChange={handleSecondaryPartnerChange}
            handleRemoveSecondaryPartner={handleRemoveSecondaryPartner}
            setExpandedRows={setExpandedRows}
            hubsDropdown={hubsDropdown}
            hubSelection={hubSelection}
            handleHubNameChange={handleHubNameChange}
            errors={errors}
            bookingDropdownType={bookingDropdownType}
            handleViewDetails={handleViewDetails}
            setStartDate={setStartDate}
            startDate={startDate}
            handleReSechuleDateChange={handleReSechuleDateChange}
            setDropdownDialogOpen={setDropdownDialogOpen}
            setDropdownDialogRow={setDropdownDialogRow}
            dropdownDialogOpen={dropdownDialogOpen}
            dropdownDialogRow={dropdownDialogRow}
            setParentBookingPartner={setParentBookingPartner}
            parentBookingPartner={parentBookingPartner}
            handleParentBookingPartnerChange={handleParentBookingPartnerChange}
            showSecondaryMaidSection={showSecondaryMaidSection}
            handleToggleSecondaryMaid={handleToggleSecondaryMaid}
            maidOperationLoading={maidOperationLoading}
          />

          <NewPagination
            ordersByDateData={allFetchedData}
            search={searchText}
            pageSize={pageSize}
            setPageSize={setPageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handlePageSizeChange={handlePageSizeChange}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            isNextDisabled={isNextDisabled}
          />

          {viewDetails && (
            <ViewDetailsModal
              open={viewDetails}
              onClose={handleCloseViewDetails}
              row={viewDetailsData}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default OrdersPage;
