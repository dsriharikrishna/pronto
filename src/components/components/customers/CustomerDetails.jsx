import React from "react";
import { Dialog, Slide, Box, Typography, IconButton } from "@mui/material"; // Fixed: import Dialog, Slide
import { Cancel } from "@mui/icons-material";
import { commonFontStyles } from "../../styles/globalStyles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} timeout={200} {...props} />;
});

const CustomerDetails = ({ open, onClose, customer }) => {
  if (!customer) return null;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          maxWidth: "400px",
          marginLeft: "auto",
          width: "100%",
          background: "#f4f6fb",
          borderRadius: 2,
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          background: "#fff",
          borderRadius: 2,
          boxShadow: 1,
          minHeight: "100vh",
        }}
      >
        {customer && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #ddd",
                paddingBottom: 1,
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  ...commonFontStyles,
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#111928",
                }}
              >
                Customer Details
              </Typography>
              <IconButton onClick={onClose} sx={{ color: "#111928" }}>
                <Cancel />
              </IconButton>
            </Box>
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  ID:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {customer.id}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Name:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {customer.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Mobile:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {customer.mobileNumber}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Email:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {customer.email || "N/A"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Status:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {customer.status}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Type:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {customer.type}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Referral Code:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {customer.referralCode}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Referral Code Used:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {customer.referralCodeUsed || "N/A"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Orders Count:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {customer.OrdersCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Address:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {customer.fullAddress || "N/A"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Created At:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {new Date(customer.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400, fontSize: 14 }}
                >
                  Updated At:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, fontSize: 16 }}
                >
                  {new Date(customer.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default CustomerDetails;
