import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Stack, styled } from '@mui/system';

const CustomDatePickerWrapper = styled(Box)({
  padding: '6px 10px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: "max-content",
});

const CustomDatePicker = ({ onDateChange, onClose, setIsDateSelected }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTime, setNewTime] = useState("");

  // Helper function to check if two dates are the same day
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Helper function to format time string (if needed)
  const formatTimeString = (date) => {
    return date.toISOString();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedTimeString = formatTimeString(date);
    setNewTime(formattedTimeString);
  };

  const handleSubmit = () => {
    console.log("Selected Date:", selectedDate);
   // setIsDateSelected(selectedDate)
    onDateChange(selectedDate);
    onClose();
  };

  return (
    <CustomDatePickerWrapper>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        mb: 1
      }}>
        <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
          Change Scheduled Date/Time
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" color='error' />
        </IconButton>
      </Box>
      <DatePicker
        showIcon
        showTimeSelect
        timeIntervals={15}
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MMMM d, yyyy h:mm aa"
        open={true}
        minDate={new Date()}
        minTime={
          isSameDay(selectedDate, new Date())
            ? new Date()
            : new Date(new Date().setHours(0, 0, 0, 0))
        }
        maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
        className="custom-datepicker-input"
        popperClassName="custom-datepicker-popper"
        inline
      />
      <Stack alignItems={'flex-end'} width={'100%'}>
        <Button
          onClick={handleSubmit}
          sx={{
            mt: 1,
            bgcolor: '#00b664',
            color: 'white',
            '&:hover': { bgcolor: '#009954' },
            textTransform: 'capitalize',
            px: 4,
          }}
        >
          Submit
        </Button>
      </Stack>
    </CustomDatePickerWrapper>
  );
};

export default CustomDatePicker;
