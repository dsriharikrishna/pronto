import { Box, Paper, Stack, Typography } from "@mui/material";
import { Envelope, House, MapPin, Phone, User } from "phosphor-react";
import React from "react";

const CustomerDetailsCard = (customerInfo) => {
  // const { name, mobileNumber } = customerInfo?.customerInfo;
  const name = customerInfo?.customerInfo?.customerName || "";
  const mobileNumber = customerInfo?.customerInfo?.customerMobileNumber || "";
  const address = customerInfo?.customerInfo?.customerAddress || "";
  const landmark = customerInfo?.customerInfo?.customerLandMark || "";
  const landMark = customerInfo?.customerInfo?.customerLandMark || "";

  const CardStyles = {
    borderRadius: "8px",
    backgroundColor: "white",
    p: 2,
    gap: 1,
  };
  const paperStyles = {
    backgroundColor: "#F9FAFB",
    borderRadius: "6px",
    p: 2,
  };

  const headingStyles = {
    color: "#1F2A37",
    fontWeight: "600",
    fontSize: "13px",
    lineHeight: "30px",
  };

  const spanDarkStyles = {
    color: "#6B7280",
    fontWeight: "500",
    fontSize: "13px",
    lineHeight: "30px",
  };

  const stackStyles = {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    lineHeight: "25px",
  };
  const iconStyles = {
    color: "#6B7280",
  };
  return (
    <Stack sx={CardStyles}>
      <Typography sx={headingStyles}>Customer Details</Typography>

      <Paper elevation={0} sx={paperStyles}>
        <Stack
          direction={"row"}
          // justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack flex={1}>
            <Stack sx={stackStyles}>
              <User style={iconStyles} />
              <Typography sx={headingStyles}>Customer Name :</Typography>
              <Typography sx={spanDarkStyles}>{name || "N/A"}</Typography>
            </Stack>
            <Stack sx={stackStyles}>
              <Phone style={iconStyles} />
              <Typography sx={headingStyles}>Cell </Typography>
              <Typography sx={headingStyles} ml={8.6}>
                :
              </Typography>
              <Typography sx={spanDarkStyles}>
                {mobileNumber || "N/A"}
              </Typography>
            </Stack>
          </Stack>

          <Stack flex={1}>
            <Stack sx={stackStyles}>
              <MapPin style={iconStyles} />
              <Typography sx={headingStyles}>Address</Typography>
              <Typography sx={headingStyles} ml={1.7}>:</Typography>

              <Typography sx={spanDarkStyles}>
                {address + " " + landmark}
              </Typography>
            </Stack>
            <Stack sx={stackStyles}>
              <House style={iconStyles} />
              <Typography style={headingStyles}>House Size :</Typography>

              <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
                <Typography sx={spanDarkStyles}>
                  <span>BHK:</span> {customerInfo?.customerInfo?.bhk || 0}
                  {","}
                </Typography>
                {/* <Typography sx={spanDarkStyles}><span>Floor:</span> {customerInfo?.customerInfo?.floor}</Typography> */}
                <Typography sx={spanDarkStyles}>
                  <span>Balcony:</span>{" "}
                  {customerInfo?.customerInfo?.balcony || 0} {","}
                  <span>Bathroom:</span>{" "}
                  {customerInfo?.customerInfo?.bathroom || 0}
                </Typography>
                <Typography sx={spanDarkStyles}>
                  <Typography sx={spanDarkStyles}>
                    <span>Floor:</span>{" "}
                    {customerInfo?.customerInfo?.floor !== null
                      ? customerInfo?.customerInfo?.floor
                      : 0 || 0}
                  </Typography>
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default CustomerDetailsCard;
