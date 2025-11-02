import React from "react";
import { Box, Typography, Stack, Grid } from "@mui/material";
import { styled } from "@mui/system";

// Styled component for icon wrapper
const IconWrapper = styled(Box)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor,
  color: theme?.palette?.text?.primary,
  borderRadius: theme?.shape?.borderRadius,
  padding: theme.spacing(0.5, 1),
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.786rem",
}));

const typographyStyles = {
  fontSize: "14px",
};

// Legend data
const legendItems = [
  { label: "A", description: "App", color: "#f3e5f5" },
  { label: "B", description: "Bundle", color: "#fff9c4" },
  { label: "C", description: "Custom", color: "#f8bbd0" },
  { label: "D", description: "Daily", color: "#c5cae9" },
  // { label: "I", description: "Instant", color: "#fff1f1" },
  { label: "R", description: "Recurring", color: "#ffecb3" },
  // { label: "D", description: "Daily", color: "#f2f1f1" },
  { label: "W", description: "Weekly", color: "#b2dfdb" },
];

const Legends = () => (
  <Grid container spacing={1} mt={1}>
    {legendItems?.map(({ label, description, color }) => (
      <Grid  size={{xs:4, sm:"auto"}} key={label}>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <IconWrapper bgcolor={color}>{label}</IconWrapper>
          <Typography sx={typographyStyles}>: {description}</Typography>
        </Stack>
      </Grid>
    ))}
  </Grid>
);

export default Legends;
