// Common styles for labels

const commonFontStyles = {
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  textTransform: "capitalize",
};

const buttonStyles = {
  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.25rem" },
  ml: -0.5,
  mb: { xs: 1, sm: 1 },
  color: "#111928",
  width: { xs: "100%", sm: "auto" },
  justifyContent: { xs: "center", sm: "flex-start" },
  px: { xs: 1, sm: 1 },
  py: { xs: 1, sm: 0.5 },
};

const cancelButtonStyles = {
  px: 2,
  py: 0.5,
  font: "Roboto Helvetica Aria sans-serif",
  textTransform: "capitalize",
  minWidth: "150px",
  borderColor: "#1F2A37",
  color: "#1F2A37",
  "&:hover": {
    borderColor: "#1F2A37",
    backgroundColor: "#f0f0f0",
  },
};

const saveButtonStyles = {
  px: 2,
  py: 0.5,
  font: "Roboto Helvetica Aria sans-serif",
  textTransform: "capitalize",
  minWidth: "150px",
  backgroundColor: "#08AD61",
  "&:hover": {
    backgroundColor: "#009a54",
  },
  fontWeight: 500,
  "&:disabled": {
    backgroundColor: "#cccccc",
  },
};

const deleteButtonStyles = {
  px: 2,
  py: 0.5,
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  textTransform: "capitalize",
  minWidth: "150px",
  fontWeight: 500,
};

const menuStyles = {
  fontSize: { xs: "0.75rem", md: "0.95rem" },
  font: "Roboto Helvetica Aria sans-serif",
};

const typeStyles = {
  fontSize: { xs: "0.75rem", md: "0.95rem" },
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  fontWeight: 500,
};

const EditTypeStyles = {
  fontSize: { xs: "16px", md: "20px" },
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  fontWeight: 600,
  textTransform: "capitalize",
  color: "#111928",
};

const labelStyles = {
  // fontFamily: "Roboto Helvetica Aria sans-serif",
  // mb: "6px",
  fontSize: "16px",
  textTransform: "capitalize",
  color: "#111928",
  fontWeight: 600,
};

// Common input field styles
const inputStyles = {
  "& .MuiInputBase-input": {
    fontWeight: 500,
    fontSize: "0.875rem",
    "&::placeholder": {
      color: "#9e9e9e",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "1.5px solid #D1D5DB",
    },
    "&:hover fieldset": {
      border: "1.5px solid #D1D5DB",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #00b664",
    },
  },
  "& .MuiInputAdornment-root": {
    color: "#9e9e9e", // Optional: style for calendar icon
  },
};


const datePickerStyles = {
  ...inputStyles,
   "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "1.5px solid #D1D5DB",
    },
    "&:hover fieldset": {
      border: "1.5px solid #D1D5DB",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #00b664", // your focused color
    },
  },
  "& .MuiSvgIcon-root": {
    color: "#9e9e9e", // Icon inside the input
  },
  "&.Mui-focused fieldset": {
      border: "1px solid #00b664", // your focused color
  },
    width: '100%',
};

export {
  labelStyles,
  inputStyles,
  buttonStyles,
  menuStyles,
  typeStyles,
  cancelButtonStyles,
  saveButtonStyles,
  EditTypeStyles,
  deleteButtonStyles,
  commonFontStyles,
  datePickerStyles
};
