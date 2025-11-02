import React, { useState, useEffect } from "react";
import {
  Dialog,
  Slide,
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
} from "@mui/material";
import { Close, Schedule } from "@mui/icons-material";
import {
  cancelButtonStyles,
  EditTypeStyles,
  labelStyles,
  saveButtonStyles,
  inputStyles,
  typeStyles,
  menuStyles,
} from "../../styles/globalStyles";
import {
  editPartner,
  fetchSlotTimings,
} from "../../redux/slicers/partnerSlice";
import { useDispatch, useSelector } from "react-redux";
import { ShowToast } from "../ToastAndSnacks/ShowToast";
import { formatTime } from "../../utils/helper";
import { formatToDateInput } from "../../utils/constant";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} timeout={200} {...props} />;
});

const PartnerEditDialog = ({ open, onClose, partnerData, hubsData }) => {
  const dispatch = useDispatch();

  // Redux selectors
  const slotTimings = useSelector((state) => state.partners.timeSlots?.slots);
  const isLoadingHubs = useSelector((state) => state.partners.loading);

  // Local state
const [formData, setFormData] = useState({
  partnerId: partnerData?.id || "",
  name: partnerData?.name || "",
  mobileNumber: partnerData?.mobile_number || "",
  gender: partnerData?.gender || "",
  hubId: partnerData?.hub_id || "",
  status: partnerData?.status || "",
  bankAccountHolderName : partnerData?.bankAccountHolderName || "",
  bankAccountNumber: partnerData?.bankAccountNumber || "",
  ifscCode: partnerData?.ifscCode || "",
  joiningDate: partnerData?.joining_rate || "",  
  shiftWageRate: partnerData?.shiftWageRate || 0,
});
  const [hubSelection, setHubSelection] = useState({});
  const [hubsDropdown, setHubsDropdown] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [shiftDropdownOpen, setShiftDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    gender: "",
    mobileNumber: "",
    status: "",
    hub: false,
  });

  // Status options
  const statusTypeOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "unavailable", label: "Unavailable" },
  ];

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
          //await dispatch(fetchSlotTimings(payload));
        } catch (error) {
          ShowToast("error", "Failed to load slot timings");
        } finally {
          setIsLoadingSlots(false);
        }
      } else {
        setFormData((prev) => ({ ...prev }));
      }
    };
    fetchSlotTimingsData();
    // eslint-disable-next-line
  }, [dispatch, hubSelection]);

  // Reset form when partnerData changes
