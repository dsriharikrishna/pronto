import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  IconButton,
  Drawer,
  Typography,
  Paper,
  Box,
  InputAdornment,
  ButtonGroup,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  FilterList as FilterListIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Block as BlockIcon,
  Flag as FlagIcon,
  Help as HelpIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/slicers/dashboardSlice";
import {
  UserPlus,
  UserMinus,
  UserCircleMinus,
  Users,
  DotsThreeVertical,
} from "phosphor-react";
import CustomerModel from "./CustomerModel";
import { formatDateTime } from "../../utils/helper";
import CustomLoader from "../../components/Models/CustomLoader";
import { GridOverlay } from "@mui/x-data-grid";
import CustomerDetails from "../../components/customers/CustomerDetails";

const Customer = () => {
  const dispatch = useDispatch();
  const { allUsers, loading, error } = useSelector((state) => state.dashboard);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Active");
  const [isCustomerModelOpen, setIsCustomerModelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State for customer model
  const [customerModelData, setCustomerModelData] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleFilterStatusChange = (status) => {
    setSelectedFilter(status);
  };

  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  const filteredRows =
    allUsers?.filter((row) => {
      // Apply status filter first
      if (selectedFilter !== "All") {
        if (row.status.toLowerCase() !== selectedFilter.toLowerCase()) {
          return false;
        }
      }

      // Apply search text filter
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const matches = Object.values(row).some(
          (val) => val && val.toString().toLowerCase().includes(searchLower)
        );
        if (!matches) return false;
      }

      // Apply individual filters
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        return row[key]
          ?.toString()
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      });
    }) || [];

  const handleDrawerOpen = (customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCustomer(null);
  };

  // Customer Model handlers
  const handleOpenCustomerModel = (customer = null, isEdit = false) => {
    setIsEditing(isEdit);
    setCustomerModelData(customer);
    setIsCustomerModelOpen(true);
  };

  const handleCloseCustomerModel = () => {
    setIsCustomerModelOpen(false);
    setCustomerModelData(null);
  };

  const actionButtons = [
    { name: "All", label: "All", icon: <Users size={16} /> },
    { name: "Active", label: "Active", icon: <UserPlus size={16} /> },
    { name: "Inactive", label: "Inactive", icon: <UserMinus size={16} /> },
  ];

  const handleMenuOpen = (e, customer) => {
    // OnClose()
    setAnchorEl(e.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuOpen = Boolean(anchorEl);

  const columns = [
    {
      field: "id",
      headerName: "Customer ID",
      width: 330,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      flex: 1,
    },
    {
      field: "mobileNumber",
      headerName: "Phone",
      width: 150,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      flex: 1,
      renderCell: (params) => (
        <Box
          component="span"
          sx={{
            padding: "3px 10px",
            borderRadius: "12px",
            backgroundColor: getStatusBackgroundColor(params.value),
            color: getStatusColor(params.value),
            fontSize: "0.75rem",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "OrdersCount",
      headerName: "Order Count",
      width: 150,
      flex: 1,
    },
    {
      field: "updatedAt",
      headerName: "Last Booking Date",
      width: 180,
      flex: 1,
      renderCell: (params) => <Box>{formatDateTime(params.value)}</Box>,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={(e) => handleMenuOpen(e, params.row)}>
            <DotsThreeVertical />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                boxShadow: "none",
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                mt: 1,
                minWidth: 120,
                padding: 0,
              },
            }}
            MenuListProps={{
              sx: {
                padding: 0,
              },
            }}
          >
            {/* <MenuItem
              onClick={() => {
                handleOpenCustomerModel(selectedCustomer, true);
                handleMenuClose();
              }}
              sx={{ px: 2, py: 1, fontSize: 14 }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              sx={{ px: 2, py: 1, fontSize: 14 }}
            >
              Delete
            </MenuItem> */}
            <MenuItem
              onClick={() => {
                handleDrawerOpen(selectedCustomer);
                handleMenuClose();
              }}
              sx={{ px: 2, py: 1, fontSize: 14 }}
            >
              View
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  function getStatusBackgroundColor(status) {
    switch (status) {
      case "active":
        return "#d1fae5";
      case "inactive":
        return "#FECACA";
      case "lost":
        return "#FECACA";
      default:
        return "#E5E7EB";
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "#991b1b";
      case "lost":
        return "#991b1b";
      default:
        return "#6B7280";
    }
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  function CustomNoRowsOverlay() {
    return (
      <GridOverlay>
        <Typography color="textSecondary">No records found.</Typography>
      </GridOverlay>
    );
  }

  return (
    <Stack sx={{ py: 2, height: "100%" }}>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
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
      <Box sx={{ mb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          {/* Search Input */}
          <Stack sx={{ flex: 1, width: 1 }}>
            <TextField
              placeholder="Search all columns..."
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => handleSearchChange(e.target.value)}
              sx={{
                width: { xs: "100%", md: "80%" },
                flexShrink: 0,
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                  md: "0.8rem",
                },
              }}
            />
          </Stack>
          <Stack sx={{ flex: 1, width: "100%", justifyContent: "flex-end" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center", md: "center" },
                justifyContent: {
                  xs: "flex-start",
                  sm: "flex-start",
                  md: "flex-end",
                },
                gap: 1,
              }}
            >
              <ButtonGroup
                orientation="horizontal"
                sx={{
                  border: "1px solid lightgray",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  flexWrap: "wrap",
                  width: { xs: "100%", sm: "auto" },
                  "& .MuiButtonGroup-grouped": { border: "none" },
                  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                    borderRight: { xs: "none", sm: "1px solid #e0e0e0" },
                    borderBottom: { xs: "1px solid #e0e0e0", sm: "none" },
                  },
                }}
              >
                {actionButtons.map((button) => (
                  <Button
                    key={button.name}
                    startIcon={button.icon}
                    onClick={() => handleFilterStatusChange(button.name)}
                    sx={{
                      textTransform: "capitalize",
                      color:
                        selectedFilter === button.name ? "#00b664" : "gray",
                      backgroundColor:
                        selectedFilter === button.name
                          ? "#e6f9f1"
                          : "transparent",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                      py: 0.8,
                      width: { xs: "100%", sm: "auto" },
                      borderBottom: { xs: "1px solid #e0e0e0", sm: "none" },
                      "&:last-of-type": {
                        borderBottom: "none",
                      },
                    }}
                    fullWidth={true}
                  >
                    {button.label}
                  </Button>
                ))}
              </ButtonGroup>

              {/* <Button
                fullWidth
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#00b664",
                  color: "white",
                  px: 4,
                  width: { xs: "100%", sm: "auto" },
                  // mt: { xs: 1, md: 0 },
                  "&:hover": { bgcolor: "#009a54" },

                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.8rem",
                    md: "0.9rem",
                  },
                }}
                onClick={handleOpenCustomerModel}
              >
                Add Customer
              </Button> */}
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          height: "calc(100vh - 150px)" ,
          width: "100%",
          overflow:"hidden"
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          hideFooterSelectedRowCount
          components={{
            Toolbar: CustomToolbar,
          }}
          disableSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={{
            fontSize: {
              xs: "0.7rem",
              sm: "0.8rem",
              md: "0.9rem",
            },
          }}
        />
      </Box>

      <CustomerDetails
        open={drawerOpen}
        onClose={handleDrawerClose}
        customer={selectedCustomer}
      />

      <CustomerModel
        isOpen={isCustomerModelOpen}
        isEdit={isEditing}
        onClose={handleCloseCustomerModel}
        data={customerModelData}
      />
    </Stack>
  );
};

export default Customer;
