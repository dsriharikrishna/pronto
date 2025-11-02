import { Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { formatDateTime, formatTimeString } from "../../utils/helper";

const ServiceDetailsCard = ({serviceInfo, bookingInfo}) => {
  console.log("Booking info", bookingInfo?.orderStatus);
  const status = bookingInfo?.orderStatus || "N/A";
  const price = bookingInfo?.totalPrice || "00";
  const CardStyles = {
    borderRadius: "8px",
    backgroundColor: "white",
    p: 2,
    gap: 1,
  };

   const paperStyles ={
    backgroundColor:'#F9FAFB',
    borderRadius:'6px',
    p:2,

  }

  const headingStyles = {
    color: "#1F2A37",
    fontWeight: "600",
    fontSize: "13px",
    lineHeight: "25px",
  };

  const spanLightStyles = {
    color: "#6B7280",
    fontWeight: "500",
    fontSize: "13px",
    lineHeight: "25px",
    textTransform:'capitalize'
  };

  const spanDarkStyles = {
    color: "#1F2A37",
    fontWeight: "600",
    fontSize: "13px",
    lineHeight: "25px",
    textTransform:'capitalize'
  };

  return (
    <Stack sx={CardStyles}>
      <Typography sx={headingStyles}>Service Details</Typography>
      <Paper
        elevation={0}
        sx={
         paperStyles
        }
      >
        <Stack direction={"row"} >
          <Stack flex={1} >
            <Stack direction={'row'} gap={1}>
            <Typography sx={spanDarkStyles}>Submit Time</Typography>
            <Typography sx={spanDarkStyles} ml={-0.4}>:</Typography>
            <Typography sx={spanLightStyles}>
              {formatDateTime(serviceInfo?.submitTime).split(",") || 'N/A'}
            </Typography>
           </Stack>
           <Stack direction={'row'} gap={1}>
            <Typography sx={spanDarkStyles}>Submit Date</Typography>
            <Typography sx={spanDarkStyles}>:</Typography>
            <Typography sx={spanLightStyles}>
             {formatDateTime(serviceInfo?.submitDate).split(",") || 'N/A'}
            </Typography>
            </Stack>
            <Stack direction='row' gap={1}>
              <Typography sx={spanDarkStyles}>Service Time :</Typography>
              <Typography sx={spanLightStyles}>
                  {formatDateTime(serviceInfo?.serviceTime).split(",") || 'N/A'}
              </Typography>
            </Stack>
          </Stack>
          <Stack flex={1}>
            <Stack direction={'row'} gap={1}>
              <Typography sx={spanDarkStyles}>Status</Typography>
              <Typography sx={spanDarkStyles} ml={4.8}>:</Typography>
              <Typography sx={{textTransform:'capitalize',...spanLightStyles}}>
                 {status}
              </Typography>
            </Stack>
            <Stack direction='row' gap={1}>
              <Typography sx={spanDarkStyles}>Service Type</Typography>
              <Typography sx={spanDarkStyles}>:</Typography>
            <Typography sx={spanLightStyles}>
               {serviceInfo?.serviceType || 'N/A'}
            </Typography>
            </Stack>

            <Stack direction='row' gap={1}>
              <Typography sx={spanDarkStyles}>Total Paid</Typography>
              <Typography sx={spanDarkStyles} ml={2}>:</Typography>
              <Typography sx={spanLightStyles}>
                 {price}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ServiceDetailsCard;
