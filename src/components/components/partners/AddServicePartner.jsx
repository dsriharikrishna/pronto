import React, { useEffect, useState, useCallback } from "react";
import { createTheme, FormControlLabel, ThemeProvider } from "@mui/material";
import { Collapse } from "@mui/material";
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
import {
  buttonStyles,
  cancelButtonStyles,
  inputStyles,
  labelStyles,
  menuStyles,
  saveButtonStyles,
  typeStyles,
  datePickerStyles,
} from "../../styles/globalStyles";
import CustomLoader from "../Models/CustomLoader";
import debounce from "lodash.debounce";

const theme = createTheme({
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkgreen',
            },
          },
        },
      },
    },
  },
});

const AddServicePartner = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    countryCode: "+91",
    gender: "",
    address: "",
    shiftTimings: [],
    bankAccountHolderName: "",
    bankAccountNumber: "",
    bankIFSC: "",
    shiftWageRate: 0,
    joiningDate: ""
  });
  
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    address: false,
    gender: false,
    shiftTimings: false,
    bankAccountHolderName: false,
    bankAccountNumber: false,
    bankIFSC: false,
    hub: false,
    shiftWageRate: false,
    joiningDate: false
  });
  const [isPhoneValid, setIsPhoneValid] = useState(null);
  const [phoneCheckError, setPhoneCheckError] = useState("");
  const [hubSelection, setHubSelection] = useState({});
  const [shiftSelection, setShiftSelection] = useState({});
  const [hubsDropdown, setHubsDropdown] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingHubs, setIsLoadingHubs] = useState(false);
  const [shiftDropdownOpen, setShiftDropdownOpen] = useState(false);
  const [showBankFields, setShowBankFields] = useState(false);
  // Get the hubs data from the Redux store
  const hubsData = useSelector((state) => state.partners?.partnersHubsData);
  const slotTimings = useSelector((state) => state.partners.timeSlots?.slots);
  // ?.slice()
  // .reverse();
  const loading = useSelector((state) => state.partners.loading);

  // Debounced phone verification
  // const debouncedPhoneVerify = useCallback(
  //   debounce(async (phone) => {
  //     if (phone.length === 10) {
  //       try {
  //         const payload = { mobileNumber: phone };
  //         const response = await dispatch(
  //           partnerMobileNumberVerify(payload)
  //         ).unwrap();
  //         setIsPhoneValid(true);
  //         setPhoneCheckError(response?.data?.message || "Mobile Number Verified");
  //       } catch (err) {
  //         setIsPhoneValid(false);
  //         setPhoneCheckError(
  //           err.message || "This phone number is already registered"
  //         );
  //       }
  //     } else {
  //       setIsPhoneValid(null);
  //       setPhoneCheckError("");
  //     }
  //   }, 500),
  //   [dispatch]
  // );

  // useEffect(() => {
  //   return () => {
  //     debouncedPhoneVerify.cancel();
  //   };
  // }, [debouncedPhoneVerify]);

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
    const fetchData = async () => {
      try {
        setIsLoadingHubs(true);
        await dispatch(fetchHubsDataForPartners());
      } catch (error) {
        ShowToast("error", "Failed to load hubs data");
      } finally {
        setIsLoadingHubs(false);
      }
    };
    fetchData();
  }, [dispatch]);

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
      setErrors((prev) => ({
        ...prev,
        hub: false,
      }));
    }
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
    if (errors.shiftTimings) {
      setErrors((prev) => ({
        ...prev,
        shiftTimings: false,
      }));
    }
  };

  const validateForm = () => {
    const bankFieldsFilled =
      formData.bankAccountHolderName.trim() ||
      formData.bankAccountNumber.trim() ||
      formData.bankIFSC.trim();

    const bankFieldsRequired = {
      bankAccountHolderName:
        bankFieldsFilled && !formData.bankAccountHolderName.trim(),
      bankAccountNumber: bankFieldsFilled && !formData.bankAccountNumber.trim(),
      bankIFSC: bankFieldsFilled && !formData.bankIFSC.trim(),
    };
    const newErrors = {
      name: formData.name.trim() === "",
      phone: !validatePhone(formData.phone),
      gender: formData.gender.trim() === "",
      // address: formData.address.trim() === "",
      // shiftTimings:Join
      //   !Array.isArray(formData.shiftTimings) ||
      //   formData.shiftTimings.length === 0,
      hub: !hubSelection?.id,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        // if (value.length === 10) {
        //   debouncedPhoneVerify(value);
        // } else {
        //   setIsPhoneValid(null);
        //   setPhoneCheckError("");
        // }
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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "phone") {
  //     // Allow empty string or only numbers, up to 10 digits
  //     if (value === "" || (/^\d+$/.test(value) && value.length <= 10)) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         [name]: value,
  //       }));
  //     }
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };

  // console.log(formData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // if (!isPhoneValid) {
    //   ShowToast("error", "Please enter a valid and unique phone number");
    //   return;
    // }
    setError("");

    const payload = {
      name: formData.name.trim(),
      mobileNumber: formData.phone.trim() || "1111111111",
      gender: formData?.gender.trim(),
      partnerInfo: {
        bankAccountHolderName: formData.bankAccountHolderName.trim(),
        bankAccountNumber: formData.bankAccountNumber.trim(),
        ifscCode: formData.bankIFSC.trim(),
        shiftWageRate: formData.shiftWageRate || 0,
        joiningDate: formData.joiningDate || ""
      },
      address: {
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: true,
        houseNo: "",
        name: "",
        bhk: 0,
        floor: 0,
        bathroom: 0,
        latitude: "",
        longitude: "",
      },
      type: "PARTNER",
      hubPartner: {
        hubId: hubSelection?.id,
        slotIds: "",
      },
      isPrimary: true,
    };


    try {
      const response = await dispatch(createPartner(payload)).unwrap();
      // console.log("response", response?.success);
      // if (response?.success === "false") {
      //   ShowToast("warning", response?.message || "");
      // }
      ShowToast(
        "success",
        response?.message || "Worker Created Successfully!!!"
      );
      navigate("/Workers");
    } catch (err) {
      console.log(err);
      setError(err || "An error occurred");
      ShowToast("error", err || "Failed to create worker");
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
        bgcolor: "#fff",
        overflow: {
          xs: "auto",
          sm: "auto",
          md: "hidden",
        },
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{
            ...buttonStyles,
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          Add New Worker
        </Button>
      </Box>

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
          {/* First Row - Name, Phone */}
          <Box
            sx={{
              display: "flex",
              // alignItems: "center",
              // justifyContent: "space-between",
              gap: { xs: 5, md: 3 },

              flexDirection: { xs: "column", md: "row" },
              width: "100%",
            }}
          >
            <Box sx={{ width: { xs: "100%" }, height: "40px" }}>
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
                inputProps={{ maxLength: 100 }}
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ width: { xs: "100%" } }}>
              <InputLabel sx={labelStyles}>Phone number</InputLabel>
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
                  {/* <MenuItem value="+1">+1</MenuItem> */}
                </Select>

                <TextField
                  size="small"
                  name="phone"
                  fullWidth
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone || isPhoneValid === false}
                  placeholder="1234567890"
                  inputProps={{ maxLength: 10 }}
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
          {/* <Box sx={{ width: "100%", mb: 2 }}>
            <InputLabel sx={labelStyles}>Address*</InputLabel>
            <TextField
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Write text here ..."
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              inputProps={{ maxLength: 500 }}
              error={errors.address}
              helperText={errors.address ? "Address is required" : ""}
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
          </Box> */}
          {/* Hub and gender */}
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
            {/* Gender Field */}
            <Box sx={{ width: "100%" }}>
              <InputLabel sx={labelStyles}>Select Gender*</InputLabel>
              <Select
                name="gender" // Changed to lowercase to match state
                size="small"
                value={formData.gender || ""}
                onChange={handleChange} // Changed to use handleChange
                fullWidth
                required
                error={errors.gender}
                displayEmpty
                sx={inputStyles}
              >
                <MenuItem value="" disabled sx={{ ...menuStyles }}>
                  -- Select Gender --
                </MenuItem>
                <MenuItem value="MALE" sx={{ ...menuStyles }}>
                  Male
                </MenuItem>
                <MenuItem value="FEMALE" sx={{ ...menuStyles }}>
                  Female
                </MenuItem>
                <MenuItem value="other" sx={{ ...menuStyles }}>
                  Other
                </MenuItem>
              </Select>
              {errors.gender && (
                <FormHelperText error>Please select a gender</FormHelperText>
              )}
            </Box>

            <Box sx={{ width: "100%" }}>
              <InputLabel sx={labelStyles}>Select Hub* </InputLabel>
              <Select
                name="hub"
                size="small"
                value={hubSelection.id || ""}
                onChange={handleHubChange}
                fullWidth
                required
                error={!!errors.hub}
                displayEmpty
                disabled={isLoadingHubs}
                renderValue={(selected) => {
                  if (!selected)
                    return (
                      <Typography sx={{ ...typeStyles }}>
                        -- Select hub --
                      </Typography>
                    );
                  const hub = hubsDropdown.find((h) => h.id === selected);
                  return (
                    <Typography sx={{ ...typeStyles }}>
                      {hub ? hub.address : "-- Select hub --"}
                    </Typography>
                  );
                }}
                sx={inputStyles}
              >
                <MenuItem value="" disabled sx={{ ...menuStyles }}>
                  -- Select hub --
                </MenuItem>
                {isLoadingHubs ? (
                  <MenuItem disabled sx={{ ...menuStyles }}>
                    Loading hubs...
                  </MenuItem>
                ) : (
                  hubsDropdown.map((hub) => (
                    <MenuItem
                      key={hub.id}
                      value={hub.id}
                      sx={{ ...menuStyles }}
                    >
                      {hub.address}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.hub && (
                <FormHelperText error>Please select a hub</FormHelperText>
              )}
            </Box>
          </Box>
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
              <InputLabel sx={labelStyles}>Shift wage rate</InputLabel>
              <TextField
                name="shiftWageRate"
                type="number"
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: 10000,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  },
                  sx: {
                    // Remove arrows in Chrome, Safari, Edge
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    // Remove arrows in Firefox
                    '& input[type=number]': {
                      MozAppearance: 'textfield',
                    },
                  },
                }}
                size="small"
                value={formData.shiftWageRate}
                onChange={handleChange}
                fullWidth
                error={errors.shiftWageRate}
                placeholder="Enter shift wage rate between 0 - 1000"
                inputProps={{ maxLength: 100 }}
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
               <InputLabel sx={labelStyles}> Joining Date</InputLabel>
              <TextField
                size="small"
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    padding: 0,
                    ".MuiInputBase-input": {
                      padding: "8px",
                    },
                  },
                }}
                sx={{ p: 0, m: 0 }}
              />
            </Box>
          </Box>
          {/*Bank details*/}
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showBankFields}
                  onChange={(e) => setShowBankFields(e.target.checked)}
                  name="showBankFields"
                />
              }
              label="Add Bank Details"
            />

            <Collapse
              in={showBankFields}
              timeout={500}
              unmountOnExit
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                  width: "100%",
                  mt: 2,
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <InputLabel sx={labelStyles}>Bank Account Holder Name</InputLabel>
                  <TextField
                    name="bankAccountHolderName"
                    size="small"
                    value={formData.bankAccountHolderName}
                    onChange={handleChange}
                    fullWidth
                    error={errors.bankAccountHolderName}
                    helperText={errors.bankAccountHolderName ? "Required" : ""}
                    placeholder="Account Holder Name"
                    sx={{ ...inputStyles, marginTop: '5px' }}
                  />
                </Box>

                <Box sx={{ width: "100%" }}>
                  <InputLabel sx={labelStyles}>Bank Account Number</InputLabel>
                  <TextField
                    name="bankAccountNumber"
                    size="small"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    fullWidth
                    error={errors.bankAccountNumber}
                    helperText={errors.bankAccountNumber ? "Required" : ""}
                    placeholder="1234567890"
                    sx={{ ...inputStyles, marginTop: '5px' }}
                  />
                </Box>

                <Box sx={{ width: "100%" }}>
                  <InputLabel sx={labelStyles}>IFSC Code</InputLabel>
                  <TextField
                    name="bankIFSC"
                    size="small"
                    value={formData.bankIFSC}
                    onChange={handleChange}
                    fullWidth
                    error={errors.bankIFSC}
                    helperText={errors.bankIFSC ? "Required" : ""}
                    placeholder="ABCD0123456"
                    sx={{ ...inputStyles, marginTop: '5px' }}
                  />
                </Box>
              </Box>
            </Collapse>

          </div>
        </Box>
        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            height: "100%",
            gap: 2,
            mt: 4,
            mb: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              ...cancelButtonStyles,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              ...saveButtonStyles,
            }}
          >
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddServicePartner;