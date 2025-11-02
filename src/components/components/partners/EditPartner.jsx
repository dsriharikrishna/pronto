import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Checkbox,
  Paper,
  Grid,
  CircularProgress,
  Backdrop,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close, ArrowBack } from "@mui/icons-material";
import {
  cancelButtonStyles,
  labelStyles,
  saveButtonStyles,
} from "../../styles/globalStyles";
import {
  editPartner,
  fetchSlotTimings,
} from "../../redux/slicers/partnerSlice";
import { useDispatch, useSelector } from "react-redux";
import { ShowToast } from "../ToastAndSnacks/ShowToast";
import { formatTime } from "../../utils/helper";
import { useLocation, useNavigate } from "react-router-dom";

const EditPartner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get data from navigation state
  const { partnerData, hubsData } = location.state || {};

  // Redux selectors
  const slotTimings = useSelector((state) => state.partners.timeSlots?.slots);
  const isLoadingHubs = useSelector((state) => state.partners.loading);
  const loading = useSelector((state) => state.partners.loading);

  // Local state
  const [formData, setFormData] = useState({
    partnerId: "",
    name: "",
    mobileNumber: "",
    status: "",
    shiftTimings: [],
  });
  const [hubSelection, setHubSelection] = useState({});
  const [hubsDropdown, setHubsDropdown] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [shiftDropdownOpen, setShiftDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    mobileNumber: "",
    status: "",
    shiftTimings: "",
    hub: "",
  });

  // Status options
  const statusTypeOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Unavailable", label: "Unavailable" },
  ];

  // Initialize form data when partnerData is available
  useEffect(() => {
    if (partnerData) {
      setFormData({
        partnerId: partnerData.id || "",
        name: partnerData.name || "",
        mobileNumber: partnerData.mobile_number || "",
        status: partnerData.status || "",
        shiftTimings: partnerData.shift_timings || [],
      });

      // Initialize hub selection if available in partnerData
      if (partnerData.hub_id && hubsData) {
        const initialHub = hubsData.find(
          (hub) => hub.id === partnerData.hub_id
        );
        if (initialHub) {
          setHubSelection(initialHub);
        }
      }
    }
  }, [partnerData, hubsData]);

  // Set hubs dropdown
  useEffect(() => {
    if (hubsData && Array.isArray(hubsData)) {
      const filteredHubs = hubsData
        .filter((item) => item.address)
        .map((item) => ({
          id: item.id,
          address: item.address,
        }));
      setHubsDropdown(filteredHubs);
    }
  }, [hubsData]);

  // Fetch slot timings when hub changes
  useEffect(() => {
    const fetchSlotTimingsData = async () => {
      if (hubSelection?.id) {
        try {
          setIsLoadingSlots(true);
          const payload = { id: hubSelection.id };
          await dispatch(fetchSlotTimings(payload));
        } catch (error) {
          ShowToast("error", "Failed to load slot timings");
        } finally {
          setIsLoadingSlots(false);
        }
      } else {
        setFormData((prev) => ({ ...prev, shiftTimings: [] }));
      }
    };
    fetchSlotTimingsData();
  }, [dispatch, hubSelection]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate(-1);
  };

  // Validation
  const validate = () => {
    let valid = true;
    let newErrors = {
      name: "",
      mobileNumber: "",
      status: "",
      shiftTimings: "",
      hub: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      valid = false;
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
      valid = false;
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
      valid = false;
    }

    if (!hubSelection.id) {
      newErrors.hub = "Hub is required";
      valid = false;
    }

    if (!formData.shiftTimings || formData.shiftTimings.length === 0) {
      newErrors.shiftTimings = "At least one shift timing is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleHubChange = (e) => {
    const selectedId = e.target.value;
    const selectedHub = hubsDropdown.find((h) => h.id === selectedId) || {};
    setHubSelection(selectedHub);
    setErrors((prev) => ({ ...prev, hub: "" }));
    setFormData((prev) => ({ ...prev, shiftTimings: [] }));
  };

  const handleShiftTimingsChange = (e) => {
    const value = e.target.value;
    if (value[value.length - 1] === "select-all") {
      setFormData((prev) => ({
        ...prev,
        shiftTimings:
          formData.shiftTimings.length === slotTimings.length
            ? []
            : slotTimings.map((slot) => slot.id),
      }));
      setShiftDropdownOpen(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        shiftTimings: value,
      }));
    }
    setErrors((prev) => ({ ...prev, shiftTimings: "" }));
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      userId: formData.partnerId,
      name: formData.name,
      email: partnerData?.email || "",
      mobileNumber: formData.mobileNumber,
      status: formData.status,
      hubId: hubSelection.id,
      shiftTimings: formData.shiftTimings,
      isPrimary: true,
    };

    try {
      const response = await dispatch(editPartner(payload));
      if (response?.payload?.message === "User updated successfully") {
        ShowToast("success", "Worker Updated Successfully!!!");
        navigate(-1);
      } else {
        ShowToast(
          "error",
          response?.payload?.message || "Failed to update worker"
        );
      }
    } catch (error) {
      ShowToast("error", "Failed to update worker");
    }
  };

  if (!partnerData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">No worker data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.default",
        zIndex: 1300,
        overflow: "auto",
        p: isMobile ? 1 : 3,
      }}
    >
      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper
        sx={{
          maxWidth: 1400,
          margin: "0 auto",
          p: isMobile ? 2 : 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={handleGoBack} size="large">
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Update Worker
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="large">
            <Close />
          </IconButton>
        </Box>

        {/* Main Content - Left and Right Sections */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Left Section */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* Worker ID */}
              <Box sx={{ flex: '1 1 calc(33.33% - 16px)', minWidth: '250px' }}>
                <FormControl fullWidth>
                  <InputLabel
                    shrink
                    htmlFor="partner-id"
                    sx={{ ...labelStyles }}
                  >
                    Worker ID
                  </InputLabel>
                  <TextField
                    id="partner-id"
                    value={partnerData.id}
                    fullWidth
                    disabled
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </FormControl>
              </Box>

              {/* Name */}
              <Box sx={{ flex: '1 1 calc(33.33% - 16px)', minWidth: '250px' }}>
                <FormControl fullWidth error={!!errors.name}>
                  <InputLabel shrink htmlFor="name" sx={{ ...labelStyles }}>
                    Name *
                  </InputLabel>
                  <TextField
                    size="small"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mt: 1 }}
                  />
                </FormControl>
              </Box>

              {/* Mobile Number */}
              <Box sx={{ flex: '1 1 calc(33.33% - 16px)', minWidth: '250px' }}>
                <FormControl fullWidth error={!!errors.mobileNumber}>
                  <InputLabel
                    shrink
                    htmlFor="mobileNumber"
                    sx={{ ...labelStyles }}
                  >
                    Mobile Number *
                  </InputLabel>
                  <TextField
                    size="small"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber}
                    inputProps={{ maxLength: 10 }}
                    sx={{ mt: 1 }}
                  />
                </FormControl>
              </Box>
            </Box>
          </Box>

          {/* Right Section */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* Status */}
              <Box sx={{ flex: '1 1 calc(33.33% - 16px)', minWidth: '250px' }}>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel shrink htmlFor="status" sx={{ ...labelStyles }}>
                    Status *
                  </InputLabel>
                  <Select
                    id="status"
                    size="small"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    error={!!errors.status}
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="" disabled>
                      Select Status
                    </MenuItem>
                    {statusTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && (
                    <FormHelperText error>{errors.status}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Hub */}
              <Box sx={{ flex: '1 1 calc(33.33% - 16px)', minWidth: '250px' }}>
                <FormControl fullWidth error={!!errors.hub}>
                  <InputLabel shrink htmlFor="hub" sx={{ ...labelStyles }}>
                    Hub *
                  </InputLabel>
                  <Select
                    name="hub"
                    size="small"
                    value={hubSelection.id || ""}
                    onChange={handleHubChange}
                    fullWidth
                    error={!!errors.hub}
                    disabled={isLoadingHubs}
                    sx={{ mt: 1 }}
                    renderValue={(selected) => {
                      if (!selected) return <em>-- Select hub --</em>;
                      const hub = hubsDropdown.find((h) => h.id === selected);
                      return hub
                        ? `${hub.address}`
                        : "-- Select hub --";
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Select hub --
                    </MenuItem>
                    {isLoadingHubs ? (
                      <MenuItem disabled>Loading hubs...</MenuItem>
                    ) : (
                      hubsDropdown.map((hub) => (
                        <MenuItem key={hub.id} value={hub.id}>
                          {hub.address}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.hub && (
                    <FormHelperText error>{errors.hub}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Shift Timings */}
              <Box sx={{ flex: '1 1 calc(33.33% - 16px)', minWidth: '250px' }}>
                <FormControl fullWidth error={!!errors.shiftTimings}>
                  <InputLabel
                    shrink
                    htmlFor="shiftTimings"
                    sx={{ ...labelStyles, width: "100%" }}
                  >
                    Shift Timings *
                  </InputLabel>
                  <Select
                    name="shiftTimings"
                    size="small"
                    multiple
                    value={formData.shiftTimings || []}
                    onChange={handleShiftTimingsChange}
                    open={shiftDropdownOpen}
                    onOpen={() => setShiftDropdownOpen(true)}
                    onClose={() => setShiftDropdownOpen(false)}
                    fullWidth
                    error={!!errors.shiftTimings}
                    disabled={!hubSelection.id || isLoadingSlots}
                    renderValue={(selected) => {
                      if (!selected || selected.length === 0) {
                        return <em>-- Select shift timing --</em>;
                      }
                      const selectedSlots =
                        slotTimings?.filter((slot) =>
                          selected.includes(slot.id)
                        ) || [];
                      const labels = selectedSlots.map(
                        (slot) =>
                          `${formatTime(slot.startTime)} - ${formatTime(
                            slot.endTime
                          )}`
                      );
                      return labels.join(", ");
                    }}
                    sx={{ mt: 1 }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Select shift timing --
                    </MenuItem>
                    {slotTimings?.length > 0 && (
                      <MenuItem value="select-all">
                        <Checkbox
                          checked={
                            slotTimings.length > 0 &&
                            formData.shiftTimings.length === slotTimings.length
                          }
                          indeterminate={
                            formData.shiftTimings.length > 0 &&
                            formData.shiftTimings.length < slotTimings.length
                          }
                        />
                        Select All
                      </MenuItem>
                    )}
                    {isLoadingSlots ? (
                      <MenuItem disabled>Loading time slots...</MenuItem>
                    ) : slotTimings?.length > 0 ? (
                      slotTimings.map((slot) => (
                        <MenuItem key={slot.id} value={slot.id}>
                          <Checkbox
                            checked={formData.shiftTimings?.includes(slot.id)}
                          />
                          {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        {hubSelection.id
                          ? "No time slots available"
                          : "Select a hub first"}
                      </MenuItem>
                    )}
                  </Select>
                  {errors.shiftTimings && (
                    <FormHelperText error>{errors.shiftTimings}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            variant="outlined"
            sx={cancelButtonStyles}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={saveButtonStyles}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditPartner;
