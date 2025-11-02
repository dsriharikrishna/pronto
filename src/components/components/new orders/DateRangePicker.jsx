// import React, { useState } from "react";
// import { Box, Stack, TextField, Typography } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { format, isValid } from "date-fns";
// import { ShowToast } from "../ToastAndSnacks/ShowToast";

// const StyledInput = styled(TextField)(() => ({
//   "& .MuiInputBase-root": {
//     backgroundColor: "#fff",
//     borderRadius: 4,
//     height: "32px",
//     fontSize: "0.75rem",
//   },
//   "& input": {
//     padding: "4px 8px",
//   },
// }));

// const DateRangePicker = ({ dateRange, setDateRange, activeTab }) => {
//   const [error, setError] = useState("");

//   const handleChange = (key) => (e) => {
//     const value = e.target.value;
//     const now = new Date();
//     const newRange = { ...dateRange };

//     if (value) {
//       const [year, month, day] = value.split("-").map(Number);
//       const localDate = new Date(year, month - 1, day);

//       if (!isValid(localDate)) {
//         const err = "Invalid date format. Use YYYY-MM-DD.";
//         setError(err);
//         ShowToast("error", err);
//         return;
//       }

//       if (key === "start") {
//         localDate.setHours(0, 0, 0, 0);
//       } else if (key === "end") {
//         localDate.setHours(23, 59, 59, 999);
//       }

//       newRange[key] = localDate;
//     } else {
//       newRange[key] = null;
//     }

//     // Validate range
//     if (newRange.start && newRange.end && newRange.start >= newRange.end) {
//       const err = "Start date must be before or equal to end date.";
//       setError(err);
//       ShowToast("error", err);
//       return;
//     }

//     // Limit future dates if historical tab
//     if (activeTab === 1 && newRange.end && newRange.end >= now) {
//       const err = "Historical range must end today or in the past.";
//       setError(err);
//       ShowToast("error", err);
//       return;
//     }

//     setError("");
//     setDateRange(newRange);
//   };

//   const todayStr = format(new Date(), "yyyy-MM-dd");
//   const startValue = dateRange.start
//     ? format(dateRange.start, "yyyy-MM-dd")
//     : "";
//   const endValue = dateRange.end ? format(dateRange.end, "yyyy-MM-dd") : "";

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         spacing={{ xs: 1, sm: 0.5 }}
//         alignItems={{ xs: "stretch", sm: "center" }}
//       >
//         <StyledInput
//           type="date"
//           value={startValue}
//           onChange={handleChange("start")}
//           fullWidth
//           inputProps={{
//             min: activeTab === 0 ? todayStr : undefined,
//             max: activeTab === 1 ? todayStr : undefined,
//           }}
//         />

//         <Typography
//           variant="body2"
//           sx={{
//             textAlign: { xs: "center", sm: "left" },
//             my: { xs: 0.5, sm: 0 },
//           }}
//         >
//           to
//         </Typography>

//         <StyledInput
//           type="date"
//           value={endValue}
//           onChange={handleChange("end")}
//           fullWidth
//           inputProps={{
//             min:
//               activeTab === 0
//                 ? todayStr
//                 : dateRange.start
//                 ? format(dateRange.start, "yyyy-MM-dd")
//                 : undefined,
//             max: activeTab === 1 ? todayStr : undefined,
//           }}
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default DateRangePicker;






import React, { useState } from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { format, isValid } from "date-fns";
import { ShowToast } from "../ToastAndSnacks/ShowToast";

const StyledInput = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    backgroundColor: "#fff",
    borderRadius: 4,
    height: "32px",
    fontSize: "0.75rem",
  },
  "& input": {
    padding: "4px 8px",
  },
}));

const DateRangePicker = ({ dateRange, setDateRange, activeTab }) => {
  const [error, setError] = useState("");

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    const now = new Date();
    const newRange = { ...dateRange };

    if (value) {
      const [year, month, day] = value.split("-").map(Number);
      const localDate = new Date(year, month - 1, day);

      if (!isValid(localDate)) {
        const err = "Invalid date format. Use YYYY-MM-DD.";
        setError(err);
        ShowToast("error", err);
        return;
      }

      if (key === "start") {
        localDate.setHours(0, 0, 0, 0);
      } else if (key === "end") {
        localDate.setHours(23, 59, 59, 999);
      }

      newRange[key] = localDate;
    } else {
      newRange[key] = null;
    }

    // Validate range
    if (newRange.start && newRange.end && newRange.start >= newRange.end) {
      const err = "Start date must be before or equal to end date.";
      setError(err);
      ShowToast("error", err);
      return;
    }

    // Limit future dates if historical tab (activeTab === 1), allow today
    if (activeTab === 1 && newRange.end) {
      const endDateOnly = new Date(
        newRange.end.getFullYear(),
        newRange.end.getMonth(),
        newRange.end.getDate()
      );
      const todayOnly = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      if (endDateOnly > todayOnly) {
        const err = "Historical range must end today or in the past.";
        setError(err);
        ShowToast("error", err);
        return;
      }
    }

    setError("");
    setDateRange(newRange);
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const startValue = dateRange.start
    ? format(dateRange.start, "yyyy-MM-dd")
    : "";
  const endValue = dateRange.end ? format(dateRange.end, "yyyy-MM-dd") : "";

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 0.5 }}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <StyledInput
          type="date"
          value={startValue}
          onChange={handleChange("start")}
          fullWidth
          inputProps={{
            min: activeTab === 0 ? todayStr : undefined,
            max: activeTab === 1 ? todayStr : undefined,
          }}
        />

        <Typography
          variant="body2"
          sx={{
            textAlign: { xs: "center", sm: "left" },
            my: { xs: 0.5, sm: 0 },
          }}
        >
          to
        </Typography>

        <StyledInput
          type="date"
          value={endValue}
          onChange={handleChange("end")}
          fullWidth
          inputProps={{
            min:
              activeTab === 0
                ? todayStr
                : dateRange.start
                ? format(dateRange.start, "yyyy-MM-dd")
                : undefined,
            max: activeTab === 1 ? todayStr : undefined,
          }}
        />
      </Stack>
    </Box>
  );
};

export default DateRangePicker;
