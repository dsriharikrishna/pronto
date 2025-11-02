import React from "react";
import { Box } from "@mui/material";

const CustomLoader = () => {
  return (
    <Box
      sx={{
        width: 64,
        height: 64,
        backgroundColor: "white",
        position: "relative",
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* P Symbol (center) */}
      <Box
        sx={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          fontWeight: "bold",
          fontSize: "24px",
          color: "#00b664",
          borderRadius: "4px"
        }}
      >
        P
      </Box>

      {/* Border animation */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 1,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            border: "20px solid transparent",
            animation: "fillBorder 2s linear infinite",
          },
          "@keyframes fillBorder": {
            "0%": {
              borderTopColor: "#00b664",
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            },
            "25%": {
              borderTopColor: "#00b664",
              borderRightColor: "#00b664",
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            },
            "50%": {
              borderTopColor: "#00b664",
              borderRightColor: "#00b664",
              borderBottomColor: "#00b664",
              borderLeftColor: "transparent",
            },
            "75%": {
              borderTopColor: "#00b664",
              borderRightColor: "#00b664",
              borderBottomColor: "#00b664",
              borderLeftColor: "#00b664",
            },
            "100%": {
              borderTopColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            },
          },
        }}
      />
    </Box>
  );
};

export default CustomLoader;
