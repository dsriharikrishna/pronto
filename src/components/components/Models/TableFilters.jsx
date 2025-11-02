import React from 'react';
import { TextField, Stack, FormControl, InputLabel, Select, MenuItem, Button,Box ,InputAdornment  } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const TableFilters = ({
  searchText,
  handleSearchChange,
  timeline,
  setTimeline,
  statusType,
  setStatusType,
  recurringType,
  setRecurringType,
  exportCSV,
  activeTab,
  bookingType,
  timelineOptions,
  statusTypeOptions,
  recurringTypeOptions,
}) => {
  return (
   <Box
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          // mb: 1,
          gap: 2,
          // alignItems: "center",
          // justifyContent:'center',
          width: "100%",
        }}
      >
        <Stack flex={1} width={"100%"}>
          <TextField
            placeholder="Search by Name, Address,Id,Status,Phone"
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              width: { md: "70%" },
              "& .MuiInputBase-root": {
                height: "32px",
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                  md: "0.75rem",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon size={10} />
                </InputAdornment>
              ),
            }}
            onChange={handleSearchChange}
          />
        </Stack>
        <Stack flex={1} direction={"row"} gap={0.5} justifyContent={"flex-end"}>
          {activeTab !== 0 && activeTab !== 1 && (
            <FormControl sx={{ minWidth: 180, height: "32px" }}>
              <InputLabel
                sx={{
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.75rem",
                    md: "0.75rem",
                  },
                }}
              >
                Timeline
              </InputLabel>
              <Select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                label="Timeline"
                sx={{
                  height: "32px",
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.75rem",
                    md: "0.75rem",
                  },
                }}
              >
                {timelineOptions.map((option) => (
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
            </FormControl>
          )}

          <FormControl sx={{ minWidth: 180, height: "32px" }}>
            <InputLabel
              sx={{
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                  md: "0.75rem",
                },
              }}
            >
              Status Type
            </InputLabel>
            <Select
              value={statusType}
              onChange={(e) => setStatusType(e.target.value)}
              label="Status Type"
              sx={{
                height: "32px",
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                  md: "0.75rem",
                },
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
          </FormControl>

          {bookingType === "Recurring" && (
            <FormControl sx={{ minWidth: 180, height: "32px" }}>
              <InputLabel
                sx={{
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.75rem",
                    md: "0.75rem",
                  },
                }}
              >
                Recurring Type
              </InputLabel>
              <Select
                value={recurringType}
                onChange={(e) => setRecurringType(e.target.value)}
                label="Recurring Type"
                sx={{
                  height: "32px",
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.75rem",
                    md: "0.75rem",
                  },
                }}
              >
                {recurringTypeOptions.map((option) => (
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
            </FormControl>
          )}

          <Button
            onClick={exportCSV}
            sx={{
              textTransform: "capitalize",
              bgcolor: "#00b664",
              textWrap: "nowrap",
              color: "white",
              px: 4,
              height: "32px",
              "&:hover": { bgcolor: "#009954" },
            }}
          >
            Export CSV
          </Button>
        </Stack>
      </Box>
  );
};

export default TableFilters;