useEffect(() => {
  console.log(partnerData)
  setFormData({
    partnerId: partnerData?.id || "",
    name: partnerData?.name || "",
    gender: partnerData?.gender || "",
    mobileNumber: partnerData?.mobile_number || "",
    status: partnerData?.status || "",
    bankAccountHolderName : partnerData?.bankAccountHolderName || "",
    bankAccountNumber: partnerData?.bankAccountNumber || "",
    ifscCode: partnerData?.ifscCode || "",
    joiningDate: formatToDateInput(partnerData?.joining_date) || "", 
    shiftWageRate: partnerData?.shiftWageRate || 0,  
  });
  setHubSelection(hubsDropdown.find((h) => h.id === partnerData?.hub_id) || {});  // Pre-select hub
  setErrors({
    name: "",
    gender: "",
    mobileNumber: "",
    status: "",
    hub: false,
  });
}, [partnerData, open]);


  //   useEffect(() => {
  //   setFormData({
  //     partnerId: partnerData?.id || "",
  //     name: partnerData?.name || "",
  //     mobileNumber: partnerData?.mobileNumber || "",
  //     status: partnerData?.status || "",
  //     shiftTimings: [],
  //   });
  //   // Set initial hub selection based on partnerData.hubId
  //   if (partnerData?.hubId && hubsDropdown.length > 0) {
  //     const foundHub = hubsDropdown.find((h) => h.id === partnerData.hubId);
  //     setHubSelection(foundHub || {});
  //   } else {
  //     setHubSelection({});
  //   }
  //   setErrors({
  //     name: "",
  //     mobileNumber: "",
  //     status: "",
  //     shiftTimings: false,
  //     hub: false,
  //   });
  // }, [partnerData, open, hubsDropdown]);

  // Validation
  const validate = () => {
    let valid = true;
    let newErrors = {
      name: "",
      gender: "",
      mobileNumber: "",
      status: "",
      hub: false,
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
      valid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender";
      valid = false;
    }

    if (!formData.status) {
      newErrors.status = "Please select a status";
      valid = false;
    }
    if (!hubSelection.id) {
      newErrors.hub = true;
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
    setHubSelection(hubsDropdown.find((h) => h.id === selectedId) || {});
    setErrors((prev) => ({ ...prev, hub: false }));
    setFormData((prev) => ({ ...prev }));
  };

  const handleSave = async () => {
    if (!validate()) return;

   const payload = {
  userId: formData.partnerId || "",
  name: formData.name?.trim() || "",
  email: partnerData.email || "", // Assuming email is not editable
  gender: formData.gender || "",
  mobileNumber: formData.mobileNumber?.trim() || "",
  status: formData.status || "",
  hubPartner: {
    hubId: hubSelection.id || formData.hubId || "", // fallback to formData hubId if selection fails
    slotIds: formData.shiftTimings || [],
    isPrimary: true,
  },

  partnerInfo: {
    bankAccountHolderName : formData.bankAccountHolderName ?.trim() || "",
    bankAccountNumber: formData.bankAccountNumber?.toString().trim() || "",
    ifscCode: formData.ifscCode?.trim() || "",
    joiningDate: formData.joiningDate || "",   
    shiftWageRate: formData.shiftWageRate || 0,
  },
};


    try {
      const response = await dispatch(editPartner(payload));
      if (response?.payload?.message === "User updated successfully") {
        ShowToast("success", "Worker Updated Successfully!!!");
        onClose();
      } else {
        console.log("else error:-> ",response);
        ShowToast(
          "error",
          response?.payload || "Failed to update worker"
        );
      }
    } catch (error) {
      ShowToast("error",error.message);
    }
  };

  if (!partnerData) return null;

  // console.log(formData);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          maxWidth: "480px",
          marginLeft: "auto",
          width: "100%",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            borderBottom: "2px solid #e0e0e0",
            paddingBottom: "8px",
          }}
        >
          <Typography sx={{ ...EditTypeStyles }}>Edit Worker</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
          }}
        >
          {/* Worker ID */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InputLabel shrink htmlFor="partner-id" sx={{ ...labelStyles }}>
              Worker ID
            </InputLabel>
            <TextField
              id="partner-id"
              value={partnerData.id}
              fullWidth
              disabled
              variant="outlined"
              size="small"
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

          {/* Name */}
          <Box sx={{ display: "flex", flexDirection: "column", mb: 0 }}>
            <InputLabel shrink htmlFor="name" sx={{ ...labelStyles }}>
              Name
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

          {/* Mobile Number */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InputLabel shrink htmlFor="mobileNumber" sx={{ ...labelStyles }}>
              Mobile Number
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
              InputProps={{
                maxLength: 10,
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

          {/* gender */}

          {/* Gender Dropdown - Fixed Version */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InputLabel shrink htmlFor="gender" sx={{ ...labelStyles }}>
              Gender
            </InputLabel>
            <FormControl
              sx={{
                minWidth: { xs: "100%", sm: 120, md: 180 },
                height: "32px",
              }}
              size="small"
              fullWidth
              error={!!errors.gender}
            >
              <Select
                id="gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                displayEmpty
                sx={{
                  height: "32px",
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.75rem",
                    md: "0.75rem",
                  },
                }}
                renderValue={(selected) => {
                  return selected ? (
                    <Typography sx={{ ...typeStyles }}>
                      {selected.charAt(0).toUpperCase() + selected.slice(1)}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{ ...typeStyles, fontSize: "14px", color: "#999" }}
                    >
                      -- Select Gender --
                    </Typography>
                  );
                }}
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
            </FormControl>
          </Box>

          {/* Status */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InputLabel shrink htmlFor="status" sx={{ ...labelStyles }}>
              Status
            </InputLabel>
            <FormControl
              sx={{
                minWidth: { xs: "100%", sm: 120, md: 180 },
                height: "32px",
              }}
              size="small"
              fullWidth
              error={!!errors.status}
            >
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                sx={{
                  height: "32px",
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.75rem",
                    md: "0.75rem",
                  },
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Select Status</em>;
                  }
                  const selectedOption = statusTypeOptions.find(
                    (option) => option.value === selected
                  );
                  return (
                    <p style={{ textTransform: "capitalize" }}>
                      {" "}
                      {selectedOption ? selectedOption.label : selected}
                    </p>
                  );
                }}
              >
                {statusTypeOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
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
              {errors.status && (
                <FormHelperText error>{errors.status}</FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Hub */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InputLabel shrink htmlFor="hub" sx={{ ...labelStyles }}>
              hub
            </InputLabel>
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
              InputProps={{
                sx: {
                  padding: 0,
                  ".MuiInputBase-input": {
                    padding: "8px",
                  },
                },
              }}
              renderValue={(selected) => {
                if (!selected)
                  return (
                    <Typography
                      sx={{ ...typeStyles, fontSize: "14px", color: "#999" }}
                    >
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
              sx={{
                minWidth: { xs: "100%", sm: 120, md: 180 },
                height: "32px",
              }}
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
                  <MenuItem key={hub.id} value={hub.id} sx={{ ...menuStyles }}>
                    {hub.address}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.hub && (
              <FormHelperText error>Please select a hub</FormHelperText>
            )}
          </Box>

          {/* Joining Date */}
<Box sx={{ display: "flex", flexDirection: "column" }}>
  <InputLabel shrink htmlFor="joiningDate" sx={{ ...labelStyles }}>
    Joining Date
  </InputLabel>
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

{/* Shift Wage */}
<Box sx={{ display: "flex", flexDirection: "column" }}>
  <InputLabel shrink htmlFor="shiftWageRate" sx={{ ...labelStyles }}>
    Shift Wage
  </InputLabel>
  <TextField
    size="small"
    type="number"
    id="shiftWageRate"
    name="shiftWageRate"
    value={formData.shiftWageRate}
    onChange={handleChange}
    fullWidth
    variant="outlined"
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


          {/* Bank Account Holder Name */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InputLabel shrink htmlFor="bankAccountHolderName" sx={{ ...labelStyles }}>
              Bank Account Holder Name
            </InputLabel>
            <TextField
              size="small"
              id="bankAccountHolderName"
              name="bankAccountHolderName"
              value={formData.bankAccountHolderName}
              onChange={handleChange}
              fullWidth
              variant="outlined"
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

          {/* Bank Account Number */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InputLabel
              shrink
              htmlFor="bankAccountNumber"
              sx={{ ...labelStyles }}
            >
              Bank Account Number
            </InputLabel>
            <TextField
              size="small"
              id="bankAccountNumber"
              name="bankAccountNumber"
              type="number"
              value={formData.bankAccountNumber}
              onChange={handleChange}
              fullWidth
              variant="outlined"
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

          {/* IFSC Code */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InputLabel shrink htmlFor="ifscCode" sx={{ ...labelStyles }}>
              IFSC Code
            </InputLabel>
            <TextField
              size="small"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              fullWidth
              variant="outlined"
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

        {/* Action Buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <Button
            variant="outlined"
            sx={{
              ...cancelButtonStyles,
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            sx={{
              ...saveButtonStyles,
              color: "#fff",
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PartnerEditDialog;
