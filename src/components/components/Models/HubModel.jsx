import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Drawer,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { createNewHub } from "../../redux/slicers/dashboardSlice";
const HubModel = ({ isOpen, isEdit, onClose, data }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  // Initialize form with data when in edit mode
  useEffect(() => {
    if (isEdit && data) {
      setFormData({
        name: data.name || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
      });
    } else {
      // Reset form when adding new hub
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
      });
    }
  }, [isEdit, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
    };

    try {
      const response = await dispatch(createNewHub(payload)).unwrap();
      console.log(response);
      alert("Hub created successfully!");
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "500px" },
          px: 3,
        },
      }}
    >
    <Stack sx={{height:'100%'}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEdit ? "Edit Hub" : "Add New Hub"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Stack spacing={2} sx={{ flex: 1 }}>
          <TextField
            fullWidth
            required
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="filled"
            sx={{
              "& .MuiFilledInput-root": {
                color: "black", // User-entered text color
                backgroundColor: "#fff", // Optional: ensure background is visible
              },
              "& .MuiInputLabel-root": {
                color: "#00b664", // Label color
              },
              "& .Mui-focused.MuiInputLabel-root": {
                color: "black", // Label color on focus
              },
              "& .MuiFilledInput-underline:after": {
                borderBottomColor: "#00b664", // Bottom border color on focus
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            variant="filled"
            multiline
            // rows={3}
            sx={{
              "& .MuiFilledInput-root": {
                color: "black", // User-entered text color
                backgroundColor: "#fff", // Optional: ensure background is visible
              },
              "& .MuiInputLabel-root": {
                color: "#00b664", // Label color
              },
              "& .Mui-focused.MuiInputLabel-root": {
                color: "black", // Label color on focus
              },
              "& .MuiFilledInput-underline:after": {
                borderBottomColor: "#00b664", // Bottom border color on focus
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            variant="filled"
            sx={{
              "& .MuiFilledInput-root": {
                color: "black", // User-entered text color
                backgroundColor: "#fff", // Optional: ensure background is visible
              },
              "& .MuiInputLabel-root": {
                color: "#00b664", // Label color
              },
              "& .Mui-focused.MuiInputLabel-root": {
                color: "black", // Label color on focus
              },
              "& .MuiFilledInput-underline:after": {
                borderBottomColor: "#00b664", // Bottom border color on focus
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            variant="filled"
            sx={{
              "& .MuiFilledInput-root": {
                color: "black", // User-entered text color
                backgroundColor: "#fff", // Optional: ensure background is visible
              },
              "& .MuiInputLabel-root": {
                color: "#00b664", // Label color
              },
              "& .Mui-focused.MuiInputLabel-root": {
                color: "black", // Label color on focus
              },
              "& .MuiFilledInput-underline:after": {
                borderBottomColor: "#00b664", // Bottom border color on focus
              },
            }}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Stack>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
            sx={{ minWidth: 100, textTransform:'capitalize', borderColor:'1px solid #00b664', color:'#00b664' }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 100, backgroundColor:'#00b664', textTransform:'capitalize' }}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
      </Stack>
    </Drawer>
  );
};

export default HubModel;
