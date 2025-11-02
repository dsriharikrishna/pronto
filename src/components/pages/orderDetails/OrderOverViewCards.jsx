import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Box,
} from "@mui/material";
import OrderFlow from "./OrderFlow";

import {
  CalendarBlank,
  Clock,
  Cube,
  Package,
  Pencil,
  UserPlus,
} from "phosphor-react";
import CustomDatePicker from "../../components/Models/CustomDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { ShowToast } from "../../components/ToastAndSnacks/ShowToast";
import { useSearchParams } from "react-router-dom";
import {
  postSectorSavedata,
  saveMaidMatch,
  updateBookingSchedule,
  updateBookingStatus,
} from "../../redux/slicers/ordersSlice";
import { formatTimeString, formatDateTime } from "../../utils/helper";
import { set } from "lodash";

const OrderOverViewCards = ({ bookingInfo, serviceInfo, maidName, maidSuccess, dateChanged }) => {
  const [allMadeNames, setAllMadeNames] = useState([]);
  const [isBundleId, setIsBundleId] = useState(bookingInfo?.bundleId || false);
  const [isCatalog, setIsCatalog] = useState(bookingInfo?.reason);
  const dispatch = useDispatch();
  const [orderDetailsInfo, setOrderDetailsInfo] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [selectedName, setSelectedName] = useState("");
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [maidNameMap, setMaidNameMap] = useState([]);
  const [isStatusUpdated, setIsStatusUpdated] = useState();
  const [isDateSelected, setIsDateSelected] = useState("");

  const { partners } = useSelector((state) => state.dashboard);
  // console.log("Workers", partners);
  const data = useSelector((state) => state.dashboard?.data?.booking);
  console.log("Data", maidName);

  useEffect(() => {
    if (maidName) {
      // Ensure maidNames is properly formatted as an array of objects with id and name
      const formattedMaidNames = Array.isArray(maidName)
        ? maidName.map((maid) => ({
            id: maid.id || Math.random().toString(36).substring(2, 9),
            name: maid.name?.toLowerCase() || "unknown",
          }))
        : [{ id: "1", name: maidName.toLowerCase() }];

      setAllMadeNames(formattedMaidNames);

      // Set initial selected value if not already set
      if (!selectedName && formattedMaidNames.length > 0) {
        // setSelectedName(formattedMaidNames[0].id);
        setSelectedName("Hello");
      }
    }
  }, [maidName]);


  const [params] = useSearchParams();
  const BookingId = params.get("id");
  const maidNames = data?.partnerInfo?.partnerName;

  const bookingId = "102ca289-dafc-4204-9";
  const statusOptions = [
    { key: "PENDING_MATCH", label: "Pending Match" },
    { key: "CANCELLED", label: "Cancelled" },
    { key: "COMPLETED", label: "Completed" },
    { key: "STARTED", label: "Started" },
  ];

  const handleStatusChange = async (bookingId, newStatus) => {
    console.log("Status is >>", bookingId, newStatus);
    setIsStatusUpdated(newStatus);
    setStatusMap((prev) => ({
      ...prev,
      [bookingId]: newStatus,
    }));

    const payload = {
      bookingId: bookingId,
      status: newStatus,
    };
    try {
      const response = await dispatch(postSectorSavedata(payload)).unwrap();
      const toastMessage =
        response?.message || "Booking Status updated Successfully!!";
      if (response?.status === true);
      {
        ShowToast("success", toastMessage);
      }
      setRefreshData((prev) => !prev);
      //   setExpandedRows({});
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenCalender = () => {
    console.log("Calender Clicked");
    setIsCalenderOpen(true);
  };

  const handleDateChange = async (date, bookingId, isChild) => {
    const isBundleRecord = isBundleId ? true : false;
    const slotOne = isCatalog === "catalog2" ? "two" : "one";

    console.log("This funtion is clicked ", date, bookingId, isChild);
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
        dateChanged();
      }
      dispatch(updateSchedule({ ...payload, activeTab, isChild }));
    } catch (error) {
      console.error("Failed to update", error);
    }

    setShowDatePicker(false);
    // setSelectedRowId(null);
  };

  const handleSaveMaid = async (id, name) => {
    console.log("Id is here >>>>>>", id, name);
    try {
      if (!id) {
        ShowToast("error", "Worker not selected");
        return;
      }
      const payload = {
        bookingId: BookingId,
        partnerId: id,
      };
      const response = await dispatch(saveMaidMatch(payload)).unwrap();
      if (response?.success) {
        ShowToast("success", "Worker assigned successfully!");
        maidSuccess()
      } else {
        ShowToast("error", "Failed to assign worker");
      }
    } catch (error) {
      console.error("Failed to assign worker:", error);
      ShowToast("error", "Failed to assign worker");
    }
  };

  const handleMaidNameChange = (bookingId, maidId, ) => {
    setMaidNameMap((prev) => ({
      ...prev,
      [bookingId]: maidId,
    }));
  };

  //Stylings
  const CardStyles = {
    borderRadius: "8px",
    backgroundColor: "white",
    p: 2,
    gap: 1,
  };

  const paperStyles = {
    backgroundColor: "#F9FAFB",
    borderRadius: "6px",
    p: 2,
  };

  const headingStyles = {
    color: "#1F2A37",
    fontWeight: "600",
    fontSize: "13px",
    lineHeight: "16px",
  };

  const spanLightStyles = {
    color: "#1F2A37",
    fontWeight: "600",
    fontSize: "13px",
    lineHeight: "16px",
  };

  const spanDarkStyles = {
    color: "#6B7280",
    fontWeight: "500",
    fontSize: "13px",
    lineHeight: "16px",
  };

  const stackStyles = {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  };

  const iconStyles = {
    color: "#6B7280",
  };

  return (
    <Stack sx={CardStyles}>
      {isCalenderOpen && (
        <Box
          sx={{
            position: "absolute",
            // top: 10,
            right: { md: 330, xs: 100 },
            zIndex: 1110,
            backgroundColor: "white",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            "& .react-datepicker": {
              fontSize: "0.765rem",
            },
            "& .react-datepicker__header": {
              fontSize: "0.765rem",
            },
            "& .react-datepicker__current-month": {
              fontSize: "0.765rem",
            },
            "& .react-datepicker__day": {
              fontSize: "0.765rem",
            },
            "& .react-datepicker__time-list-item": {
              fontSize: "0.765rem",
            },
          }}
        >
          <CustomDatePicker
            onDateChange={(date) => handleDateChange(date, BookingId, false)}
            onClose={() => {
              setShowDatePicker(false);
              setIsCalenderOpen(false);
              setSelectedRowId(null);
            }}
           // setIsDateSelected={setIsDateSelected}
          />
        </Box>
      )}
      <Typography sx={headingStyles}>Order Overview</Typography>
      <Paper elevation={0} sx={paperStyles}>
        <Stack
          direction={"row"}
          // justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack flex={1} sx={stackStyles}>
            <Package size={24} style={iconStyles} />
            <Stack>
              <Typography>
                <span style={spanLightStyles}>Order id :</span>
                {"  "}
                <span style={spanDarkStyles}>{bookingInfo?.orderId}</span>
              </Typography>
              <Stack direction={"row"} gap={1.6} alignItems={"align-center"}>
                <Typography sx={spanLightStyles}>Status</Typography>
                <Typography sx={spanLightStyles}>:</Typography>
                <FormControl
                  fullWorderIdth
                  size="small"
                  borderBottom="none"
                  sx={{ border: "none", mt: -0.5 }}
                >
                  <Select
                    value={isStatusUpdated || bookingInfo?.orderStatus || ""}
                    onChange={(e) =>
                      handleStatusChange(BookingId, e.target.value)
                    }
                    sx={{
                      fontWeight: 500,
                      border: "none",
                      fontSize: "13px",
                          color: "#6B7280",

                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none", // This removes the outline
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none", // Removes border on hover
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none", // Removes border when focused
                      },
                      "& .MuiSelect-select": {
                        padding: "4px 8px",
                      },
                    }}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem
                        key={option.key}
                        value={option.key}
                        disabled={false}
                        sx={{
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.75rem",
                            md: "0.75rem",
                          },
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Stack>

          <Stack
            flex={1}
            direction={"column"}
            gap={1}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Stack gap={1}>
              <Stack sx={stackStyles}>
                <Clock size={18} style={iconStyles} />
                <Typography style={spanLightStyles}>Boking Time :</Typography>
                <Typography sx={spanDarkStyles}>
                  {formatDateTime(bookingInfo?.bookingTime).split(",")[1]}
                </Typography>
              </Stack>
              <Stack sx={stackStyles}>
                <CalendarBlank size={16} style={iconStyles} />
                <Typography style={spanLightStyles}>Boking Date</Typography>
                <Typography sx={spanLightStyles}>:</Typography>
                <Typography sx={spanDarkStyles}>
                  {formatDateTime(bookingInfo?.bookingTime).split(",")[0]}
                </Typography>
                <Pencil
                  onClick={handleOpenCalender}
                  style={{ cursor: "pointer", ...iconStyles }}
                />
              </Stack>
            </Stack>
          </Stack>

          <Stack flex={1} alignItems={"flex-end"} >
            <Stack gap={1}>
              <Stack direction={"row"} >
              {/* <Stack direction={"row"}  justifyContent={'center'} gap={1} alignItems={'center'}>
                  <UserPlus style={iconStyles} />
                  <Typography style={spanLightStyles}>Worker Name</Typography>
                  <Typography sx={spanLightStyles} ml={2.5}>:</Typography>
                  <FormControl fullwidth size="small" borderBottom="none">
                    <Select
                      value={selectedName}
                      onChange={(e) => {
                        const selectedMaid = e.target.value;
                        setSelectedName(selectedMaid);
                        const maid = maidNames.find(
                          (maid) => maid.id === selectedMaid
                        );
                        //   console.log("Selected name:", selectedMaid.id);
                        handleSaveMaid(maid?.id, maid?.name);
                      }}
                      displayEmpty
                      sx={{
                        fontWeight: 500,
                        borderRadius: 1,
                        fontSize: "13px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none", // This removes the outline
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Removes border on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Removes border when focused
                        },
                        "& .MuiSelect-select": {
                          padding: "4px 8px",
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        {maidNames || 'Select a name'}
                      </MenuItem>
                      {allMadeNames?.map((maid) => (
                        <MenuItem
                          key={maid.id}
                          value={maid.id}
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.75rem",
                              textTransform: "capitalize",
                            },
                          }}
                        >
                          {maid.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack> */}

              <Stack
                direction="row"
                justifyContent="center"
                gap={1}
                alignItems="center"
                // bgcolor={"green"}
              >
                <UserPlus style={iconStyles} size={24} />
                <Typography style={{ textWrap: "nowrap", ...spanLightStyles }}>
                  Worker Name
                </Typography>
                <Typography sx={spanLightStyles} ml={2.5}>
                  :
                </Typography>
                <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={selectedName}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setSelectedName(selectedId);
                      const selectedMaid = allMadeNames.find(
                        (maid) => maid.id === selectedId
                      );
                      handleSaveMaid(selectedMaid?.id, selectedMaid?.name);
                    }}
                    displayEmpty
                    sx={{
                      fontWeight: 500,
                      borderRadius: 1,
                      fontSize: "13px",
                          color: "#6B7280",

                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiSelect-select": {
                        padding: "4px 8px",
                        textTransform: "capitalize",
                      },
                    }}
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <span style={{ color: "#999" }}>Select a name</span>
                        );
                      }
                      const selectedMaid = allMadeNames.find(
                        (maid) => maid.id === selected
                      );
                      return selectedMaid?.name || maidNames;
                    }}
                  >
                    {allMadeNames.length > 0 ? (
                      allMadeNames.map((maid) => (
                        <MenuItem
                          key={maid.id}
                          value={maid.id}
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.75rem",
                            },
                            textTransform: "capitalize",
                          }}
                        >
                          {maid.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No maids available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Stack>
              </Stack>
              <Stack direction={"row"} gap={1}>
                <Cube style={iconStyles} />
                <Typography style={spanLightStyles}>
                  Recuuring Type :
                </Typography>
                <Typography sx={spanDarkStyles} textTransform={'capitalize'}>
                  {bookingInfo?.bookingType ? bookingInfo?.bookingType.toLowerCase() : ""}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <OrderFlow bookingInfo={bookingInfo} isStatusUpdated={isStatusUpdated} />
    </Stack>
  );
};

export default OrderOverViewCards;
