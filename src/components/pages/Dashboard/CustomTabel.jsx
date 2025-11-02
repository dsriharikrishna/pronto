import React, { useState, useEffect, useCallback } from "react";
import { Box, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchChildOrders,
//   fetchDashboardData,
//   fetchOrdersByDate,
//   postSectorSavedata,
//   updateBookingSchedule,
//   updateBookingStatus,
//   updateSchedule,
// } from "../../redux/slicers/dashboardSlice";
import { styled } from "@mui/system";
import {
  formatDateTime,
  formatTimeString,
  getDayName,
} from "../../utils/helper";
import CustomLoader from "../../components/Models/CustomLoader";
import debounce from "lodash.debounce";
import { ShowToast } from "../../components/ToastAndSnacks/ShowToast";
import TableComponent from "../../components/Models/TableComponent";
import TableFilters from "../../components/Models/TableFilters";
import Pagination from "../../components/Models/Pagination";
import {
  fetchChildOrders,
  fetchOrdersByDate,
  postSectorSavedata,
  saveHubSelection,
  saveMaidMatch,
  updateBookingSchedule,
  updateSchedule,
} from "../../redux/slicers/dashboardSlice";
import { fetchHubsDataForPartners } from "../../redux/slicers/partnerSlice";
import FormHelperText from "@mui/material/FormHelperText";
import { fetchDashboardData } from "../../redux/slicers/dashboardSlice";
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

const CustomTable = ({ bookingType, activeTab }) => {
  const dispatch = useDispatch();
  const { ordersByDateData } = useSelector((state) => state.dashboard);
  const loading = useSelector((state) => state.dashboard.loading);

  // Add these states for hubs
  const [hubsDropdown, setHubsDropdown] = useState([]);
  const [hubSelection, setHubSelection] = useState({});
  const [errors, setErrors] = useState({});
  // const [isLoadingHubs, setIsLoadingHubs] = useState(false);
  const [timeline, setTimeline] = useState("today");
  const [statusType, setStatusType] = useState(["PENDING_MATCH"]);
  const [recurringType, setRecurringType] = useState("All");
  const [expandedRows, setExpandedRows] = useState({});
  const [childData, setChildData] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const [isBundleRecord, setIsBundleRecord] = useState(false);
  const [slotOne, setSlotOne] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [maidName, setMaidName] = useState([]);
  const [maidNameMap, setMaidNameMap] = useState([]);
  const [initialMaidMap, setInitialMaidMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const hubsData = useSelector((state) => state.partners?.partnersHubsData);
  const RecurringData = useSelector((state) => state.dashboard?.recurringData);

  // Check for notifications when orders data changes
  useEffect(() => {
    console.log('🔄 CustomTabel: Orders data changed, checking notifications...');
    console.log('📊 Orders data:', ordersByDateData?.data?.length || 0, 'bookings');
    
    if (ordersByDateData?.data) {
      checkAndNotify(ordersByDateData.data);
    } else {
      console.log('ℹ️ CustomTabel: No orders data available');
    }
  }, [ordersByDateData?.data]);

  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;

  const statusOptionsRecurring = [
    { key: "PENDING_MATCH", label: "Pending Match" },
    { key: "CANCELLED", label: "Cancelled" },
    // { key: "STARTED", label: "Started" },
  ];

  const statusOptions = [
    { key: "PENDING_MATCH", label: "Pending Match" },
    { key: "CANCELLED", label: "Cancelled" },
    { key: "COMPLETED", label: "Completed" },
    { key: "STARTED", label: "Started" },
  ];

  const timelineOptions = [
    { label: "All", value: "All" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "thisWeek" },
    { label: "This Month", value: "thisMonth" },
  ];

  const statusTypeOptions = [
    { label: "All", value: "All" },
    { label: "Pending Match", value: "PENDING_MATCH" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Started", value: "STARTED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const recurringTypeOptions = [
    { label: "All", value: "All" },
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Custom", value: "Custom" },
  ];

  const headers = [
    { id: "bookingId", label: "Order ID", sortable: false },
    { id: "sourceType", label: "Booking Type", sortable: false },
    { id: "submitTime", label: "Submit Time", sortable: true },
    { id: "scheduledFor", label: "Scheduled Time", sortable: true },
    { id: "customerDetails", label: "Customer Details", sortable: false },
    { id: "address", label: "Address", sortable: false },
    { id: "bhk", label: "BHK", sortable: false },
    { id: "services", label: "Services", sortable: false },
    { id: "price", label: "Price", sortable: true },
    { id: "maidName", label: "Worker Name", sortable: false },
    { id: "Hubs", label: "Hubs", sortable: false },
    { id: "actions", label: "Actions", sortable: false },
  ];

  // useEffect(() => {
  //   setIsLoading(loading);
  // }, [loading, isLoading]);

  useEffect(() => {
    let computedTimeline;

    if (activeTab === 0) {
      computedTimeline = "today";
    } else if (activeTab === 1) {
      computedTimeline = "tomorrow";
    } else {
      computedTimeline = timeline;
    }
    const serviceTypeFilter =
      activeTab === 0 || activeTab === 1 ? "All" : bookingType;

    // Initial fetch with loading
    const fetchDataWithLoading = () => {
      setIsLoading(true);
      dispatch(
        fetchOrdersByDate({
          selectedTimeFilter: computedTimeline,
          serviceTypeFilter: serviceTypeFilter,
          selectedStatus: statusType,
          selectedRecurringType: recurringType,
          page: currentPage,
          limit: pageSize,
          search: searchText,
        })
      ).finally(() => setIsLoading(false));
    };

    // Interval fetch without loading
    const fetchDataWithoutLoading = () => {
      dispatch(
        fetchOrdersByDate({
          selectedTimeFilter: computedTimeline,
          serviceTypeFilter: serviceTypeFilter,
          selectedStatus: statusType,
          selectedRecurringType: recurringType,
          page: currentPage,
          limit: pageSize,
          search: searchText,
        })
      );
    };

    // Initial fetch
    fetchDataWithLoading();

    // Set up interval to fetch every minute (60000 milliseconds)
    const intervalId = setInterval(fetchDataWithoutLoading, 60000);

    return () => clearInterval(intervalId);
  }, [
    dispatch,
    activeTab,
    bookingType,
    statusType,
    recurringType,
    timeline,
    refreshData,
    currentPage,
    pageSize,
    searchText,
  ]);

  // Fetch hubs data and set dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setIsLoadingHubs(true);
        const response = await dispatch(fetchHubsDataForPartners()).unwrap();
        // console.log("Hubs Data:", response?.data?.hubs);
        const hubs = response?.data?.hubs || [];
        const filteredHubs = hubs
          .filter((item) => item.address)
          .map((item) => ({
            id: item.id,
            address: item.address,
          }));
        setHubsDropdown(filteredHubs);
      } catch (error) {
        ShowToast("error", "Failed to load hubs data");
      } finally {
        // setIsLoadingHubs(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // console.log(hubSelection)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchDashboardData()).unwrap();
        const toTitleCase = (str) => {
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };
        const maidNames = response?.data?.data
          .filter(
            (item) =>
              item.name &&
              item.id &&
              (item.status === "active" || item.status === "unavailable")
          )

          .map((item) => ({
            id: item.id,
            name: toTitleCase(item.name),
            status: item.status,
          }));
        setMaidName(maidNames);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, [dispatch, refreshData]);

  // useEffect(() => {
  //   dispatch(fetchDashboardData());
  // }, [dispatch]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await dispatch(fetchDashboardData()).unwrap();
  //       const toTitleCase = (str) => {
  //         return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  //       };
  //       const maidNames = response?.data?.data
  //         .filter(item =>
  //           item.name &&
  //           item.id &&
  //           item.status === "active" &&
  //           item.type === "PARTNER"
  //         )
  //         .map(item => ({
  //           id: item.id,
  //           name: toTitleCase(item.name)
  //         }));

  //       setMaidName(maidNames);
  //       console.log("Active Worker Names:", maidNames); // For debugging
  //     } catch (error) {
  //       console.error("Failed to fetch dashboard data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [dispatch]);

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setSearchText(searchValue);
      setCurrentPage(1);
    }, 300),
    []
  );
  const handleSearchChange = useCallback((e) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  // Add this function to call your API
  const handleSaveHubSelection = useCallback(async (bookingId, hubId) => {
    try {
      await dispatch(saveHubSelection({ bookingId, hubId })).unwrap();
      ShowToast("success", "Hub selection saved!");
    } catch (error) {
      ShowToast("error", "Failed to save hub selection");
      setHubSelection({});
    }
  }, [dispatch]);

  const handleHubNameChange = useCallback((e, bookingId) => {
    const selectedId = e.target.value;
    setHubSelection((prev) => ({
      ...prev,
      [bookingId]: selectedId,
    }));
    setErrors((prev) => ({
      ...prev,
      hub: false,
    }));
    handleSaveHubSelection(bookingId, selectedId);
  }, [handleSaveHubSelection]);

  const handlePageSizeChange = useCallback((e) => {
    const newPageSize = e.target.value;
    const totalRecords = ordersByDateData?.total || 0;
    const totalPages = Math.ceil(totalRecords / newPageSize);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    setPageSize(newPageSize);
  }, [ordersByDateData, currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < ordersByDateData?.totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, ordersByDateData]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }, [currentPage]);

  const handleRowExpand = useCallback(async (rowId) => {
    setExpandedRows({});
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));

    if (!childData[rowId]) {
      try {
        const response = await dispatch(
          fetchChildOrders({ parentId: rowId, timeline })
        ).unwrap();
        setChildData(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch child orders:", error);
      }
    }
  }, [childData, dispatch, timeline]);

  const handleSortRequest = useCallback((property) => {
    if (orderBy !== property) {
      setOrder("asc");
      setOrderBy(property);
    } else if (order === "asc") {
      setOrder("desc");
    } else if (order === "desc") {
      setOrder("");
      setOrderBy("");
    } else {
      setOrder("asc");
    }
    setPage(0);
  }, [orderBy, order]);

  const handleDateChange = useCallback(async (date, bookingId, isChild) => {
    const payload = {
      bookingId: bookingId,
      isBundleRecord: isBundleRecord,
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
    } catch (error) {
      console.error("Failed to update", error);
    }

    setShowDatePicker(false);
    setSelectedRowId(null);
  }, [dispatch, isBundleRecord, slotOne, activeTab]);

  const handleCalendarClick = useCallback((bookingId) => {
    setSelectedRowId(bookingId);
    setShowDatePicker(true);
  }, []);

  // const sortedOrders = React.useMemo(() => {
  //   let sortableOrders = Array.isArray(ordersByDateData?.data)
  //     ? [...ordersByDateData?.data]
  //     : [];
  //   if (orderBy) {
  //     sortableOrders.sort((a, b) => {
  //       if (a[orderBy] < b[orderBy]) {
  //         return order === "asc" ? -1 : 1;
  //       }
  //       if (a[orderBy] > b[orderBy]) {
  //         return order === "asc" ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
  //   return sortableOrders;
  // }, [ordersByDateData, order, orderBy]);

  const sortedOrders = React.useMemo(() => {
    let data = Array.isArray(ordersByDateData?.data)
      ? [...ordersByDateData.data]
      : [];
    if (!orderBy || !order) return data;
    return data.reverse();
  }, [ordersByDateData, order, orderBy]);

  // const filteredOrders = sortedOrders.filter((order) =>
  //   Object.values(order).some((value) =>
  //     String(value).toLowerCase().includes(searchText.toLowerCase())
  //   )
  // );

  const paginatedOrders = sortedOrders.slice(startIndex, endIndex);

  const exportCSV = useCallback(() => {
    // Helper to escape values safely for CSV
    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    // Column headers
    const headers = [
      "Booking ID",
      "Source",
      "Booking Type",
      "Submit Time",
      "Scheduled For",
      "Customer Name",
      "Phone",
      "Address",
      "BHK",
      "Floor",
      "Bathroom",
      "Balcony",
      "Services",
      "Recurring Type",
      "Price",
      "Price Type",
      "Status",
      "Reason",
      "Bundle ID",
    ];

    // Data rows
    const rows = paginatedOrders.map((row) => [
      escapeCSV(row.bookingId),
      escapeCSV(row.source),
      escapeCSV(row.type),
      escapeCSV(row.submitTime),
      escapeCSV(row.scheduledFor),
      escapeCSV(row.name),
      escapeCSV(row.phone),
      escapeCSV(row.address + "" + row.houseNo + "" + row.landmark),
      escapeCSV(row.bhk),
      escapeCSV(row.floor),
      escapeCSV(row.bathroom),
      escapeCSV(row.balcony),
      escapeCSV(row.services),
      escapeCSV(row.recurringType),
      escapeCSV(row.price),
      escapeCSV(row.priceDependent),
      escapeCSV(row.status),
      escapeCSV(row.reason),
      escapeCSV(row.bundleId),
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  // const renderIcons = (order) => {
  //   const icons = [];

  //   if (order.source === "App") {
  //     icons.push(
  //       <IconWrapper key="A" bgcolor="#f3e5f5">
  //         A
  //       </IconWrapper>
  //     );
  //   }
  //   if (order.bundleId) {
  //     icons.push(
  //       <IconWrapper key="B" bgcolor="#fff9c4">
  //         B
  //       </IconWrapper>
  //     );
  //   }

  //   if (order.recurringType === "CUSTOM") {
  //     icons.push(
  //       <IconWrapper key="C" bgcolor="#f8bbd0">
  //         C
  //       </IconWrapper>
  //     );
  //   }

  //   if (order.recurringType === "DAILY") {
  //     icons.push(
  //       <IconWrapper key="D" bgcolor="#c5cae9">
  //         D
  //       </IconWrapper>
  //     );
  //   }

  //   if (order.type === "INSTANT" && activeTab !== 3) {
  //     icons.push(
  //       <IconWrapper key="I" bgcolor="#fff1f1">
  //         I
  //       </IconWrapper>
  //     );
  //   }
  //   if (order.type === "RECURRING" && activeTab !== 5 && !order.bundleId) {
  //     icons.push(
  //       <IconWrapper key="R" bgcolor="#ffecb3">
  //         R
  //       </IconWrapper>
  //     );
  //   }
  //   if (order.type === "SCHEDULED" && activeTab !== 4) {
  //     icons.push(
  //       <IconWrapper key="S" bgcolor="#f2f1f1">
  //         S
  //       </IconWrapper>
  //     );
  //   }
  //   if (order.recurringType === "WEEKLY") {
  //     icons.push(
  //       <IconWrapper key="W" bgcolor="#b2dfdb">
  //         W
  //       </IconWrapper>
  //     );
  //   }

  //   return icons;
  // };

  const renderIcons = (order) => {
    const icons = [];

    if (order.type === "INSTANT") {
      icons.push(
        <IconWrapper key="I" bgcolor="#fff1f1">
          Instant
        </IconWrapper>
      );
    }
    if (order.type === "RECURRING") {
      icons.push(
        <IconWrapper key="R" bgcolor="#ffecb3">
          Recurring
        </IconWrapper>
      );
    }
    if (order.type === "SCHEDULED") {
      icons.push(
        <IconWrapper key="S" bgcolor="#f2f1f1">
          Scheduled
        </IconWrapper>
      );
    }

    if (order.recurringType === "CUSTOM") {
      icons.push(
        <IconWrapper key="C" bgcolor="#f8bbd0">
          Custom
        </IconWrapper>
      );
    }

    if (order.recurringType === "DAILY") {
      icons.push(
        <IconWrapper key="D" bgcolor="#c5cae9">
          Daily
        </IconWrapper>
      );
    }
    if (order.recurringType === "WEEKLY") {
      icons.push(
        <IconWrapper key="W" bgcolor="#b2dfdb">
          Weekly
        </IconWrapper>
      );
    }
      if (order.bundleId) {
        icons.push(
          <IconWrapper key="B" bgcolor="#fff9c4">
            Bundle
          </IconWrapper>
        );
      }

    return icons;
  };

  const handleCopyId = useCallback((id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const handleStatusChange = useCallback((bookingId, newStatus) => {
    setStatusMap((prev) => ({
      ...prev,
      [bookingId]: newStatus,
    }));
  }, []);

  const handleMaidNameChange = useCallback((bookingId, maidId) => {
    setMaidNameMap((prev) => ({
      ...prev,
      [bookingId]: maidId,
    }));
  }, []);

  const handleSave = useCallback(async (rowId, value, isChild) => {
    const payload = {
      bookingId: rowId,
      status: value,
    };
    if (activeTab !== 2 && activeTab === 5 && !isChild) {
      try {
        const response = await dispatch(updateBookingStatus(payload)).unwrap();
        const toastMessage =
          response?.message || "Booking Status updated Successfully!!";
        if (response?.status === true) {
          ShowToast("success", toastMessage);
        }
        setRefreshData((prev) => !prev);
        setExpandedRows({});
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await dispatch(postSectorSavedata(payload)).unwrap();
        const toastMessage =
          response?.data?.message || "Booking Status updated Successfully!!";
        if (response?.data?.success === true) {
          ShowToast("success", toastMessage);
        }
        setExpandedRows({});
        setRefreshData((prev) => !prev);
      } catch (error) {
        console.log(error);
      }
    }
  }, [activeTab, dispatch]);

  // In CustomTable.jsx
  const handleSaveMaid = useCallback(async (bookingId, maidId) => {
    try {
      if (!maidId) {
        ShowToast("error", "Worker not selected");
        return;
      }
      const payload = {
        bookingId: bookingId,
        partnerId: maidId,
      };
      const response = await dispatch(saveMaidMatch(payload)).unwrap();
      if (response?.success) {
        ShowToast("success", "Worker assigned successfully!");
        setExpandedRows({});
        setRefreshData((prev) => !prev);
        setInitialMaidMap((prev) => ({
          ...prev,
          [bookingId]: maidId,
        }));
      } else {
        ShowToast("error", "Failed to assign worker");
      }
    } catch (error) {
      console.error("Failed to assign worker:", error);
      ShowToast("error", "Failed to assign worker");
    }
  }, [dispatch]);

  return (
    <Box sx={{ mt: 2}}>
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
      <TableFilters
        searchText={searchText}
        handleSearchChange={handleSearchChange}
        timeline={timeline}
        setTimeline={setTimeline}
        statusType={statusType}
        setStatusType={setStatusType}
        recurringType={recurringType}
        setRecurringType={setRecurringType}
        exportCSV={exportCSV}
        activeTab={activeTab}
        bookingType={bookingType}
        timelineOptions={timelineOptions}
        statusTypeOptions={statusTypeOptions}
        recurringTypeOptions={recurringTypeOptions}
      />

      <Stack height={"75vh"}>
        <TableComponent
          headers={headers}
          paginatedOrders={paginatedOrders}
          handleSortRequest={handleSortRequest}
          orderBy={orderBy}
          order={order}
          expandedRows={expandedRows}
          handleRowExpand={handleRowExpand}
          activeTab={activeTab}
          childData={childData}
          statusMap={statusMap}
          handleStatusChange={handleStatusChange}
          handleSave={handleSave}
          copied={copied}
          handleCopyId={handleCopyId}
          showDatePicker={showDatePicker}
          selectedRowId={selectedRowId}
          handleCalendarClick={handleCalendarClick}
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
          setExpandedRows={setExpandedRows}
          // Pass these new props for hubs
          hubsDropdown={hubsDropdown}
          hubSelection={hubSelection}
          handleHubNameChange={handleHubNameChange}
          errors={errors}
          // isLoadingHubs={isLoadingHubs}
        />

        <Pagination
          ordersByDateData={ordersByDateData}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handlePageSizeChange={handlePageSizeChange}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
        />
      </Stack>
    </Box>
  );
};

export default CustomTable;
