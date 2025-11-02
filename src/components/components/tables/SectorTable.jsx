import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveCatalogData } from "../../redux/slicers/dashboardSlice";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const SectorTable = ({ currentSector ,handleSaveData }) => {
  const dispatch = useDispatch();
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

  const handleSubmit = async (e) => {
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

  // Define rows explicitly
  const rows =
    currentData?.map((item, i) => ({
      id: i + 1,
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
      renderCell: (params) => (
        <TextField
          type="text"
          size="small"
          variant="outlined"
          value={saveAllPayload.prices[params.row.id] ?? params.row.price}
          onChange={(e) => handleInputChange(e, params.row.id)}
          inputProps={{
            step: "0.01",
            pattern: "^\\d+(?:\\.\\d{1,2})?$",
            title: "Currency",
          }}
        />
      ),
    },
  ];

  return (
    <Box mt={0}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ height: 500, width: "100%" }}>
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
              sx={{
                // Header row styling
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f9f9f9",
                  padding: "8px 0",
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#333",
                  borderBottom: "1px solid #ccc",
                },

                // Each row styling
                "& .MuiDataGrid-row": {
                  backgroundColor: "#fafafa",
                  padding: "4px 0",
                  transition: "background-color 0.3s ease",
                },

                // Row hover effect
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#e6f7ff",
                  cursor: "pointer",
                },

                // Selected row styling
                "& .Mui-selected": {
                  backgroundColor: "#bae7ff !important",
                  color: "#0050b3",
                  fontWeight: "600",
                },

                // Cell styling
                "& .MuiDataGrid-cell": {
                  padding: "8px 12px",
                  borderBottom: "1px solid #e0e0e0",
                  fontSize: 14,
                  color: "#444",
                },

                // Remove focus outline on cells but keep accessibility
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },

                // Scrollbar customization for grid viewport (optional)
                "& .MuiDataGrid-virtualScroller": {
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#bbb",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#999",
                  },
                },
              }}
            />
          )}
        </Box>

        <Box display="flex" justifyContent="flex-end" px={2} py={1}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading}
            
          >
            Save All
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SectorTable;
