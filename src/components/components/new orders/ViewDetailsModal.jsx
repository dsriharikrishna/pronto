// import React from "react";
// import { formatDateTime, getDayName } from "../../utils/helper";
// import {
//   Box,
//   Dialog,
//   IconButton,
//   Typography,
//   Divider,
//   Stack,
// } from "@mui/material";
// import { Cancel } from "@mui/icons-material";

// const ViewDetailsModal = ({ open, onClose, row, fields }) => {
//   const dynamicFields =
//     fields && Array.isArray(fields)
//       ? fields.filter((field) => field.key !== "floor")
//       : row
//       ? Object.keys(row)
//           .filter((key) => key !== "floor")
//           .map((key) => ({
//             label: key
//               .replace(/([A-Z])/g, " $1")
//               .replace(/^./, (str) => str.toUpperCase()),
//             key,
//           }))
//       : [];

//   const renderValue = (value, label) => {
//     if (value === null || value === undefined) return "N/A";
//     if (Array.isArray(value)) return value.join(", ");
//     if(value === "null - null") return "N/A";
//     if (typeof value === "object")
//       return JSON.stringify(value, null, 2).replace(/[{}"]/g, "");

//     // Handle date fields
//     const dateFields = [
//       "Booking Created At",
//       "Booking Scheduled At",
//       "Start Time Utc",
//       "Start Date",
//     ];
//     if (dateFields.includes(label)) {
//       const formattedDate = formatDateTime(value);
//       const dayName = getDayName(formatDateTime(value));
//       return `${formattedDate} (${dayName})`;
//     }

//     return String(value);
//   };

//   console.log(dynamicFields);

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: 650,
//           maxHeight: "90vh",
//           borderRadius: 2,
//           overflowY: "auto",
//         },
//       }}
//     >
//       {/* Header */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           p: 2,
//           backgroundColor: "#f1f1f1",
//           color: "#fff",
//           borderTopLeftRadius: 8,
//           borderTopRightRadius: 8,
//           position: "sticky",
//           top: 0,
//         }}
//       >
//         <Typography variant="h6" fontWeight={600}>
//           Order Details
//         </Typography>
//         <IconButton onClick={onClose} sx={{ color: "gray" }}>
//           <Cancel />
//         </IconButton>
//       </Box>

//       <Box sx={{ p: 3 }}>
//         {dynamicFields.map(({ label, key }) => (
//           <Stack
//             key={key}
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             spacing={2}
//             sx={{
//               py: 1,
//               borderBottom: "1px solid #e0e0e0",
//             }}
//           >
//             <Typography
//               variant="body2"
//               fontWeight={500}
//               color="text.secondary"
//               sx={{ minWidth: 180 }}
//             >
//               {label}
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{ wordBreak: "break-word", textAlign: "right", flex: 1 }}
//             >
//               {renderValue(row?.[key], label)}
//             </Typography>
//           </Stack>
//         ))}
//       </Box>
//     </Dialog>
//   );
// };

// export default ViewDetailsModal;

import React, { useCallback } from "react";
import { formatDateTime, getDayName } from "../../utils/helper";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import { Balcony, Bathroom, Cancel, CopyAll } from "@mui/icons-material";
import { ShowToast } from "../ToastAndSnacks/ShowToast";

