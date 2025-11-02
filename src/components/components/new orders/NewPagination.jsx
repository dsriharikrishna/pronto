import React from "react";
import { Select, MenuItem, Button, Box, Typography } from "@mui/material";

const NewPagination = ({
  ordersByDateData,
  pageSize,
  currentPage,
  setCurrentPage,
  handlePageSizeChange,
  handlePreviousPage,
  handleNextPage,
  isNextDisabled,
  search,
}) => {
  return (
    <Box
      sx={{
        mb: 2,
        position: "sticky",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // px: 2
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
          Rows per page:
        </Typography>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          size="small"
          disabled={Boolean(search)}
          sx={{
            fontSize: "13px",
            p: 0,
            m: 0,
            "& .MuiSelect-select": {
              padding: "4px 8px",
            },
          }}
        >
          <MenuItem
            value={10}
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: "0.75rem",
                md: "0.75rem",
              },
            }}
          >
            10
          </MenuItem>
          <MenuItem
            value={20}
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: "0.75rem",
                md: "0.75rem",
              },
            }}
          >
            20
          </MenuItem>
          <MenuItem
            value={50}
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: "0.75rem",
                md: "0.75rem",
              },
            }}
          >
            50
          </MenuItem>
          <MenuItem
            value={100}
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: "0.75rem",
                md: "0.75rem",
              },
            }}
          >
            100
          </MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
              md: "0.75rem",
            },
            fontWeight: 500,
          }}
        >
          Total Records : {""}
          {ordersByDateData?.length > 0 ? ordersByDateData?.length : "0"}
        </Typography>
        {/* <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          sx={{
            textTransform: "capitalize",
            color: "#00b664",
            fontSize: "13px",
          }}
        >
          Previous
        </Button> */}
        <Button
          onClick={handleNextPage}
          disabled={isNextDisabled || Boolean(search)}
          sx={{
            textTransform: "capitalize",
            color: "#00b664",
            fontSize: "13px",
          }}
        >
          Show more...
        </Button>
      </Box>
    </Box>
  );
};

export default NewPagination;
