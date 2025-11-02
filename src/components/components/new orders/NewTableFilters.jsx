import React, { useEffect, useState } from "react";
import {
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  InputAdornment,
  Checkbox,
  ListItemText
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import { styled } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "./DateRangePicker";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: "0",
    height: "32px",
  },
  "& input": {
    // padding: "0",
    height: "100%",
    boxSizing: "border-box",
  },
}));

const ALL_VALUE = "ALL";


const NewTableFilters = ({
  searchText,
  handleSearchChange,
  bookingDropdownType,
  setBookingDropdownType,
  statusType,
  setStatusType,
  recurringType,
  setRecurringType,
  exportCSV,
  bookingTypes,
  statusTypeOptions,
  recurringTypeOptions,
  dateRange,
  setDateRange,
  activeTab,
  handleBookingDropdownType,
  // handleStatusTypeChange,
  handleSelectChange,
  handleRecurringTypeChange,
  hubsDropdown,
  selectedHub,
  handleHubsTypeChange,
}) => {
  // Local state for instant input feedback
  const [localSearch, setLocalSearch] = useState(searchText);
  const [error, setError] = useState("");

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  useEffect(() => {
    setLocalSearch(searchText);
  }, [searchText]);

  const onInputChange = (e) => {
    setLocalSearch(e.target.value);
    handleSearchChange(e);
  };

  useEffect(() => {
    if (activeTab === 2) {
      setStatusType(["PENDING_MATCH"]);
    } 
  }, [activeTab]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { md: "row", xs: "column" },
        gap: { xs: 1.5, sm: 1, md: 2 },
        alignItems: { xs: "stretch", sm: "flex-start", md: "center" },
        justifyContent: "space-between",
        flexWrap: "wrap",
        width: "100%",
        p: { xs: 1.5, sm: 1, md: 0 },
      }}
    >
      <Stack
        flex={1}
        direction={{ xs: "column", sm: "row" }}
        gap={{ xs: 1, sm: 0.5 }}
        width="100%"
      >
        {/* Booking type */}
        <FormControl
          sx={{
            minWidth: { xs: "100%", sm: 120 },
            height: "32px",
            mb: { xs: 1, sm: 0 },
          }}
        >
          <InputLabel
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: "0.75rem",
                md: "0.75rem",
              },
            }}
          >
            Booking Type
          </InputLabel>
          <Select
            value={bookingDropdownType}
            onChange={handleBookingDropdownType}
            // onChange={(e) => setBookingDropdownType(e.target.value)}
            label="Booking Type"
            sx={{
              height: "32px",
              fontSize: {
                xs: "0.7rem",
                sm: "0.75rem",
                md: "0.75rem",
              },
            }}
          >
            {bookingTypes.map((option) => (
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

        {/* recurringtype */}
        {bookingDropdownType === "RECURRING" && (
          <FormControl
            sx={{
              minWidth: { xs: "100%", sm: 120 },
              height: "32px",
              mb: { xs: 1, sm: 0 },
            }}
          >
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
              onChange={handleRecurringTypeChange}
              // onChange={(e) => setRecurringType(e.target.value)}
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

        {/* statusType */}
        <FormControl
          sx={{
            minWidth: { xs: "100%", sm: 120 },
            height: "32px",
            mb: { xs: 1, sm: 0 },
          }}
        >
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
          {/* <Select
  multiple
  value={statusType}
  onChange={(e) => handleStatusTypeChange(e.target.value)}
  label="Status Type"
  disabled={activeTab === 2}
  sx={{
    height: "32px",
    fontSize: {
      xs: "0.7rem",
      sm: "0.75rem",
      md: "0.75rem",
    },
  }}
  renderValue={(selected) => {
    if (!Array.isArray(selected)) return "";

    if (activeTab === 2) {
      return statusTypeOptions.find((opt) => opt.value === "PENDING_MATCH")?.label || "PENDING_MATCH";
    }

    const allValues = statusTypeOptions.map((opt) => opt.value);
    const isAllSelected = selected.length === allValues.length &&
      allValues.every(val => selected.includes(val));

    if (isAllSelected) return "ALL";

    return selected
      .map((value) => statusTypeOptions.find((option) => option.value === value)?.label)
      .join(", ");
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
      <Checkbox checked={statusType.includes(option.value)} />
      <span style={{ fontSize: "0.75rem" }}>{option.label}</span>
    </MenuItem>
  ))}
</Select> */}

          <Select
            multiple
            value={
              statusType.includes(ALL_VALUE)
                ? statusTypeOptions.map((opt) => opt.value)
                : statusType
            }
            onChange={handleSelectChange}
            label="Status Type"
            disabled={activeTab === 2}
            sx={{
              height: "32px",
              fontSize: {
                xs: "0.7rem",
                sm: "0.75rem",
                md: "0.75rem",
              },
            }}
            renderValue={(selected) => {
              if (activeTab === 2) {
                return (
                  statusTypeOptions.find((opt) => opt.value === "PENDING_MATCH")?.label ||
                  "PENDING_MATCH"
                );
              }

              if (statusType.includes(ALL_VALUE)) return "ALL";

              return selected
                .map(
                  (value) =>
                    statusTypeOptions.find((option) => option.value === value)?.label
                )
                .join(", ");
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
                <Checkbox
                  checked={
                    statusType.includes(ALL_VALUE) || statusType.includes(option.value)
                  }
                />
                <span style={{ fontSize: "0.75rem" }}>{option.label}</span>
              </MenuItem>
            ))}
          </Select>


        </FormControl>

        {/* hubs type */}
        <FormControl
          sx={{
            minWidth: { xs: "100%", sm: 120 },
            height: "32px",
            mb: { xs: 1, sm: 0 },
          }}
          size="small"
        >
          <InputLabel
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.75rem" },
            }}
          >
            Hubs Type
          </InputLabel>
          <Select
            value={
              hubsDropdown.some((hub) => hub.id === selectedHub?.id)
                ? selectedHub.id
                : "prontoHubsAll"
            }
            onChange={(e) => handleHubsTypeChange(e.target.value)}
            label="Hubs Type"
            sx={{
              height: "32px",
              fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.75rem" },
            }}
          >
            <MenuItem key="prontoHubsAll" value="prontoHubsAll">All</MenuItem>
            {hubsDropdown.map((hub) => (
              <MenuItem
                key={hub.id}
                value={hub.id}
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.75rem" },
                }}
              >
                {hub.address}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack
        sx={{
          display: "flex",
          gap: { xs: 1.5, sm: 2 },
          width: { xs: "100%", md: "20%" },
          mt: { xs: 1.5, sm: 0 },
        }}
      >
        <DateRangePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          activeTab={activeTab}
        />
      </Stack>

      <Stack
        flex={1}
        direction={{ xs: "column", sm: "row" }}
        gap={{ xs: 1.5, sm: 0.5 }}
        width="100%"
        mt={{ xs: 1.5, sm: 0 }}
      >
        <Box
          sx={{
            width: "100%",
            gap: { xs: 1.5, sm: 2 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end",
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <TextField
            placeholder="Search by Order ID, Mobile Number, Name "
            variant="outlined"
            size="small"
            fullWidth
            value={localSearch}
            sx={{
              width: { xs: "100%", md: "70%" },
              "& .MuiInputBase-root": {
                height: "32px",
                width: { xs: "100%", sm: "auto" },
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
            onChange={onInputChange}
          />

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
        </Box>
      </Stack>
    </Box>
  );
};

export default NewTableFilters;
