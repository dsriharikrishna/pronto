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
import { createCustomer } from "../../redux/slicers/dashboardSlice";
import { ShowToast } from "../../components/ToastAndSnacks/ShowToast";
import { ToastContainer, toast } from "react-toastify";
const CustomerModel = ({ isOpen, isEdit, onClose, data }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (isEdit && data) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        mobileNumber: data.mobileNumber || ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        mobileNumber: ""
      });
    }
  }, [isEdit, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    setLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      type: "USER"
    };

    try {
      // console.log("Creating user with payload:", payload);
      await dispatch(createCustomer(payload)).unwrap();
      onClose();
      ShowToast('success', 'Customer Created successfully');
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = async () => {
    setLoading(true);
    setError("");

    const payload = {
      userId: data.userId,
      name: formData.name,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      type: "USER"
    };

    try {
      // console.log("Updating user with payload:", payload);
      await dispatch(createCustomer(payload)).unwrap();
      // alert("Customer updated successfully!");
      onClose();
      ShowToast('success','Customer Created Successfully!!');
    } catch (err) {
      setError(err.message || "An error occurred");
      showToast('error', 'Already Exist')
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      handleEditCustomer();
    } else {
      handleCreateUser();
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
      <Stack sx={{ height: '100%' }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isEdit ? "Edit Customer" : "Add New Customer"}
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
                  color: "black",
                  backgroundColor: "#fff",
                },
                "& .MuiInputLabel-root": {
                  color: "#00b664",
                },
                "& .Mui-focused.MuiInputLabel-root": {
                  color: "black",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "#00b664",
                },
              }}
            />

            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="filled"
              sx={{
                "& .MuiFilledInput-root": {
                  color: "black",
                  backgroundColor: "#fff",
                },
                "& .MuiInputLabel-root": {
                  color: "#00b664",
                },
                "& .Mui-focused.MuiInputLabel-root": {
                  color: "black",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "#00b664",
                },
              }}
            />

            <TextField
              fullWidth
              required
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              variant="filled"
              sx={{
                "& .MuiFilledInput-root": {
                  color: "black",
                  backgroundColor: "#fff",
                },
                "& .MuiInputLabel-root": {
                  color: "#00b664",
                },
                "& .Mui-focused.MuiInputLabel-root": {
                  color: "black",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "#00b664",
                },
              }}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, py: 2 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              disabled={loading}
              sx={{
                minWidth: 100,
                textTransform: 'capitalize',
                borderColor: '#00b664',
                color: '#00b664'
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{
                minWidth: 100,
                backgroundColor: '#00b664',
                textTransform: 'capitalize'
              }}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Stack>
    </Drawer>
  );
};

export default CustomerModel;
