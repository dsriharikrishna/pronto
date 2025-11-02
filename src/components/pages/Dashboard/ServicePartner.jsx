import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
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
  Menu,
  MenuItem,
  FormControl,
  Select,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Search as SearchIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  UserPlus,
  UserMinus,
  DotsThreeVertical,
  Bookmark,
  Clock,
} from "phosphor-react";
import CustomLoader from "../../components/Models/CustomLoader";
import { GridOverlay } from "@mui/x-data-grid";
import { formatDateTime, formatTime, getDayName } from "../../utils/helper";
import {
  deletePartner,
  fetchAllPartners,
  fetchHubsDataForPartners,
  savePartnerStatus,
} from "../../redux/slicers/partnerSlice";
import { useNavigate } from "react-router-dom";
import PartnerEditDialog from "../../components/partners/PartnerEditDialog";
import { ShowToast } from "../../components/ToastAndSnacks/ShowToast";
import DeletePartnerDialog from "../../components/partners/DeletePartnerDialog";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import { DUMMY_DATA } from "../../utils/constant";



const ServicePartner = () => {
  const uploadRef = useRef(null)
  const statusOptions = [
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "unavailable", label: "Unavailable" },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.partners?.loading);
  const partners = useSelector((state) => state.partners?.allPartners) || [];
  const hubsData =
    useSelector((state) => state.partners?.partnersHubsData) || [];

  // State management
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({});
  const [statusFilter, setStatusFilter] = useState("Active");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isPartnerEdit, setIsPartnerEdit] = useState(false);
  const [isPartnerDelete, setIsPartnerDelete] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [refreshCount, setRefreshCount] = useState(0);
  const [modelState, setModelState] = useState({
    isOpen: false,
    isEdit: false,
    data: null,
  });

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAllPartners());
  }, [dispatch, refreshCount]);

  // Fetch hubs on mount
  useEffect(() => {
    dispatch(fetchHubsDataForPartners());
  }, [dispatch]);

  // Memoized filtered data
  const filteredRows = useMemo(() => {
    return partners?.filter((partner) => {
      // Apply status filter
      if (
        statusFilter !== "All" &&
        partner.status !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      // Apply search text filter
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const matches = Object.values(partner).some((val) =>
          val?.toString().toLowerCase().includes(searchLower)
        );
        if (!matches) return false;
      }

      // Apply individual filters
      return Object.entries(filters).every(
        ([key, value]) =>
          !value ||
          partner[key]?.toString().toLowerCase().includes(value.toLowerCase())
      );
    });
  }, [partners, statusFilter, searchText, filters]);

  // Status styling functions
  const getStatusBackground = useCallback((status) => {
    const statusColors = {
      active: "#d1fae5",
      inactive: "#FECACA",
      suspended: "#FEF3C7",
    };
    return statusColors[status] || "#E5E7EB";
  }, []);

  const getStatusColor = useCallback((status) => {
    const statusColors = {
      active: "green",
      inactive: "#991b1b",
      suspended: "#92400E",
    };
    return statusColors[status] || "#6B7280";
  }, []);

  // Menu handlers
  const handleMenuOpen = useCallback((event, partner) => {
    setMenuAnchor(event.currentTarget);
    setSelectedPartner(partner);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
    setSelectedPartner(null);
  }, []);

  const openAddPartnerPage = useCallback(() => {
    navigate("/workers/add");
  }, [navigate]);

  const handleEditPartner = useCallback(
    (selectedPartner) => {
      setIsPartnerEdit(true);
      // navigate("/workers/edit", {
      //   state: { partnerData: selectedPartner, hubsData: hubsData },
      // });
    },
    [selectedPartner, navigate]
  );

  const handlePartnerEditClose = () => {
    setIsPartnerEdit(false);
    handleMenuClose();
    setRefreshCount((prev) => prev + 1);
  };

  const handleOpenDialog = useCallback(
    (partner) => {
      setSelectedPartner(partner);
      setIsPartnerDelete(true);
    },
    [handleMenuClose]
  );

  const handleCloseDialog = () => {
    setIsPartnerDelete(false);
    setSelectedPartner(null);
    handleMenuClose();
  };

  const handleDeletePartner = useCallback(async () => {
    if (selectedPartner) {
      const payload = {
        ids: [selectedPartner.id],
      };

      try {
        const response = await dispatch(deletePartner(payload)).unwrap();
        if (response?.message === "Workers deleted successfully") {
          ShowToast("success", "Worker deleted successfully!!!");
          setRefreshCount((prev) => prev + 1);
        } else {
          ShowToast("error", response?.message || "Failed to delete worker");
        }
      } catch (error) {
        ShowToast("error", "Failed to delete worker");
      } finally {
        handleCloseDialog();
      }
    }
  }, [dispatch, selectedPartner, handleCloseDialog]);

  const handleStatusChange = (id, value) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Save button
  const handleSave = async (id) => {
    const newStatus = statusMap[id];
    if (newStatus === undefined) {
      return;
    }

    const payload = {
      partnerId: id,
      status: newStatus,
    };

    try {
      const response = await dispatch(savePartnerStatus(payload)).unwrap();
      // console.log(response);
      ShowToast(
        "success",
        response?.message || "Worker Created Successfully!!!"
      );
      setRefreshCount((prev) => prev + 1);
    } catch (error) {
      // console.log(error);
      ShowToast("error", error.message || "Worker Created Successfully!!!");
    }

    setStatusMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const UnavailableIcon = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );

  // Action buttons configuration
  const actionButtons = useMemo(
    () => [
      { name: "All", label: "All", icon: <Users size={16} /> },
      { name: "Active", label: "Active", icon: <UserPlus size={16} /> },
      { name: "Inactive", label: "Inactive", icon: <UserMinus size={16} /> },
      {
        name: "unavailable",
        label: "Unavailable",
        icon: (
          <UnavailableIcon
            style={{ color: "#f44336", width: 16, height: 16 }}
          />
        ),
      },
    ],
    []
  );

  // colunms
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "Worker ID",
        width: 330,
        flex: 1,
      },
      {
        field: "name",
        headerName: "Name",
        width: 250,
        flex: 1,
        renderCell: (params) => {
          const name = params.value;

          return (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyItems: "flex-start",
                height: "100%",
              }}
            >
              <Typography variant="body2">{name}</Typography>
            </Box>
          );
        },
      },
      {
        field: "mobile_number" || "mobileNumber",
        headerName: "Mobile Number",
        width: 250,
        flex: 1,
      },
      {
        field: "gender",
        headerName: "Gender",
        width: 150,
        flex: 1,
        renderCell: (params) => {
          const gender = params.value;
          return gender
            ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
            : "";
        },
      },
      {
        field: "hub_name",
        headerName: "Hub Name",
        width: 200,
        flex: 1,
      },
      {
        field: "status",
        headerName: "Status",
        maxWidth: 220,
        flex: 1,
        renderCell: (params) => {
          const row = params.row;
          const id = row.id;
          const originalStatus = row.status;
          const currentStatus = statusMap[id] ?? originalStatus;

          const isChanged =
            statusMap[id] !== undefined && statusMap[id] !== originalStatus;

          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                gap: 0.5,
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: "500",
                textTransform: "capitalize",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                width="100%"
                justifyContent="space-around"
                alignItems="center"
              >
                <FormControl fullWidth size="small">
                  <Select
                    value={currentStatus || ""}
                    onChange={(e) => handleStatusChange(id, e.target.value)}
                    sx={{
                      fontWeight: 300,
                      borderRadius: 1,
                      fontSize: "13px",
                      "& .MuiSelect-select": {
                        padding: "4px 8px",
                      },
                    }}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem
                        key={option.key}
                        value={option.key}
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

                {/* <Button
                  size="small"
                  onClick={() => handleSave(id)}
                  disabled={!isChanged}
                  sx={{
                    textTransform: "capitalize",
                    color: isChanged ? "#00b664" : "gray",
                    border: isChanged
                      ? "1px solid #00b664"
                      : "1px solid lightgray",
                    padding: "0 8px",
                    minWidth: 50,
                    cursor: isChanged ? "pointer" : "default",
                  }}
                >
                  Save
                </Button> */}

                <Tooltip title={isChanged ? "" : "Save"}>
                  <span style={{ display: "inline-flex" }}>
                    <Button
                      size="small"
                      onClick={() => handleSave(id)}
                      disabled={!isChanged}
                      sx={{
                        textTransform: "capitalize",
                        color: "#00b664",
                        cursor: isChanged ? "pointer" : "not-allowed",
                        padding: "0",
                        minWidth: 0,
                        minHeight: 0,
                        lineHeight: 1,
                        "& .MuiButton-startIcon": {
                          margin: 0,
                        },
                        "& .MuiButton-endIcon": {
                          margin: 0,
                        },
                      }}
                    >
                      <Bookmark size={22} weight="fill" />
                    </Button>
                  </span>
                </Tooltip>
              </Stack>
            </Box>
          );
        },
      },

      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        sortable: false,
        renderCell: (params) => {
          const row = params.row;
          return (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <IconButton onClick={(e) => handleMenuOpen(e, params.row)}>
                <DotsThreeVertical />
              </IconButton>
            </Box>
          );
        },
      },
    ],
    [
      getStatusBackground,
      getStatusColor,
      handleStatusChange,
      handleSave,
      statusOptions,
    ]
  );

  // Custom toolbar component
  const CustomToolbar = useCallback(
    () => (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    ),
    []
  );

  function CustomNoRowsOverlay() {
    return (
      <GridOverlay>
        <Typography color="textSecondary">No data available.</Typography>
      </GridOverlay>
    );
  }

  const importPartners = () => {
    uploadRef.current.click()
  }

   const handleExcelUpload = (event) => {

    try{

      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      // You can now set this in state, send to API, etc.
    };
    
    reader.readAsArrayBuffer(file);

  }finally{
    event.target.value = null;
  }
  };

  const downloadSampleData = () => {
 const worksheet = XLSX.utils.json_to_sheet(DUMMY_DATA);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Workers");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(fileData, "sample_workers.xlsx");
  }

  return (
    <Stack sx={{ py: 2, height: "100%", overflow: "auto" }}>
      {loading && (
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

      {/* Search and filter bar */}
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
              sx={{ width: { xs: "100%", md: "80%" }, flexShrink: 0, mt: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setSearchText(e.target.value)}
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
              {/* Filter Buttons */}
              <ButtonGroup
                sx={{
                  border: "1px solid lightgray",
                  borderRadius: "8px",
                  overflow: "hidden",
                  "& .MuiButtonGroup-grouped": { border: "none" },
                  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                    borderRight: "1px solid #e0e0e0",
                  },
                  flexWrap: "wrap",
                }}
              >
                {actionButtons.map((button) => (
                  <Button
                    key={button.name}
                    startIcon={button.icon}
                    onClick={() => setStatusFilter(button.name)}
                    sx={{
                      mb: 0,
                      textTransform: "capitalize",
                      color: statusFilter === button.name ? "#00b664" : "gray",
                      fontSize: "14px",
                      backgroundColor:
                        statusFilter === button.name ? "#e8f5ee" : "inherit",
                      "&:hover": {
                        backgroundColor:
                          statusFilter === button.name ? "#d1fae5" : "#f5f5f5",
                      },
                    }}
                  >
                    {button.label}
                  </Button>
                ))}
              </ButtonGroup>

                {/* Download Sample Data*/}
              {/* <Button
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#00b664",
                  color: "white",
                  px: 4,
                  width: { xs: "100%", sm: "auto" },
                  // mt: { xs: 0, md: 0 },
                  "&:hover": { bgcolor: "#009a54" },
                }}
                onClick={downloadSampleData}
              >
                Download Sample
              </Button> */}


              {/* Import xsls file */}
              {/* <Button
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#00b664",
                  color: "white",
                  px: 4,
                  width: { xs: "100%", sm: "auto" },
                  // mt: { xs: 0, md: 0 },
                  "&:hover": { bgcolor: "#009a54" },
                }}
                onClick={importPartners}
              >
                Import Partners
              </Button> */}

              <input style={{display:'none'}} ref={uploadRef} type="file" accept=".xlsx,.xls" onChange={handleExcelUpload}/>

              {/* Add Button */}
              <Button
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#00b664",
                  color: "white",
                  px: 4,
                  width: { xs: "100%", sm: "auto" },
                  // mt: { xs: 0, md: 0 },
                  "&:hover": { bgcolor: "#009a54" },
                }}
                onClick={openAddPartnerPage}
              >
                Add Worker
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Data grid */}
      <Box
        sx={{
          height: "calc(100vh - 150px)",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          components={{ Toolbar: CustomToolbar }}
          disableSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          componentsProps={{
            pagination: {
              SelectProps: {
                MenuProps: {
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root": {
                        fontSize: "14px",
                      },
                    },
                  },
                },
              },
            },
          }}
          sx={{
            "& .MuiDataGrid-virtualScroller": {
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                width: "8px",
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
                borderRadius: "4px",
              },
              "& .MuiMenuItem-root": {
                fontSize: "14px",
              },
            },
          }}
        />
      </Box>

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
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
        MenuListProps={{ sx: { padding: 0 } }}
      >
        <MenuItem
          onClick={() => {
            handleEditPartner(selectedPartner);
          }}
          sx={{ px: 2, py: 1, fontSize: 14 }}
        >
          Edit
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleOpenDialog(selectedPartner);
          }}
          sx={{ px: 2, py: 1, fontSize: 14 }}
        >
          Delete
        </MenuItem> */}
        {/* <MenuItem onClick={handleMenuClose}
         sx={{ px: 2, py: 1, fontSize: 14 }}>
          View
        </MenuItem> */}
      </Menu>

      {/* Worker Edit Dialog */}
      <PartnerEditDialog
        open={isPartnerEdit}
        onClose={handlePartnerEditClose}
        partnerData={selectedPartner}
        hubsData={hubsData}
      />

      {/* Delete Worker Dialog */}
      <DeletePartnerDialog
        open={isPartnerDelete}
        onClose={handleCloseDialog}
        onConfirm={handleDeletePartner}
        partnerName={selectedPartner?.name}
      />
    </Stack>
  );
};

export default React.memo(ServicePartner);
