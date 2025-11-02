import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

/**
 * Date/time picker component that ensures proper date and time handling
 * @param {Object} props - Component props
 * @param {dayjs.Dayjs} props.value - The current date/time value
 * @param {Function} props.onChange - Callback when date/time changes (receives dayjs object)
 */
const SingleStartDatePicker = ({ value, onChange }) => {
  const handleDateTimeChange = (newValue) => {
    if (newValue && dayjs.isDayjs(newValue)) {
      // Ensure we have both date and time components
      const dateWithTime = newValue.hour() || 0;
      const timeWithDate = newValue.minute() || 0;
      onChange(newValue
        .hour(dateWithTime)
        .minute(timeWithDate)
        .second(0)
        .millisecond(0));
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Select Date & Time"
        value={value}
        onChange={handleDateTimeChange}
        minutesStep={15}
        disablePast
        PopperProps={{
          placement: 'top-start',
          modifiers: [{
            name: 'preventOverflow',
            options: {
              altBoundary: true,
              tether: false,
            },
          }],
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            sx: { minWidth: 250 }
          }
        }}
      />
    </LocalizationProvider>
  );
};
SingleStartDatePicker.propTypes = {
  value: PropTypes.instanceOf(dayjs).isRequired,
  onChange: PropTypes.func.isRequired
};


export default SingleStartDatePicker;
