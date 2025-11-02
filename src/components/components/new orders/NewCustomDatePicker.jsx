import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Stack, styled } from "@mui/system";

const CustomDatePickerWrapper = styled(Box)({
  padding: "6px 10px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "max-content",
});

const NewCustomDatePicker = ({ onDateChange, onClose, selected }) => {
  const [selectedDate, setSelectedDate] = useState(selected || new Date());

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    onDateChange(selectedDate); // Send raw Date object
    onClose();
  };

  return (
    <CustomDatePickerWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 1,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
          Change Scheduled Date/Time
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" color="error" />
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
        inline
      />

      <Stack alignItems={"flex-end"} width={"100%"}>
        <Button
          onClick={handleSubmit}
          sx={{
            mt: 1,
            bgcolor: "#00b664",
            color: "white",
            "&:hover": { bgcolor: "#009954" },
            textTransform: "capitalize",
            px: 4,
          }}
        >
          Submit
        </Button>
      </Stack>
    </CustomDatePickerWrapper>
  );
};

export default NewCustomDatePicker;
