import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  DialogContent,
  InputLabel,
  TextField,
  InputAdornment,
  Autocomplete,
  Button,
} from "@mui/material";
import { CalendarToday, Cancel, Add } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import NewCustomDatePicker from "./NewCustomDatePicker";
import { formatDateTime } from "../../utils/helper";
import { createFilterOptions } from "@mui/material";
import CustomAutocomplete from "./CustomAutocomplete";

// Styled MUI input
const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: "0",
    height: "32px",
  },
  "& input": {
    height: "100%",
    boxSizing: "border-box",
  },
}));

const NewDropdownsDialog = ({
  open,
  onClose,
  row,
  selectedMaidId,
  maidList,
  handleMaidNameChange,
  handleSaveMaid,
  hubSelection,
  handleHubNameChange,
  hubsDropdown,
  errors,
  currentStatus,
  handleStatusChange,
  handleSave,
  statusOptions,
  setStartDate,
  startDate,
  handleReSechuleDateChange,
  HubList,
  selectedHubId,
  showDatePicker,
  setShowDatePicker,
  parentBookingPartner,
  setParentBookingPartner,
  handleParentBookingPartnerChange,
  selectedPreferredMaidId,
  secondaryPartnerMap,
  handleSecondaryPartnerChange,
  selectedSecondaryPartnerId,
  handleRemoveSecondaryPartner,
  showSecondaryMaidSection,
  handleToggleSecondaryMaid,
  maidOperationLoading,
}) => {
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    startDate?.rescheduleDate || ""
  );

  const date = formatDateTime(row.bookingScheduledAt);

  // Map maidList to include mobile number in the name
  const maidListWithNumber = maidList.map((maid) => ({
    ...maid,
    name: maid.mobile_number ? `${maid.name} - ${maid.mobile_number}` : maid.name,
  }));

  const initialMaid =
    maidListWithNumber.find((maid) => maid.id === selectedMaidId) ||
    (row.partnerName ? { id: null, name: row.partnerName } : null);

  const preferredMaidValue =
    maidListWithNumber.find((maid) => maid.id === selectedPreferredMaidId) || null;

  // Handle secondary worker value logic - prioritize the map state over row data
  const effectiveSecondaryPartnerId = 
    selectedSecondaryPartnerId !== undefined 
      ? selectedSecondaryPartnerId 
      : row?.secondaryPartnerId;

  const secondaryMaidValue =
    effectiveSecondaryPartnerId && effectiveSecondaryPartnerId !== null
      ? maidListWithNumber.find((maid) => maid.id === effectiveSecondaryPartnerId) ||
        (row.secondaryPartnerName && effectiveSecondaryPartnerId === row.secondaryPartnerId 
          ? { id: row.secondaryPartnerId, name: row.secondaryPartnerName } 
          : null)
      : null;

  console.log("Selected Worker ID:", initialMaid);
 
  // Check if secondary worker section should be shown
  const shouldShowSecondarySection = showSecondaryMaidSection[row?.bookingId] || 
    effectiveSecondaryPartnerId || 
    row?.secondaryPartnerName;

  // Loading states for different operations
  const primaryMaidLoading = maidOperationLoading[`primary_${row?.bookingId}`] || false;
  const secondaryMaidLoading = maidOperationLoading[`secondary_${row?.bookingId}`] || false;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          position: "fixed",
          right: 0,
          top: 0,
          m: 0,
          height: "100vh",
          width: 400,
          maxHeight: "100vh",
          borderRadius: 0,
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Actions</Typography>
        <IconButton onClick={onClose}>
          <Cancel />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          px: 1.5,
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {row?.bookingType === "RECURRING" && Boolean(row?.parentBookingId) && (
          <Box>
            <InputLabel shrink sx={{ fontSize: 16, fontWeight: 600 }}>
              Select Prefer worker
            </InputLabel>
            <CustomAutocomplete
              options={maidListWithNumber}
              value={preferredMaidValue?.id}
              onChange={(maid) =>
                handleParentBookingPartnerChange(row.parentBookingId, maid.id)
              }
              placeholder={row?.partnerName || "Select Preferred Worker"}
            />
          </Box>
        )}

        {/* Worker Dropdown */}
        <Box>
          <InputLabel shrink sx={{ fontSize: 16, fontWeight: 600 }}>
            Select Primary Worker
          </InputLabel>
          <CustomAutocomplete
            options={maidListWithNumber}
            value={initialMaid?.id || row?.partnerName}
            onChange={(maid) => handleMaidNameChange(row.bookingId, maid.id)}
            placeholder={row?.partnerName || "Select Primary Worker"}
            isLoading={primaryMaidLoading}
          />
        </Box>

        {/* Add Secondary Worker Button */}
        {!shouldShowSecondarySection && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => handleToggleSecondaryMaid(row.bookingId)}
              disabled={primaryMaidLoading}
              sx={{
                textTransform: 'none',
                borderColor: '#00b664',
                color: '#00b664',
                '&:hover': {
                  borderColor: '#00a055',
                  backgroundColor: 'rgba(0, 182, 100, 0.04)',
                },
                '&:disabled': {
                  borderColor: '#ccc',
                  color: '#ccc',
                },
              }}
            >
              Add Secondary Worker
            </Button>
          </Box>
        )}

        {/* Secondary Worker Dropdown */}
        {shouldShowSecondarySection && (
          <Box>
            <InputLabel shrink sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>
              Select Secondary Worker
            </InputLabel>
                         <CustomAutocomplete
               options={maidListWithNumber}
               value={effectiveSecondaryPartnerId && effectiveSecondaryPartnerId !== null ? effectiveSecondaryPartnerId : ""}
               onChange={(maid) => handleSecondaryPartnerChange(row.bookingId, maid.id)}
               placeholder={
                 effectiveSecondaryPartnerId && effectiveSecondaryPartnerId !== null && row?.secondaryPartnerName
                   ? row.secondaryPartnerName
                   : "Select Secondary Worker"
               }
               showRemoveButton={effectiveSecondaryPartnerId || row?.secondaryPartnerName}
               onRemove={() => handleRemoveSecondaryPartner(row.bookingId)}
               isLoading={secondaryMaidLoading}
             />
          </Box>
        )}

        {/* Hub Dropdown */}
        <Box>
          <InputLabel shrink sx={{ fontSize: 16, fontWeight: 600 }}>
            Select Hub
          </InputLabel>
          <FormControl fullWidth size="small" error={!!errors?.hub}>
            <Select
              value={hubSelection[row.bookingId] || ""}
              onChange={(e) => handleHubNameChange(e, row.bookingId)}
              displayEmpty
              sx={{
                fontWeight: 300,
                fontSize: "13px",
                borderRadius: 1,
                "& .MuiSelect-select": { padding: "6px 12px" },
              }}
              renderValue={(selected) => {
                if (!selected) return row?.hubName || "Select Hub";
                const selectedHub = HubList.find((hub) => hub.id === selected);
                return selectedHub?.address || row?.hubName;
              }}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem value="" disabled>
                Select Hub
              </MenuItem>
              {HubList?.map((hub) => (
                <MenuItem key={hub.id} value={hub.id}>
                  {hub.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Status Dropdown */}
        <Box>
          <InputLabel shrink sx={{ fontSize: 16, fontWeight: 600 }}>
            Status
          </InputLabel>
          <FormControl fullWidth size="small">
            <Select
              value={currentStatus}
              onChange={(e) =>
                handleStatusChange(row.bookingId, e.target.value)
              }
              displayEmpty
              sx={{
                fontWeight: 300,
                fontSize: "13px",
                borderRadius: 1,
                "& .MuiSelect-select": { padding: "6px 12px" },
              }}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem value="" disabled>
                Select Status
              </MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option.key} value={option.key}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Reschedule Date Picker */}
        <Box>
          <InputLabel shrink sx={{ fontSize: 16, fontWeight: 600 }}>
            Reschedule Date
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            value={date || selectedDate?.toLocaleString() || " Reschedule Date"}
            onClick={() =>
              setShowDatePicker({
                bookingId: row.bookingId,
                isShowDatePicker: true,
              })
            }
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarToday />
                  </InputAdornment>
                ),
              },
            }}
            InputProps={{ readOnly: true }}
          />
          {Boolean(showDatePicker?.bookingId) && (
            <NewCustomDatePicker
              selected={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
                handleReSechuleDateChange(date, row.bookingId);
              }}
              onClose={() => {
                setShowDatePicker({
                  bookingId: null,
                  isShowDatePicker: false,
                });
              }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewDropdownsDialog;
