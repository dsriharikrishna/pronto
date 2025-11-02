import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Stack, TextField, Select, MenuItem, FormControl, InputLabel, Pagination, CircularProgress
} from '@mui/material';
import { Add, Edit, Cancel, CheckCircle, Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchShifts, createNewShift, updateExistingShift, endExistingShift, cancelExistingShift, fetchShiftById, setFilters, setPagination, clearSelectedShift
} from '../../redux/slicers/shiftSlice';
import { format } from 'date-fns';
import { fetchAllPartners, fetchHubsDataForPartners } from '../../redux/slicers/partnerSlice';
import CustomAutocomplete from "../new orders/CustomAutocomplete";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

function getSlotBoundaries() {
  // Returns array of { value: '00:00', label: '12:00 AM' } ...
  const slots = [
    { value: '00:00', label: '12:00 AM' },
    { value: '04:00', label: '4:00 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '20:00', label: '8:00 PM' },
  ];
  return slots;
}

function getEndTimeOptions(startIdx) {
  // Returns valid end time options (4, 8, 12 hours after start)
  // Handles next day rotation
  const slots = getSlotBoundaries();
  const options = [];
  for (let i = 1; i <= 3; ++i) {
    let endIdx = (startIdx + i) % slots.length;
    let nextDay = startIdx + i >= slots.length;
    options.push({
      value: slots[endIdx].value,
      label: slots[endIdx].label + (nextDay ? ' (next day)' : ''),
      nextDay,
    });
  }
  return options;
}

// Helper to convert a date to IST
function toIST(date) {
  if (!date) return null;
  const d = new Date(date);
  // IST is UTC+5:30
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  return new Date(utc + (5.5 * 60 * 60 * 1000));
}

function getTodayIST() {
  const now = new Date();
  // Add 5.5 hours (19800000 ms)
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

function minus5_5Hours(date) {
  if (!date) return null;
  return new Date(new Date(date).getTime() - 5.5 * 60 * 60 * 1000);
}

function getNowIST() {
  // Get current UTC time, add 5.5 hours, return as Date object
  const nowUTC = new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000));
  return new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));
}

