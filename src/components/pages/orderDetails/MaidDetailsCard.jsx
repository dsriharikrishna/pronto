import { Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";

const MaidDetailsCard = ({partnerInfo, serviceInfo}) => {
 const {partnerName,partnerId, partnerMobileName} = partnerInfo;
  const CardStyles = {
    borderRadius: "8px",
    backgroundColor: "white",
    p: 2,
    gap: 1,
  };
   const paperStyles ={
    backgroundColor:'#F9FAFB',
    borderRadius:'6px',
    p:2
  }

  const headingStyles = {
    color: "#1F2A37",
    fontWeight: "600",
    fontSize: "13px",
    lineHeight: '25px'
  };

  const spanLightStyles = {
    color: "#6B7280",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "25px",
  };

  const spanDarkStyles = {
    color: "#1F2A37",
    fontWeight: "600",
    fontSize: "13px",
    lineHeight: "25px",
  };
  return (
    <Stack sx={CardStyles} height={'100%'}>
      <Typography sx={headingStyles}>Worker Details</Typography>

      <Paper
        elevation={0}
        sx={
            paperStyles
         
        }
      >
        <Stack spacing={2} direction={'row'}>
          <Stack item xs={12} sm={6}>
            <Stack direction={'row'} gap={1}>
              <Typography sx={spanDarkStyles}>Name</Typography>
              <Typography sx={spanDarkStyles} ml={7}>:</Typography>
              <Typography sx={spanLightStyles}>
                 {partnerName || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} gap={1}>
            <Typography sx={spanDarkStyles}>Mobile Number</Typography>
            <Typography sx={spanDarkStyles}>:</Typography>
            <Typography sx={spanLightStyles}>
               {partnerMobileName || 'N/A'}
            </Typography>
            </Stack>
          </Stack>
          <Stack item xs={12} sm={6}>
            <Stack direction={'row'} gap={1}>
              <Typography sx={spanDarkStyles}>Worker ID</Typography>
              <Typography sx={spanDarkStyles}>:</Typography>
            <Typography sx={spanLightStyles}>
               {partnerId || 'N/A'}
            </Typography>
            </Stack>
            <Stack direction={'row'} gap={1}>
              <Typography sx={spanDarkStyles}>Hub</Typography>
              <Typography sx={spanDarkStyles} ml={4.5}>:</Typography>
            <Typography sx={spanLightStyles}>
              {serviceInfo?.hub || 'N/A'}
            </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default MaidDetailsCard;
