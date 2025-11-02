import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  IconButton,
  Drawer,
  Typography,
  Box,
  InputAdornment,
  ButtonGroup,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Flag as FlagIcon,
  Help as HelpIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchHubsData } from "../../redux/slicers/dashboardSlice";
import { UserPlus, UserMinus, UserCircleMinus, Users } from "phosphor-react";
import HubModel from "../../components/Models/HubModel"; // Import your HubModel component

const Hubs = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState(null);
  const [hubsData, setHubsData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isHubModelOpen, setIsHubModelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchHubsData()).unwrap();
        setHubsData(response?.data?.hubs || []);
      } catch (error) {
        console.error("Error fetching hubs data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  const handleFilterStatusChange = (status) => {
    setSelectedFilter(status);
  };

  const filteredRows = hubsData?.filter((row) => {
    // Apply status filter first
    if (selectedFilter !== "All") {
      if (selectedFilter === "Active" && !row.isActive) return false;
      if (selectedFilter === "Inactive" && row.isActive) return false;
      if (selectedFilter === "Lost" && !row.isLost) return false; // Assuming you have an isLost field
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

  const handleDrawerOpen = (hub) => {
    setSelectedHub(hub);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedHub(null);
  };

  const handleAddHub = () => {
    setIsEditing(false);
    setIsHubModelOpen(true);
  };

  const handleEditHub = (hub) => {
    setSelectedHub(hub);
    setIsEditing(true);
    setIsHubModelOpen(true);
  };

  const handleCloseHubModel = () => {
    setIsHubModelOpen(false);
    setSelectedHub(null);
  };

  const actionButtons = [
    { name: "All", label: "All", icon: <Users size={16} /> },
    { name: "Active", label: "Active", icon: <UserPlus size={16} /> },
    { name: "Inactive", label: "Inactive", icon: <UserMinus size={16} /> },
    // { name: "Lost", label: "Lost", icon: <UserCircleMinus size={16} /> },
  ];

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
    },
    {
      field: "city",
      headerName: "City",
      width: 120,
    },
    {
      field: "state",
      headerName: "State",
      width: 120,
    },
    {
      field: "pincode",
      headerName: "Pincode",
      width: 120,
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Box
          // sx={{
          //   bgcolor: getStatusBackgroundFilter(params.value),
          //   color: getStatusFilter(params.value),
          //   color: params.value ? "success.main" : "error.main",
          //   fontWeight: 500,
          // }}
          component="span"
          sx={{
            padding: "3px 10px",
            borderRadius: "12px",
            backgroundColor:           
            (params.value),
            color: getStatusFilter(params.value),
            fontSize: "0.75rem",
            fontWeight: "500",
          }}
        >
          {params.value ? "Active" : "Inactive"}
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      renderCell: (params) => (
        <Box>
          {params.row.createdAt
            ? new Date(params.row.createdAt).toLocaleDateString()
            : "N/A"}
        </Box>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 150,
      renderCell: (params) => (
        <Box>
          {params.row.updatedAt
            ? new Date(params.row.updatedAt).toLocaleDateString()
            : "N/A"}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton size="small" onClick={() => handleEditHub(params.row)}>
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];
  


  const getStatusFilter =(status) =>{
    switch(status) {
      case "active":
        return "green";
      case "inactive":
        return "#991b1b";
      case "lost":
        return "#991b1b";
    } 

  }

  const getStatusBackgroundFilter =(status) =>{
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


  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <Stack sx={{ p: 2, height: "100%" }}>
      <Box sx={{ display: "flex", mb: 2, gap: 4 }}>
          <TextField
            placeholder="Search all columns..."
            variant="outlined"
            size="small"
            sx={{ width: "40%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
           <Stack
                    direction={"row"}
                    sx={{ gap: 3 }}
                    justifyContent={"flex-end"}
                    width={"100%"}
                  >
          <ButtonGroup
            sx={{
              border: "1px solid lightgray",
              borderRadius: "8px",
              overflow: "hidden",
              "& .MuiButtonGroup-grouped": {
                border: "none",
              },
              "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                borderRight: "1px solid #e0e0e0",
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
                  color: selectedFilter === button.name ? "#00b664" : "gray",
                  backgroundColor: selectedFilter === button.name ? "#e6f9f1" : "transparent",
                  fontSize: "14px",
                }}
              >
                {button.label}
              </Button>
            ))}
          </ButtonGroup>
          </Stack>
        
        <Box>
          <Button 
            onClick={handleAddHub}
            sx={{
              textTransform: 'capitalize',
              bgcolor: '#00b664',
              color: 'white',
              textWrap:'nowrap',
              px: 4,
              borderRadius: '6px',
              '&:hover': {
                bgcolor: '#009a56',
              }
            }}
          >
            Add Hub
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          components={{
            Toolbar: CustomToolbar,
          }}
          disableSelectionOnClick
        />
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 300, p: 2 }}>
          {selectedHub && (
            <>
              <Typography variant="h6" gutterBottom>
                Hub Details
              </Typography>
              <Typography variant="body1" gutterBottom>
                Name: {selectedHub.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Address: {selectedHub.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Status: {selectedHub.isActive ? "Active" : "Inactive"}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  startIcon={<FlagIcon />}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                >
                  Flag for Review
                </Button>
                <Button startIcon={<HelpIcon />} variant="outlined">
                  Help
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      <HubModel
        isOpen={isHubModelOpen}
        isEdit={isEditing}
        onClose={handleCloseHubModel}
        data={selectedHub}
      />
    </Stack>
    // </Stack>
  );
};

export default Hubs;