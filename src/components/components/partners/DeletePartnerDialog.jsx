import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import {
  deleteButtonStyles,
  saveButtonStyles,
  commonFontStyles,
} from "../../styles/globalStyles";

const DeletePartnerDialog = ({ open, onClose, onConfirm, partnerName }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 380,
          m: "auto", 
          position: "relative", 
        },
      }}
      sx={{
        ...commonFontStyles,
      }}
    >
      <DialogTitle
        sx={{
          ...commonFontStyles,
          textAlign: "left",
          borderBottom: "1px solid #D1D5DB",
          mb: 1,
        }}
      >
        <Typography sx={{ ...commonFontStyles, fontWeight: 600 }}>
          Delete Worker
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ ...commonFontStyles }}>
        <Typography
          sx={{ ...commonFontStyles, fontSize: { sm: "13px", xs: "16px" } }}
        >
          Are you sure you want to delete <strong>{partnerName}</strong>? This
          action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            ...saveButtonStyles,
            ...commonFontStyles,
            px: 2.5,
            py: 0.3,
            color: "#fff",
            minWidth: "90px",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          variant="outlined"
          color="error"
          sx={{
           
            ...commonFontStyles,
            px: 2.5,
            py: 0.3,
            minWidth: "90px",
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePartnerDialog;
