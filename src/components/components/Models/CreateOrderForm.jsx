// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Button,
//   Box,
//   Slider,
//   TextareaAutosize,
//   Tooltip,
//   Stepper,
//   Step,
//   StepLabel,
// } from "@mui/material";
// import { useState } from "react";
// import CloseIcon from "@mui/icons-material/Close";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import { styled } from "@mui/material/styles";

// // Stepper setup
// const CustomConnector = styled("div")(({ theme }) => ({
//   flex: 1,
//   height: 2,
//   backgroundColor: theme.palette.grey[300],
//   position: "relative",
//   top: 12,
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     left: 0,
//     right: "50%",
//     height: 2,
//     backgroundColor: theme.palette.success.main,
//     zIndex: 1,
//   },
// }));

// const StepContainer = styled(Box)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   minWidth: 150,
// }));
// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];
// function ColorlibStepIcon(props) {
//   const { active, completed, className } = props;

//   const icons = {
//     1: <SettingsIcon />,
//     2: <GroupAddIcon />,
//     3: <VideoLabelIcon />,
//   };

//   return (
//     <ColorlibStepIcon ownerState={{ completed, active }} className={className}>
//       {icons[String(props.icon)]}
//     </ColorlibStepIcon>
//   );
// }

// const CustomStepper = ({ activeStep }) => (

//   <Box sx={{ width: "100%", mt: 2 }}>
//     <Box>
//       <Stepper alternativeLabel activeStep={1} connector={<ColorlibConnector/>}>
//   {steps.map((label) => (
//     <Step key={label}>
//       <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
//     </Step>
//   ))}
// </Stepper>
//       <Box
//         sx={{ display: "flex", alignItems: "", justifyContent: "" }}
//       >
//         <CheckCircleIcon
//           color={activeStep >= 0 ? "success" : "disabled"}
//           fontSize="medium"
//         />
//         <StepContainer></StepContainer>
//         <CustomConnector />
//         <RadioButtonUncheckedIcon
//           color={activeStep >= 1 ? "success" : "disabled"}
//           fontSize="medium"
//         />
//         <StepContainer></StepContainer>
//       </Box>
//     </Box>
//     <Box display={'flex'} flexDirection={"row"} justifyContent={"space-between"}>
//       <Typography fontWeight={500} fontSize={14} color="text.primary" mt={1}>
//         Customer Details
//       </Typography>
//       <Typography fontWeight={500} fontSize={14} color="text.primary" mt={1}>
//         Service Details
//       </Typography>
//     </Box>
//   </Box>
// );

// const CreateOrderForm = ({ open, onClose }) => {
//   const [sliderValues, setSliderValues] = useState({
//     bhk: 5,
//     bathroom: 5,
//     balcony: 5,
//   });

//   const handleSliderChange = (name, value) => {
//     setSliderValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const activeStep = 0;

//   const primaryColor = "#00aa69";
//   const lightGray = "#eeeeee";
//   const darkGray = "#666666";

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       sx={{
//         "& .MuiDialog-paper": {
//           marginLeft: "auto",
//           marginRight: 0,
//           height: "100vh",
//           maxHeight: "100vh",
//           borderRadius: 0,
//           display: "flex",
//           flexDirection: "column",
//           p: 0,
//         },
//       }}
//     >
//       <DialogTitle sx={{ p: 0 }}>
//         <Box sx={{ px: 2, py: 2, borderBottom: "1px solid #eee" }}>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: 600 }}>
//               Add Order
//             </Typography>
//             <IconButton onClick={onClose}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <CustomStepper activeStep={activeStep} />
//         </Box>
//       </DialogTitle>

//       <DialogContent
//         sx={{ flex: 1, padding: "16px", mt: 1, overflowY: "auto" }}
//       >
//         <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//           {/* Name */}
//           <Box>
//             <Typography variant="body2" sx={{ mb: "6px", color: darkGray }}>
//               Name
//             </Typography>
//             <TextField
//               fullWidth
//               size="small"
//               value="Sherlock Holmes"
//               InputProps={{ readOnly: true, sx: { fontSize: "14px" } }}
//             />
//           </Box>

//           {/* Phone */}
//           <Box>
//             <Typography variant="body2" sx={{ mb: "6px", color: darkGray }}>
//               Phone number
//             </Typography>
//             <Box sx={{ display: "flex", height: 40 }}>
//               <Select
//                 size="small"
//                 value="+1"
//                 sx={{
//                   borderRadius: "4px 0 0 4px",
//                   borderRight: "none",
//                   height: "100%",
//                   "& .MuiOutlinedInput-root": { height: "100%" },
//                   "& .MuiOutlinedInput-notchedOutline": { borderRight: "none" },
//                 }}
//               >
//                 <MenuItem value="+1">+91</MenuItem>
//               </Select>

//               <TextField
//                 fullWidth
//                 size="small"
//                 value="123 4567 890"
//                 InputProps={{
//                   readOnly: true,
//                   sx: {
//                     height: "100%",
//                     borderRadius: "0 4px 4px 0",
//                     fontSize: "14px",
//                   },
//                 }}
//               />
//             </Box>
//           </Box>

//           {/* Address */}
//           <Box sx={{ pr: 2 }}>
//             <Typography variant="body2" sx={{ mb: "6px", color: darkGray }}>
//               Address
//             </Typography>
//             <TextareaAutosize
//               minRows={4}
//               placeholder="Write text here ..."
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 border: "1px solid #ddd",
//                 borderRadius: "4px",
//                 fontSize: "14px",
//                 resize: "vertical",
//                 fontFamily: "inherit",
//               }}
//             />
//           </Box>

//           {/* Sliders */}
//           {["BHK", "Bathroom", "Balcony"].map((label) => {
//             const key = label.toLowerCase();
//             const value = sliderValues[key];
//             return (
//               <Box key={label} sx={{ mb: 2 }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
//                     {label}
//                   </Typography>
//                   <Typography sx={{ fontSize: "14px" }}>{value}</Typography>
//                 </Box>
//                 <Tooltip title={value} placement="top" arrow>
//                   <Slider
//                     value={value}
//                     onChange={(e, newValue) =>
//                       handleSliderChange(key, newValue)
//                     }
//                     min={0}
//                     max={10}
//                     sx={{
//                       p: 0,
//                       color: primaryColor,
//                       height: 1,
//                       "& .MuiSlider-thumb": {
//                         width: 16,
//                         height: 16,
//                         backgroundColor: primaryColor,
//                       },
//                       "& .MuiSlider-track": { height: 4 },
//                       "& .MuiSlider-rail": {
//                         height: 4,
//                         backgroundColor: lightGray,
//                       },
//                     }}
//                   />
//                 </Tooltip>
//               </Box>
//             );
//           })}
//         </Box>
//       </DialogContent>

//       <DialogActions
//         sx={{ padding: "16px", gap: "16px", borderTop: "1px solid #eee" }}
//       >
//         <Button
//           fullWidth
//           variant="outlined"
//           size="small"
//           onClick={onClose}
//           sx={{ fontSize: "14px", fontWeight: 500 }}
//         >
//           Cancel
//         </Button>
//         <Button
//           fullWidth
//           variant="contained"
//           size="small"
//           sx={{
//             fontSize: "14px",
//             fontWeight: 500,
//             backgroundColor: primaryColor,
//             "&:hover": { backgroundColor: primaryColor },
//           }}
//         >
//           Next
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CreateOrderForm;
