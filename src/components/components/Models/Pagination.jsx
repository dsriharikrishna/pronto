import React from 'react';
import {  Select, MenuItem, Button,Box , Typography  } from '@mui/material';

const Pagination = ({
    ordersByDateData,
    pageSize,
    currentPage,
    handlePageSizeChange,
    handlePreviousPage,
    handleNextPage,
}) => {
  return (
   <Box
          sx={{
            // mt: 2,
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
              {ordersByDateData?.data?.length > 0
                ? `${(currentPage - 1) * pageSize + 1}-${Math.min(
                  currentPage * pageSize,
                  ordersByDateData.total
                )} of ${ordersByDateData.total}`
                : "0 of 0"}
            </Typography>
            <Button
              //disabled={page === 0}
              //onClick={() => setPage((prev) => prev - 1)}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              sx={{
                textTransform: "capitalize",
                color: "#00b664",
                fontSize: "13px",
              }}
            >
              Previous
            </Button>
            <Button
              // disabled={endIndex >= filteredOrders.length}
              //  onClick={() => setPage((prev) => prev + 1)}
              onClick={handleNextPage}
              disabled={currentPage === ordersByDateData?.totalPages}
              sx={{
                textTransform: "capitalize",
                color: "#00b664",
                fontSize: "13px",
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
  );
};

export default Pagination;
