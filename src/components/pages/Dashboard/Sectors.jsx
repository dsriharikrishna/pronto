import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Alert,
  TextField,
  CircularProgress,
  Stack,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import {
  fetchSectorList,
  getCatalogData,
  createSector,
  saveCatalogData,
} from "../../redux/slicers/dashboardSlice";
import { AvailableSectors } from "../../utils/types";
import DataLoader from "../../components/UI/DataLoader";
import { DataGrid } from "@mui/x-data-grid";
import SectorTable from "../../components/tables/SectorTable";
import CustomLoader from "../../components/Models/CustomLoader";
import { GridOverlay } from '@mui/x-data-grid';

const Sectors = () => {
  const dispatch = useDispatch();
  const sectorsList = useSelector((state) => state.dashboard.sectorList) || [];
  const sectorListIsLoading = useSelector((state) => state.dashboard.loading);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSector, setCurrentSector] = useState({});
  const [sectorName, setSectorName] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const open = Boolean(anchorEl);

  const { sectorTableData, loading: isLoading } = useSelector(
    (state) => state.dashboard
  );

  const [currentData, setCurrentData] = useState(sectorTableData);
  const [saveAllPayload, setSaveAllPayload] = useState({
    sector_id: currentSector?.sector_id,
    prices: {},
  });

  useEffect(() => {
    if (sectorTableData) {
      setCurrentData(sectorTableData);

      const prices = sectorTableData.reduce((acc, item) => {
        acc[item.id] = item.price;
        return acc;
      }, {});

      setSaveAllPayload((prev) => ({
        ...prev,
        sector_id: currentSector?.sector_id,
        prices: {
          ...prev.prices,
          ...prices,
        },
      }));
    }
  }, [sectorTableData, currentSector?.sector_id]);

  useEffect(() => {
    dispatch(fetchSectorList());
  }, [dispatch]);

  useEffect(() => {
    if (sectorsList && sectorsList.length > 0) {
      setCurrentSector(sectorsList[0]);
      dispatch(getCatalogData(sectorsList[0]?.sector_name));
    }
  }, [sectorsList]);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleSectorSelection = async (value) => {
    setCurrentSector(value);
    handleDropdownClose();
    try {
      await dispatch(getCatalogData(value.sector_name)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSector = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!sectorName) {
      setFormError("Please select a sector name!");
      return;
    }

    try {
      await dispatch(createSector({ sector_name: sectorName })).unwrap();
      setSectorName("");
      setFormSuccess("Sector created successfully!");
      dispatch(fetchSectorList());
    } catch (err) {
      setFormError("Failed to create sector.");
    }
  };

  const handleInputChange = (e, id) => {
    const { value } = e.target;
    setSaveAllPayload((prev) => ({
      ...prev,
      prices: {
        ...prev.prices,
        [id]: Number(value),
      },
    }));
  };

  const handleSaveData = async (e) => {
    console.log("save", saveAllPayload);
    e.preventDefault();
    try {
      const res = await dispatch(saveCatalogData(saveAllPayload)).unwrap();
      if (res.success) {
        const updatedData = currentData.map((item) => {
          const newPrice = saveAllPayload.prices[item.id];
          return newPrice !== undefined ? { ...item, price: newPrice } : item;
        });
        setCurrentData(updatedData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // console.log(currentData)

  // Define rows explicitly
  const rows =
    currentData?.map((item, i) => ({
      id: item?.id,
      name: item.name,
      description: item.description,
      price: item.price,
    })) || [];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Service Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "price", headerName: "Price", width: 120 },
    {
      field: "newPrice",
      headerName: "New Price",
      width: 130,
      justifyContent: "center",
      alignItems: "center",
      renderCell: (params) => (
        <Stack alignItems="center" justifyContent="center" mt={1.6}>
          <TextField
            type="text"
            size="small"
            variant="outlined"
            value={saveAllPayload.prices[params.row.id] ?? params.row.price}
            onChange={(e) => handleInputChange(e, params.row.id)}
            inputProps={{
              style: {
                textAlign: "center",
                padding: 1,
              },
              step: "0.01",
              pattern: "^\\d+(?:\\.\\d{1,2})?$",
              title: "Currency",
            }}
            sx={{
              "& .MuiOutlinedInput-input": {
                textAlign: "center",
                padding: 2,
              },
            }}
          />
        </Stack>
      ),
    },
  ];

  function CustomNoRowsOverlay() {
  return (
    <GridOverlay>
      <Typography variant="h6" color="textSecondary">
        No data available.
      </Typography>
      
    </GridOverlay>
  );
}

  return (
    <Box sx={{ minHeight: "100%", bgcolor: "#fff", overflow: "hidden" }}>
      {sectorListIsLoading && (
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
      <Box sx={{ maxWidth: "100%", mx: "auto", px: 0, py: 1 }}>
        {/* Select Sector Section */}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 1.2,
            mb: 1,
          }}
        >
          {/* Title */}
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "16px" }} >
              Sectors Management
            </Typography>
          </Box>

          {/* Controls */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {/* Dropdown Button */}
            <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
              <Button
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  color: "text.primary",
                  borderColor: "grey.400",
                  bgcolor: "#fff",
                  borderRadius: 1,
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  width: "100%",
                  justifyContent: "space-between",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "grey.50",
                  },
                }}
                onClick={handleDropdownClick}
                endIcon={<ExpandMore />}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                aria-controls={Boolean(anchorEl) ? "sector-menu" : undefined}
              >
                {currentSector?.sector_name || "Select Sector"}
              </Button>

              <Menu
                id="sector-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleDropdownClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 0.5,
                    borderRadius: 1,
                    minWidth: 200,
                    maxHeight: 300,
                    overflowY: "auto",
                  },
                }}
              >
                {sectorsList.map((sector) => (
                  <MenuItem
                    key={sector.sector_id}
                    selected={sector.sector_name === currentSector?.sector_name}
                    onClick={() => handleSectorSelection(sector)}
                    sx={{
                      fontWeight:
                        sector.sector_name === currentSector?.sector_name
                          ? 600
                          : 400,
                    }}
                  >
                    {sector.sector_name}
                  </MenuItem>
                ))}
              </Menu>
            </FormControl>

            {/* Save Button */}
            <Button
              variant="contained"
              type="submit"
              onClick={handleSaveData}
              sx={{
                minWidth: { xs: "100%", sm: 120 },
                py: 1,
                textTransform: "capitalize",
                fontWeight: 600,
                bgcolor: "#00b664",
              }}
            >
              Save All
            </Button>
          </Box>
        </Box>

        {/* Sector Table */}
        <Box mt={0}>
          <Box mt={0}>
            <Box sx={{ height: 500, width: "100%" }}>
              {isLoading ? (
                <></>
              ) : (
                // <Box
                //   display="flex"
                //   justifyContent="center"
                //   alignItems="center"
                //   height="100%"
                // >
                //   <CircularProgress />
                // </Box>

                <Box
                  sx={{
                    height: "calc(90vh - 60px)",
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f9f9f9",
                      fontWeight: "bold",
                      fontSize: 14,
                      color: "#333",
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    },
                    "& .MuiDataGrid-cell": {
                      fontSize: 14,
                      color: "#333",
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    },
                    "& .MuiDataGrid-row": {
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    },
                    "& .MuiDataGrid-root": {
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    },
                  }}
                >
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                    slots={{
                      noRowsOverlay: CustomNoRowsOverlay,
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sectors;