// Returns the suggested date and startIdx for the closest slot in the future (in IST)
function getSuggestedSlotForNowIST(slotBoundaries) {
  const nowIST = getNowIST();
  const todayDateStr = getTodayIST();
  let suggestedDate = todayDateStr;
  let suggestedStartIdx = 0;
  for (let i = 0; i < slotBoundaries.length; i++) {
    const slotTime = slotBoundaries[i].value;
    const slotDateTime = new Date(`${todayDateStr}T${slotTime}:00+05:30`);
    if (slotDateTime > nowIST) {
      suggestedStartIdx = i;
      return { suggestedDate, suggestedStartIdx };
    }
    if (i === slotBoundaries.length - 1) {
      // All slots for today have passed, suggest first slot of next day
      suggestedDate = new Date(nowIST.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      suggestedStartIdx = 0;
      return { suggestedDate, suggestedStartIdx };
    }
  }
  return { suggestedDate, suggestedStartIdx };
}

function ShiftFormDialog({ open, onClose, onSubmit, initialData, partners, hubs, isEdit, loading, lockedPartner }) {
  const todayStr = getTodayIST();
  const [date, setDate] = useState(todayStr);
  const slotBoundaries = getSlotBoundaries();
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(1);
  const [endNextDay, setEndNextDay] = useState(false);
  const [form, setForm] = useState(() => {
    // If initialData (edit), use it. Otherwise, if lockedPartner has hub_id, preselect it.
    if (initialData && (initialData.data || initialData.hub_id)) {
      const data = initialData.data || initialData;
      return {
        partner_id: data.partner_id || lockedPartner?.id || '',
        hub_id: data.hub_id || lockedPartner?.hub_id || '',
        scheduled_start: data.scheduled_start || '',
        scheduled_end: data.scheduled_end || '',
      };
    }
    return {
      partner_id: lockedPartner?.id || '',
      hub_id: lockedPartner?.hub_id || '',
      scheduled_start: '',
      scheduled_end: '',
    };
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    // On open or initialData, set form and slot indices
    const data = initialData && initialData.data ? initialData.data : initialData;
    if (data && isEdit) {
      // Parse start/end times and date using IST
      const startIST = toIST(data.scheduled_start);
      const endIST = toIST(data.scheduled_end);
      const pad = (n) => n.toString().padStart(2, '0');
      const startTime = `${pad(startIST.getHours())}:${pad(startIST.getMinutes())}`;
      const endTime = `${pad(endIST.getHours())}:${pad(endIST.getMinutes())}`;
      const startDate = `${startIST.getFullYear()}-${pad(startIST.getMonth() + 1)}-${pad(startIST.getDate())}`;
      const endDate = `${endIST.getFullYear()}-${pad(endIST.getMonth() + 1)}-${pad(endIST.getDate())}`;
      const sIdx = slotBoundaries.findIndex(s => s.value === startTime);
      let eIdx = slotBoundaries.findIndex(s => s.value === endTime);
      let nextDay = false;
      // Fallback if slot not found
      const safeSIdx = sIdx >= 0 ? sIdx : 0;
      const safeEIdx = eIdx >= 0 ? eIdx : (safeSIdx + 1) % slotBoundaries.length;
      if (safeEIdx <= safeSIdx) {
        nextDay = true;
      }
      setDate(startDate);
      setStartIdx(safeSIdx);
      setEndIdx(safeEIdx);
      setEndNextDay(nextDay);
      setForm({
        partner_id: data.partner_id || lockedPartner?.id || '',
        hub_id: data.hub_id || lockedPartner?.hub_id || '',
        scheduled_start: data.scheduled_start,
        scheduled_end: data.scheduled_end,
      });
    } else if (!isEdit) {
      // Suggest the closest slot in the future (in IST)
      const { suggestedDate, suggestedStartIdx } = getSuggestedSlotForNowIST(slotBoundaries);
      setDate(suggestedDate);
      setStartIdx(suggestedStartIdx);
      setEndIdx((suggestedStartIdx + 1) % slotBoundaries.length);
      setEndNextDay(false);
      setForm({
        partner_id: lockedPartner?.id || '',
        hub_id: lockedPartner?.hub_id || '',
        scheduled_start: '',
        scheduled_end: '',
      });
    }
    // eslint-disable-next-line
  }, [initialData, open, isEdit, lockedPartner]);

  // When startIdx or date changes, reset endIdx to first valid
  useEffect(() => {
    setEndIdx((startIdx + 1) % slotBoundaries.length);
    setEndNextDay(false);
  }, [startIdx, date]);

  const endTimeOptions = getEndTimeOptions(startIdx);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePartnerChange = (option) => {
    setForm({ ...form, partner_id: option?.id || '' });
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleStartChange = (e) => {
    const idx = Number(e.target.value);
    setStartIdx(idx);
  };

  const handleEndChange = (e) => {
    const idx = Number(e.target.value);
    setEndIdx(idx);
    setEndNextDay(idx <= startIdx);
  };

  const handleSubmit = () => {
    // Build ISO strings for scheduled_start and scheduled_end in IST, then convert to UTC
    const startTime = slotBoundaries[startIdx].value;
    const endTime = slotBoundaries[endIdx].value;
    const startISO = `${date}T${startTime}:00+05:30`;
    let endDate = date;
    if (endNextDay || endIdx <= startIdx) {
      // End is next day
      const d = new Date(date);
      d.setDate(d.getDate() + 1);
      endDate = d.toISOString().slice(0, 10);
    }
    const endISO = `${endDate}T${endTime}:00+05:30`;
    // Convert to UTC ISO string
    const startUTC = new Date(startISO).toISOString();
    const endUTC = new Date(endISO).toISOString();
    // Validation: scheduled_end should not be in the past (in UTC)
    if (new Date(endUTC) < new Date()) {
      setErrorMsg('Scheduled end time cannot be in the past.');
      setErrorOpen(true);
      return;
    }
    onSubmit({ ...form, scheduled_start: startUTC, scheduled_end: endUTC });
  };

  const handleErrorClose = () => setErrorOpen(false);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Shift' : 'Create Shift'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {lockedPartner ? (
            <TextField
              label="Worker"
              value={lockedPartner.name}
              fullWidth
              size="small"
              disabled
            />
          ) : !isEdit ? (
            <CustomAutocomplete
              options={partners}
              value={form.partner_id}
              onChange={handlePartnerChange}
              placeholder="Select Worker"
            />
          ) : (
            <TextField
              label="Worker"
              value={partners.find((p) => p.id === form.partner_id)?.name || ''}
              fullWidth
              size="small"
              disabled
            />
          )}
          <FormControl fullWidth size="small">
            <InputLabel>Hub</InputLabel>
            <Select
              name="hub_id"
              value={form.hub_id}
              onChange={handleChange}
              label="Hub"
            >
              {hubs.map((h) => (
                <MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="date"
            label="Date"
            type="date"
            size="small"
            value={date}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <FormControl fullWidth size="small">
            <InputLabel>Start Time</InputLabel>
            <Select
              name="start"
              value={startIdx}
              onChange={handleStartChange}
              label="Start Time"
            >
              {slotBoundaries.map((slot, idx) => (
                <MenuItem key={slot.value} value={idx}>{slot.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>End Time</InputLabel>
            <Select
              name="end"
              value={endIdx}
              onChange={handleEndChange}
              label="End Time"
            >
              {endTimeOptions.map((opt, i) => (
                <MenuItem key={opt.value} value={(startIdx + i + 1) % slotBoundaries.length}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : (isEdit ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
      {/* Error Snackbar */}
      <Snackbar open={errorOpen} autoHideDuration={4000} onClose={handleErrorClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </MuiAlert>
      </Snackbar>
    </Dialog>
  );
}

function ShiftManagement() {
  const dispatch = useDispatch();
  const shifts = useSelector((state) => state.shifts.shifts);
  const total = useSelector((state) => state.shifts.total);
  const loading = useSelector((state) => state.shifts.loading);
  const error = useSelector((state) => state.shifts.error);
  const pagination = useSelector((state) => state.shifts.pagination);
  const selectedShift = useSelector((state) => state.shifts.selectedShift);
  const partners = useSelector((state) => state.partners.allPartners) || [];
  const hubs = useSelector((state) => state.partners.partnersHubsData) || [];
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', shift: null });
  const [formLoading, setFormLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    if (!partners || partners.length === 0) {
      dispatch(fetchAllPartners());
    }
    if (!hubs || hubs.length === 0) {
      dispatch(fetchHubsDataForPartners());
    }
  }, [dispatch]);

  // Fetch shifts for selected partner
  useEffect(() => {
    if (selectedPartner) {
      dispatch(fetchShifts({ partner_id: selectedPartner.id, page: pagination.page, limit: pagination.limit }));
    }
  }, [dispatch, selectedPartner, pagination.page, pagination.limit]);

  useEffect(() => {
    if (error) {
      setSnackbarMsg(error);
      setSnackbarOpen(true);
    }
  }, [error]);

  const openCreateForm = () => {
    setEditMode(false);
    setFormOpen(true);
  };
  const openEditForm = (shift) => {
    dispatch(fetchShiftById(shift.id));
    setEditMode(true);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setTimeout(() => dispatch(clearSelectedShift()), 300);
  };
  const handleFormSubmit = async (form) => {
    setFormLoading(true);
    try {
      let editId = null;
      if (editMode && selectedShift) {
        if (selectedShift.data && selectedShift.data.id) {
          editId = selectedShift.data.id;
        } else if (selectedShift.id) {
          editId = selectedShift.id;
        }
      }
      if (editMode && selectedShift) {
        await dispatch(updateExistingShift({ id: editId, data: form })).unwrap();
      } else {
        await dispatch(createNewShift(form)).unwrap();
      }
      setFormOpen(false);
      dispatch(fetchShifts({ partner_id: selectedPartner.id, page: pagination.page, limit: pagination.limit }));
    } catch (err) {
      // handle error (snackbar, etc)
    } finally {
      setFormLoading(false);
    }
  };

  const openConfirmDialog = (type, shift) => setConfirmDialog({ open: true, type, shift });
  const closeConfirmDialog = () => setConfirmDialog({ open: false, type: '', shift: null });
  const handleConfirm = async () => {
    if (!confirmDialog.shift) return;
    try {
      if (confirmDialog.type === 'end') {
        // If ending the current active shift, set scheduled_end to now
        let data = { end_actor_type: 'ADMIN' };
        if (
          currentShift &&
          confirmDialog.shift.id === currentShift.id &&
          (currentShift.status === 'active' || currentShift.originalStatus === 'scheduled')
        ) {
          data.scheduled_end = new Date().toISOString();
        }
        await dispatch(endExistingShift({ id: confirmDialog.shift.id, data })).unwrap();
      } else if (confirmDialog.type === 'cancel') {
        await dispatch(cancelExistingShift({ id: confirmDialog.shift.id, data: { updated_actor_type: 'ADMIN' } })).unwrap();
      }
      dispatch(fetchShifts({ partner_id: selectedPartner.id, page: pagination.page, limit: pagination.limit }));
    } finally {
      closeConfirmDialog();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePartnerSelect = (option) => {
    setSelectedPartner(option);
    dispatch(setPagination({ page: 1 }));
  };

  const handleClearPartner = () => {
    setSelectedPartner(null);
    dispatch(clearSelectedShift());
  };

  // Only show Create Shift if no scheduled or active shift exists for the partner
  const hasScheduledOrActive = Array.isArray(shifts) && shifts.some(
    (shift) => shift.status === 'scheduled' || shift.status === 'active'
  );

  // Filter hubs for the selected partner
  const mappedHubs = selectedPartner && selectedPartner.hub_id
    ? hubs.filter(hub => hub.id === selectedPartner.hub_id)
    : [];

  // Enhanced: Treat scheduled shift as active if now is between scheduled_start and scheduled_end
  let currentShift = null;
  let currentShiftHeader = '';
  if (Array.isArray(shifts)) {
    const now = new Date();
    // Find a real active shift
    currentShift = shifts.find(shift => shift.status === 'active');
    if (currentShift) {
      currentShiftHeader = 'Current Active Shift';
    } else {
      // Find a scheduled shift that is currently ongoing (compare in UTC)
      const scheduledNow = shifts.find(shift => {
        if (shift.status !== 'scheduled') return false;
        const nowUTC = new Date();
        const startUTC = new Date(shift.scheduled_start);
        const endUTC = new Date(shift.scheduled_end);
        console.log('DEBUG scheduledNow:', {
          nowUTC: nowUTC.toISOString(),
          startUTC: startUTC?.toISOString(),
          endUTC: endUTC?.toISOString(),
          scheduled_start: shift.scheduled_start,
          scheduled_end: shift.scheduled_end
        });
        return nowUTC >= startUTC && nowUTC < endUTC;
      });
      if (scheduledNow) {
        // Treat as active for UI, but preserve original status
        currentShift = { ...scheduledNow, status: 'active', originalStatus: 'scheduled' };
        currentShiftHeader = 'Current Active Shift';
      } else {
        // Otherwise, just show the next scheduled shift
        const scheduled = shifts.find(shift => shift.status === 'scheduled');
        if (scheduled) {
          currentShift = scheduled;
          currentShiftHeader = 'Current Scheduled Shift';
        }
      }
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Shift Management</Typography>
      {!selectedPartner ? (
        <Box sx={{ maxWidth: 400 }}>
          <CustomAutocomplete
            options={partners}
            value={null}
            onChange={handlePartnerSelect}
            placeholder="Search and select a worker"
          />
        </Box>
      ) : (
        <>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Typography variant="h6">Worker: {selectedPartner.name}</Typography>
            <Button onClick={handleClearPartner} startIcon={<Close />}>Clear Selection</Button>
            <Box flex={1} />
            {!hasScheduledOrActive && (
              <Button variant="contained" startIcon={<Add />} onClick={openCreateForm}>
                Create Shift
              </Button>
            )}
          </Stack>

          {/* Current Active/Scheduled Shift Table */}
          {currentShift && (
            <Paper sx={{ mb: 3, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  p: 2,
                  color: currentShift.status === 'active' ? '#fff' : '#ff9800',
                  background: currentShift.status === 'active' ? '#1976d2' : '#fff3e0',
                  fontWeight: 600,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                {currentShiftHeader}
              </Typography>
              <TableContainer sx={{ border: '1.5px solid #B0B0B0', borderRadius: 2 }}>
                <Table sx={{ border: '1.5px solid #B0B0B0' }}>
                  <TableHead sx={{ borderBottom: '1.5px solid #B0B0B0', background: '#f5f7fa' }}>
                    <TableRow>
                      <TableCell sx={{ width: 160 }}>Hub</TableCell>
                      <TableCell sx={{ width: 180 }}>Scheduled Start</TableCell>
                      <TableCell sx={{ width: 180 }}>Scheduled End</TableCell>
                      <TableCell sx={{ width: 180 }}>Actual End Time</TableCell>
                      <TableCell sx={{ width: 120 }}>Status</TableCell>
                      <TableCell sx={{ width: 220 }}>Created/Updated</TableCell>
                      <TableCell sx={{ width: 120 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      key={currentShift.id}
                      sx={{ '&:hover': { background: '#f0f4ff' } }}
                    >
                      <TableCell sx={{ width: 160 }}>{hubs.find(h => h.id === currentShift.hub_id)?.name || currentShift.hub_id}</TableCell>
                      <TableCell sx={{ width: 180 }}>
                        {currentShift.scheduled_start ? format(toIST(currentShift.scheduled_start), 'yyyy-MM-dd hh:mm a') : ''}
                      </TableCell>
                      <TableCell sx={{ width: 180 }}>
                        {currentShift.scheduled_end ? format(toIST(currentShift.scheduled_end), 'yyyy-MM-dd hh:mm a') : ''}
                      </TableCell>
                      <TableCell sx={{ width: 180 }}>{currentShift.actual_end ? format(toIST(currentShift.actual_end), 'yyyy-MM-dd hh:mm a') : '-'}</TableCell>
                      <TableCell sx={{ width: 120 }}>
                        <Chip label={currentShift.status} color={
                          currentShift.status === 'scheduled' ? 'primary' :
                          currentShift.status === 'ended' ? 'success' :
                          currentShift.status === 'cancelled' ? 'error' : 'default'
                        } />
                      </TableCell>
                      <TableCell sx={{ width: 220 }}>
                        <Stack spacing={0.5}>
                          <Typography variant="caption">Created: {currentShift.created_at ? format(toIST(currentShift.created_at), 'yyyy-MM-dd hh:mm a') : ''} ({currentShift.created_actor_type})</Typography>
                          <Typography variant="caption">Updated: {currentShift.updated_at ? format(toIST(currentShift.updated_at), 'yyyy-MM-dd hh:mm a') : ''} ({currentShift.updated_actor_type})</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ width: 120 }}>
                        <Stack direction="row" spacing={1}>
                          <span style={{ display: 'inline-flex', pointerEvents: 'auto' }}>
                            <IconButton size="small" onClick={() => openEditForm(currentShift)} disabled={currentShift.originalStatus ? currentShift.originalStatus !== 'scheduled' : currentShift.status !== 'scheduled'}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </span>
                          <Tooltip title="End Shift">
                            <span style={{ display: 'inline-flex', pointerEvents: 'auto' }}>
                              <IconButton
                                size="small"
                                onClick={() => openConfirmDialog('end', currentShift)}
                                disabled={currentShift.originalStatus ? currentShift.originalStatus !== 'scheduled' : currentShift.status !== 'scheduled'}
                                sx={{
                                  backgroundColor: currentShift.status === 'scheduled' ? '#e8f5e9' : undefined,
                                  '&:hover': { backgroundColor: currentShift.status === 'scheduled' ? '#c8e6c9' : undefined },
                                  color: '#388e3c',
                                  opacity: currentShift.status === 'scheduled' ? 1 : 0.5,
                                }}
                              >
                                <CheckCircle fontSize="small" sx={{ color: '#388e3c' }} />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Cancel Shift">
                            <span style={{ display: 'inline-flex', pointerEvents: 'auto' }}>
                              <IconButton
                                size="small"
                                onClick={() => openConfirmDialog('cancel', currentShift)}
                                disabled={currentShift.originalStatus ? currentShift.originalStatus !== 'scheduled' : currentShift.status !== 'scheduled'}
                                sx={{
                                  backgroundColor: currentShift.status === 'scheduled' ? '#ffebee' : undefined,
                                  '&:hover': { backgroundColor: currentShift.status === 'scheduled' ? '#ffcdd2' : undefined },
                                  color: '#d32f2f',
                                  opacity: currentShift.status === 'scheduled' ? 1 : 0.5,
                                }}
                              >
                                <Cancel fontSize="small" sx={{ color: '#d32f2f' }} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Main Shift Table: Past Shifts */}
          <Paper>
            <Typography
              variant="subtitle1"
              sx={{
                p: 2,
                color: '#333',
                background: '#e3e6ea',
                fontWeight: 600,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              Past Shifts
            </Typography>
            <TableContainer sx={{ border: '1.5px solid #B0B0B0', borderRadius: 2 }}>
              <Table sx={{ border: '1.5px solid #B0B0B0' }}>
                <TableHead sx={{ borderBottom: '1.5px solid #B0B0B0', background: '#f5f7fa' }}>
                  <TableRow>
                    <TableCell sx={{ width: 160 }}>Hub</TableCell>
                    <TableCell sx={{ width: 180 }}>Scheduled Start</TableCell>
                    <TableCell sx={{ width: 180 }}>Scheduled End</TableCell>
                    <TableCell sx={{ width: 180 }}>Actual End Time</TableCell>
                    <TableCell sx={{ width: 120 }}>Status</TableCell>
                    <TableCell sx={{ width: 220 }}>Created/Updated</TableCell>
                    <TableCell sx={{ width: 120 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
                  ) : !Array.isArray(shifts) || shifts.filter(shift => shift.status === 'ended' || shift.status === 'cancelled').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No past shifts found.
                      </TableCell>
                    </TableRow>
                  ) : shifts.filter(shift => shift.status === 'ended' || shift.status === 'cancelled').map((shift) => (
                    <TableRow
                      key={shift.id}
                      sx={{ '&:hover': { background: '#f0f4ff' } }}
                    >
                      <TableCell sx={{ width: 160 }}>{hubs.find(h => h.id === shift.hub_id)?.name || shift.hub_id}</TableCell>
                      <TableCell sx={{ width: 180 }}>
                        {shift.scheduled_start ? format(toIST(shift.scheduled_start), 'yyyy-MM-dd hh:mm a') : ''}
                      </TableCell>
                      <TableCell sx={{ width: 180 }}>
                        {shift.scheduled_end ? format(toIST(shift.scheduled_end), 'yyyy-MM-dd hh:mm a') : ''}
                      </TableCell>
                      <TableCell sx={{ width: 180 }}>{shift.actual_end ? format(toIST(shift.actual_end), 'yyyy-MM-dd hh:mm a') : '-'}</TableCell>
                      <TableCell sx={{ width: 120 }}>
                        <Chip label={shift.status} color={
                          shift.status === 'scheduled' ? 'primary' :
                          shift.status === 'ended' ? 'success' :
                          shift.status === 'cancelled' ? 'error' : 'default'
                        } />
                      </TableCell>
                      <TableCell sx={{ width: 220 }}>
                        <Stack spacing={0.5}>
                          <Typography variant="caption">Created: {shift.created_at ? format(toIST(shift.created_at), 'yyyy-MM-dd hh:mm a') : ''} ({shift.created_actor_type})</Typography>
                          <Typography variant="caption">Updated: {shift.updated_at ? format(toIST(shift.updated_at), 'yyyy-MM-dd hh:mm a') : ''} ({shift.updated_actor_type})</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ width: 120 }}>
                        <Stack direction="row" spacing={1}>
                          <span style={{ display: 'inline-flex', pointerEvents: 'auto' }}>
                            <IconButton size="small" onClick={() => openEditForm(shift)} disabled={shift.status === 'ended' || shift.status === 'cancelled'}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </span>
                          <Tooltip title="End Shift">
                            <span style={{ display: 'inline-flex', pointerEvents: 'auto' }}>
                              <IconButton
                                size="small"
                                onClick={() => openConfirmDialog('end', shift)}
                                disabled={shift.status !== 'scheduled'}
                                sx={{
                                  backgroundColor: shift.status === 'scheduled' ? '#e8f5e9' : undefined,
                                  '&:hover': { backgroundColor: shift.status === 'scheduled' ? '#c8e6c9' : undefined },
                                  color: '#388e3c',
                                  opacity: shift.status === 'scheduled' ? 1 : 0.5,
                                }}
                              >
                                <CheckCircle fontSize="small" sx={{ color: '#388e3c' }} />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Cancel Shift">
                            <span style={{ display: 'inline-flex', pointerEvents: 'auto' }}>
                              <IconButton
                                size="small"
                                onClick={() => openConfirmDialog('cancel', shift)}
                                disabled={shift.status !== 'scheduled'}
                                sx={{
                                  backgroundColor: shift.status === 'scheduled' ? '#ffebee' : undefined,
                                  '&:hover': { backgroundColor: shift.status === 'scheduled' ? '#ffcdd2' : undefined },
                                  color: '#d32f2f',
                                  opacity: shift.status === 'scheduled' ? 1 : 0.5,
                                }}
                              >
                                <Cancel fontSize="small" sx={{ color: '#d32f2f' }} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2} display="flex" justifyContent="flex-end">
              <Pagination
                count={Math.ceil(total / (pagination.limit || 20))}
                page={pagination.page}
                onChange={(e, page) => dispatch(setPagination({ page }))}
                color="primary"
              />
            </Box>
          </Paper>
          {/* Create/Edit Shift Dialog */}
          <ShiftFormDialog
            open={formOpen}
            onClose={closeForm}
            onSubmit={handleFormSubmit}
            initialData={editMode ? selectedShift : null}
            partners={partners}
            hubs={mappedHubs}
            isEdit={editMode}
            loading={formLoading}
            lockedPartner={selectedPartner}
          />
          {/* End/Cancel Confirmation Dialog */}
          <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
            <DialogTitle>{confirmDialog.type === 'end' ? 'End Shift' : 'Cancel Shift'}</DialogTitle>
        <DialogContent>
              <Typography>Are you sure you want to {confirmDialog.type} this shift?</Typography>
        </DialogContent>
            <DialogActions>
              <Button onClick={closeConfirmDialog}>No</Button>
              <Button onClick={handleConfirm} color="primary" variant="contained">Yes</Button>
        </DialogActions>
      </Dialog>
    </>
      )}
      {/* Snackbar for error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default ShiftManagement; 