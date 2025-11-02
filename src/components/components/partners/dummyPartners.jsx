import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  useTheme,
  Select,
  InputAdornment,
  FormHelperText,
  InputLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  LocationOn,
  Schedule,
  Cancel,
  ArrowBack,
} from "@mui/icons-material";
import { ShowToast } from "../ToastAndSnacks/ShowToast";
import { useDispatch, useSelector } from "react-redux";
import {
  createPartner,
  fetchHubsDataForPartners,
  fetchSlotTimings,
  partnerMobileNumberVerify,
} from "../../redux/slicers/partnerSlice";
import { formatTime } from "../../utils/helper";
import { inputStyles, labelStyles } from "../../styles/globalStyles";
import CustomLoader from "../Models/CustomLoader";

const AddServicePartner = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    partnerId: "102ca289-da1c-4204-9",
    name: "",
    phone: "",
    countryCode: "+91",
    address: "",
    shiftTimings: [],
  });
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    address: false,
    shiftTimings: false,
    hub: false,
  });
  const [isPhoneValid, setIsPhoneValid] = useState(null);
  const [phoneCheckError, setPhoneCheckError] = useState("");
  const [hubSelection, setHubSelection] = useState({});
  const [shiftSelection, setShiftSelection] = useState({});
  const [hubsDropdown, setHubsDropdown] = useState([]);

  // Get the hubs data from the Redux store
  const hubsData = useSelector((state) => state.partners?.partnersHubsData);
  const slotTimings = useSelector((state) => state.partners.timeSlots?.slots);
  const loading = useSelector((state) => state.partners.loading);

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

  useEffect(() => {
    const payload = {
      id: hubSelection?.id,
    };
    dispatch(fetchHubsDataForPartners());
    dispatch(fetchSlotTimings(payload));
  }, [dispatch, hubSelection]);

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleHubChange = (e) => {
    const selectedId = e.target.value;
    const selectedHub = hubsDropdown.find((hub) => hub.id === selectedId);

    if (selectedHub) {
      setHubSelection({
        id: selectedHub.id,
        address: selectedHub.address,
      });

      // Clear the hub error
      setErrors((prev) => ({
        ...prev,
        hub: false,
      }));
    }
  };

  // Handle shift timings change
  const handleShiftChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      shiftTimings: typeof value === "string" ? value.split(",") : value,
    }));
    if (errors.shiftTimings) {
      setErrors((prev) => ({
        ...prev,
        shiftTimings: false,
      }));
    }
  };

  //   console.log(hubSelection);
  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === "",
      phone: !validatePhone(formData.phone),
      address: formData.address.trim() === "",
      shiftTimings:
        !Array.isArray(formData.shiftTimings) ||
        formData.shiftTimings.length === 0,
      hub: !hubSelection?.id?.trim?.(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone input, only allow numbers and limit to 10 digits
    if (name === "phone") {
      // Only allow numbers and limit to 10 digits
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  // This effect will run whenever formData.phone changes
  useEffect(() => {
    const checkPhoneNumber = async () => {
      const payload = {
        mobileNumber: formData?.phone,
      };

      if (formData.phone.length === 10) {
        try {
          const response = await dispatch(
            partnerMobileNumberVerify(payload)
          ).unwrap();
          setIsPhoneValid(true);
          setPhoneCheckError(response?.message || "Mobile Number Verified");
          // ShowToast(
          //   "success",
          //   response?.message || "Mobile Number Verified Successfully!!!"
          // );
        } catch (err) {
          setIsPhoneValid(false);
          setPhoneCheckError(
            err.message || "This phone number is already registered"
          );
        } finally {
        }
      } else {
        setIsPhoneValid(null);
        setPhoneCheckError("");
      }
    };

    // mobile verify api call delay
    const timer = setTimeout(() => {
      if (formData.phone.length === 10) {
        checkPhoneNumber();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.phone, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isPhoneValid) {
      return;
    }
    setError("");

    const payload = {
      name: formData.name,
      mobileNumber: formData.phone,
      address: {
        addressLine1: formData.address,
      },
      type: "PARTNER",
      hubPartner: {
        hubId: hubSelection?.id,
        slotIds: formData?.shiftTimings,
      },
      isPrimary: true,
    };

    // console.log(payload);

    try {
      const response = await dispatch(createPartner(payload)).unwrap();
      // console.log(response);
      ShowToast(
        "success",
        response?.message || "Worker Created Successfully!!!"
      );
      navigate("/Workers");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
    }
  };

  const handleCancel = () => {
    navigate("/Workers");
  };

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/Workers");
    }
  };

  return (
    <Box
      sx={{
        margin: "auto",
        height: "100%",
        p: 1,
        [theme.breakpoints.down("sm")]: {
          p: 2,
        },
        bgcolor: "#F2F2F2",
      }}
    >
      {loading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <CustomLoader />
        </Box>
      )}
      <Button
        startIcon={<ArrowBack />}
        onClick={handleGoBack}
        sx={{
          font: "Inter",
          fontWeight: 600,
          fontSize: "20px",
          mb: 1,
          fontSize: "1.25rem",
          textTransform: "capitalize",
          color: "#111928",
        }}
      >
        Add New Worker
      </Button>

      <Box
        sx={{
          p: 2,
          borderRadius: "6px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#fff",
        }}
      >
        <Box
          component="form"
          sx={{
            bgcolor: "#F9FAFB",
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* First Row - Worker ID, Name, Phone */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                gap: 2,
              },
            }}
          >
            <Box sx={{ width: "100%", height: "40px" }}>
              <InputLabel sx={labelStyles}>Name*</InputLabel>
              <TextField
                name="name"
                size="small"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={errors.name}
                helperText={errors.name ? "Name is required" : ""}
                placeholder="Robert Downey Junior!"
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <InputLabel sx={labelStyles}>Phone number*</InputLabel>
              <Box sx={{ display: "flex", height: "37px" }}>
                <Select
                  size="small"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  sx={{
                    width: "90px",
                    borderRadius: "4px 0 0 4px",
                    bgcolor: "#D1D5DB",
                    "& .MuiSelect-select": {
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    },
                    "& .MuiOutlinedInput-root": {
                      height: "100%",
                      "& fieldset": {
                        borderColor: "#D1D5DB",
                        borderRight: "none",
                        borderRadius: "4px 0 0 4px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00b664",
                      },
                    },
                  }}
                >
                  <MenuItem value="+91">+91</MenuItem>
                  <MenuItem value="+1">+1</MenuItem>
                </Select>

                <TextField
                  size="small"
                  name="phone"
                  fullWidth
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone || isPhoneValid === false}
                  placeholder="1234567890"
                  sx={{
                    ...inputStyles,
                    "& .MuiOutlinedInput-root": {
                      ...inputStyles["& .MuiOutlinedInput-root"],
                      "& fieldset": {
                        ...inputStyles["& .MuiOutlinedInput-root"]?.[
                          "& fieldset"
                        ],
                        borderLeft: "none",
                        borderRadius: "0px",
                      },
                    },
                  }}
                />
              </Box>

              {isPhoneValid !== true && (phoneCheckError || errors.phone) && (
                <FormHelperText
                  error={isPhoneValid === false || errors.phone}
                  sx={{ ml: 2 }}
                >
                  {errors.phone
                    ? "Phone number must be 10 digits"
                    : phoneCheckError}
                </FormHelperText>
              )}
            </Box>
          </Box>

          {/* Address Field */}
          <Box sx={{ width: "100%", mb: 2 }}>
            <InputLabel sx={labelStyles}>Address</InputLabel>
            <TextField
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Write text here ..."
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              sx={{
                ...inputStyles,
                "& .MuiOutlinedInput-root": {
                  ...inputStyles["& .MuiOutlinedInput-root"],
                  borderRadius: 2,
                  fontSize: "0.875rem",
                  padding: "4px",
                  "& textarea::placeholder": {
                    color: "#9e9e9e",
                    fontStyle: "italic",
                    fontSize: "0.875rem",
                  },
                  "& fieldset": {
                    border: "1.5px solid #D1D5DB",
                  },
                  "&:hover fieldset": {
                    border: "1.5px solid #D1D5DB",
                  },
                  "&.Mui-focused fieldset": {
                    border: "1px solid #00b664",
                  },
                },
              }}
            />
          </Box>

          {/* Hub and Shift Timings */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                gap: 2,
              },
            }}
          >
            <Box sx={{ width: "100%" }}>
              <InputLabel sx={labelStyles}>Hub*</InputLabel>
              <Select
                name="hub"
                size="small"
                value={hubSelection.id || ""}
                onChange={handleHubChange}
                fullWidth
                required
                error={!!errors.hub}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) return "-- Select hub --";
                  const hub = hubsDropdown.find((h) => h.id === selected);
                  return hub ? hub.address : "-- Select hub --";
                }}
                sx={inputStyles}
              >
                <MenuItem value="" disabled>
                  -- Select hub --
                </MenuItem>
                {hubsDropdown.map((hub) => (
                  <MenuItem key={hub.id} value={hub.id}>
                    {hub.address}
                  </MenuItem>
                ))}
              </Select>
              {errors.hub && (
                <FormHelperText error>Please select a hub</FormHelperText>
              )}
            </Box>

            <Box sx={{ width: "100%", flexWrap: "wrap" }}>
              <InputLabel sx={labelStyles}>Shift Timings</InputLabel>
              <Select
                multiple
                name="shiftTimings"
                size="small"
                value={formData.shiftTimings || []}
                onChange={handleShiftChange}
                fullWidth
                required
                error={!!errors.shiftTimings}
                renderValue={(selected) => {
                  if (!selected || selected.length === 0)
                    return "-- Select shift timing --";
                  const selectedSlots =
                    slotTimings?.filter((slot) => selected.includes(slot.id)) ||
                    [];
                  const labels = selectedSlots.map(
                    (slot) =>
                      `${formatTime(slot.startTime)} - ${formatTime(
                        slot.endTime
                      )}`
                  );
                  if (labels.length <= 2) {
                    return labels.join(", ");
                  }
                  return `${labels.slice(0, 2).join(", ")} +${
                    labels.length - 2
                  } more`;
                }}
                sx={inputStyles}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  -- Select shift timing --
                </MenuItem>
                {slotTimings?.map((slot) => (
                  <MenuItem key={slot.id} value={slot.id}>
                    <Checkbox
                      checked={formData.shiftTimings?.includes(slot.id)}
                    />
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </MenuItem>
                ))}
              </Select>
              {errors.shiftTimings && (
                <FormHelperText error>
                  Please select at least one shift timing
                </FormHelperText>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          gap: 2,
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            px: 2,
            py: 0.5,
            font: "Inter",
            textTransform: "capitalize",
            minWidth: "150px",
            borderColor: "#1F2A37",
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.grey[600],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={handleSubmit}
          sx={{
            px: 2,
            py: 0.5,
            font: "Inter",
            textTransform: "capitalize",
            minWidth: "150px",
            backgroundColor: "#08AD61",
            "&:hover": {
              backgroundColor: "#009a54",
            },
            fontWeight: 500,
          }}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default AddServicePartner;