const ViewDetailsModal = ({ open, onClose, row }) => {
  const renderValue = (value, label) => {
    if (value === null || value === undefined || value === "null - null")
      return "N/A";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object")
      return JSON.stringify(value, null, 2).replace(/[{}"]/g, "");

    const dateFields = [
      "bookingCreatedAt",
      "bookingScheduledAt",
      "startTimeUtc",
      "startDate",
    ];
    if (dateFields.includes(label)) {
      const formattedDate = formatDateTime(value);
      const dayName = getDayName(formattedDate);
      return `${formattedDate} (${dayName})`;
    }

    return String(value);
  };

  const handleCopyDetails = useCallback(() => {
    const latitude = row?.coordinates?.latitude;
    const longitude = row?.coordinates?.longitude;
    const mapLink =
      latitude && longitude
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : "N/A";

    const payload = {
      "Customer Name": row?.customerName || "N/A",
      "Customer Phone Number": row?.customerPhoneNumber || "N/A",
      "House Number": row?.houseNo || "N/A",
      Address: row?.deliveryAddress || "N/A",
      "Map Link": mapLink,
      Services: Array.isArray(row?.services)
        ? row.services.join(", ")
        : row?.services || "N/A",
      BHK: row?.bhk || "N/A",
      Bathroom: row?.bathroom || "N/A",
      Balcony: row?.balcony || "N/A",
    };

    const textToCopy = Object.entries(payload)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    navigator.clipboard.writeText(textToCopy);
    ShowToast("success", "Customer Details Copied Successfully");
  }, [row]);

  const fieldsToRender = [
    { label: "Booking Id", key: "bookingId" },
    { label: "Booking Type", key: "bookingType" },
    { label: "Booking Created At", key: "bookingCreatedAt" },
    { label: "Booking Scheduled At", key: "bookingScheduledAt" },
    { label: "Parent Booking Id", key: "parentBookingId" },
    { label: "Customer Name", key: "customerName" },
    { label: "Customer Phone Number", key: "customerPhoneNumber" },
    { label: "House No", key: "houseNo" },
    { label: "Landmark", key: "landmark" },
    { label: "Delivery Address", key: "deliveryAddress" },
    { label: "Booking Status", key: "bookingStatus" },
    { label: "Services", key: "services" },
    { label: "Coordinates", key: "coordinates" },
    { label: "Reason", key: "reason" },
    { label: "Bundle Id", key: "bundleId" },
    { label: "Recurring Type", key: "recurringType" },
    { label: "Total Time Taken (minutes)", key: "totalTimeTaken" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Total Price After Discount", key: "totalAfterDiscount" },
    { label: "Razorpay Order Id", key: "razorpayOrderId" },
    { label: "Razorpay Payment Id", key: "razorpayPaymentId" },
    { label: "Bhk", key: "bhk" },
    { label: "Balcony", key: "balcony" },
    { label: "Bathroom", key: "bathroom" },
    // { label: "Start Date", key: "startDate" },
    // { label: "Start Time", key: "startTimeUtc" },
    { label: "Customer Id", key: "customerId" },
    { label: "Booking Reason", key: "bookingReason" },
    { label: "Worker Id", key: "partnerId" },
    { label: "Worker Name", key: "partnerName" },
    { label: "Worker Phone No", key: "partnerPhoneNo" },
    { label: "Hub Id", key: "hubId" },
    { label: "Hub Name", key: "hubName" },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 650,
          maxHeight: "90vh",
          borderRadius: 2,
          overflowY: "auto",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          backgroundColor: "#f1f1f1",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          position: "sticky",
          top: 0,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Order Details
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            justifyItems: "space-between",
          }}
        >
          <Tooltip title={"click to copy customer details"}>
            <IconButton onClick={handleCopyDetails} size="small">
              <CopyAll size={16} />
            </IconButton>
          </Tooltip>

          <IconButton onClick={onClose} sx={{ color: "gray" }}>
            <Cancel />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {fieldsToRender.map(({ label, key }) => (
          <Stack
            key={key}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ py: 1, borderBottom: "1px solid #e0e0e0" }}
          >
            <Typography
              variant="body2"
              fontWeight={500}
              color="text.secondary"
              sx={{ minWidth: 200 }}
            >
              {label}
            </Typography>
            <Typography
              variant="body2"
              sx={{ wordBreak: "break-word", textAlign: "right", flex: 1 }}
            >
              {renderValue(row?.[key], key)}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Dialog>
  );
};

export default ViewDetailsModal;
