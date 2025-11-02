// // src/components/auth/Login.jsx
// import React, { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   IconButton,
//   InputAdornment,
//   CircularProgress,
//   Paper,
//   InputLabel,
// } from "@mui/material";
// import {
//   Visibility,
//   VisibilityOff,
//   Person as PersonIcon,
//   Lock as LockIcon,
// } from "@mui/icons-material";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { AuthenticateUser } from "../redux/slicers/authSlice";
// import { ShowToast } from "../components/ToastAndSnacks/ShowToast";
// import ImageSlider from "../components/sliders/ImageSlider";
// import { saveRoleFromToken } from "../utils/authUtils";
// import { GoogleLogin } from "@react-oauth/google";
// import apiMethods from "../services/ApiMethods";
// import ApiConfigures from "../services/ApiConfigures";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!formData.email.trim()) {
//       newErrors.email = "Email cannot be just whitespace";
//     } else if (!emailRegex.test(formData.email.trim())) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setIsSubmitting(true);
//       try {
//         const res = await dispatch(
//           AuthenticateUser({
//             email: formData.email,
//             password: formData.password,
//             type: "ADMIN",
//           })
//         ).unwrap();
//         setIsSubmitting(false);
//         setFormData({ email: "", password: "" });
//         if (res.data) {
//           localStorage.setItem("token", res.data.token);
//           saveRoleFromToken(res.data.token);
//           navigate("/bookings");
//           ShowToast("success", "Login successful!");
//         } else {
//           setErrors((prev) => ({ ...prev, invalid: res.data.message }));
//         }
//       } catch (err) {
//         console.error("Login error:", err);
//         setIsSubmitting(false);
//         ShowToast("error", err || "Login failed. Please try again.");
//         setErrors((prev) => ({
//           ...prev,
//           invalid: err || "Login failed. Please try again.",
//         }));
//       }
//     }
//   };

//   const handleSuccess = async (credentialResponse) => {
//     try {
//       const res = await apiMethods.post(ApiConfigures.ENDPOINTS.GOOGLE_LOGIN, {
//         idToken: credentialResponse.credential,
//       });
//       console.log("/auth/google-login API response:", res);
//       if (res && res.data && res.data.token) {
//         console.log(
//           "Storing token in localStorage and navigating to /bookings"
//         );
//         localStorage.setItem("token", res.data.token);
//         console.log(res.data.token);
//         saveRoleFromToken(res.data.token);
//         navigate("/bookings");
//         ShowToast("success", "Login successful!");
//       } else {
//         console.log("Google login failed, response:", res);
//         ShowToast("error", res?.message || "Google login failed.");
//       }
//     } catch (err) {
//       console.log("Google login error:", err);
//       ShowToast("error", err?.message || "Google login failed.");
//     }
//   };

//   const handleError = () => {
//     console.log("Login Failed");
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: {
//           xs: "column",
//           md: "row",
//         },
//         // alignItems: "center",
//         // justifyContent: "center",
//         overflow: {
//           xs: "auto",
//           md: "hidden",
//         },
//         borderRadius: 2,
//         p: 2,
//       }}
//     >
//       {/* Form Section - 50% width */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "flex-end",
//           bgcolor: "#f1f1f1",
//           borderRadius: 1,
//           p: 4,
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             p: 5,
//             borderRadius: 1,
//             width: "100%",
//             height: "100%",
//             maxHeight: 620,
//             maxWidth: 500,
//             alignContent: "center",
//           }}
//         >
//           <Box component="form" noValidate onSubmit={handleSubmit}>
//             <Typography variant="h4" fontWeight={600} gutterBottom>
//               Sign in
//             </Typography>
//             <Typography variant="body2" color="text.secondary" mb={4}>
//               Sign in to your account and explore a world of possibilities. Your
//               journey begins here.
//             </Typography>

//             {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
//               <InputLabel sx={{ fontWeight: 600, fontSize: 12 }}>
//                 Email
//               </InputLabel>
//               <TextField
//                 fullWidth
//                 name="email"
//                 size="small"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 error={!!errors.email}
//                 helperText={errors.email}
//                 required
//                 margin="normal"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <PersonIcon sx={{ color: "#bbb" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Box> */}

//             {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
//               <InputLabel sx={{ fontWeight: 600, fontSize: 12 }}>
//                 Password
//               </InputLabel>
//               <TextField
//                 fullWidth
//                 name="password"
//                 size="small"
//                 placeholder="Enter your password"
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={handleChange}
//                 error={!!errors.password}
//                 helperText={errors.password}
//                 required
//                 margin="normal"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={() => setShowPassword(!showPassword)}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Box> */}

//             {errors.invalid && (
//               <Typography color="error" variant="body2" mt={1}>
//                 {errors.invalid}
//               </Typography>
//             )}

//             {/* <Button
//               fullWidth
//               size="large"
//               type="submit"
//               sx={{
//                 mt: 4,
//                 color: "white",
//                 bgcolor: "#00b664",
//                 textTransform: "capitalize",
//               }}
//               disabled={isSubmitting}
//               startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
//             >
//               {isSubmitting ? "Signing in..." : "Sign in"}
//             </Button> */}
//           </Box>
//           <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
//         </Paper>
//       </Box>

//       {/* Image Slider Section - 50% width */}
//       <Box
//         sx={{
//           display: "flex",
//           flex: 1,
//           justifyContent: "flex-start",
//           bgcolor: "#f1f1f1",
//           borderRadius: 1,
//           p: 4,
//         }}
//       >
//         <Paper
//           elevation={0}
//           sx={{
//             p: 0,
//             borderRadius: 1,
//             width: "100%",
//             height: "100%",
//             maxHeight: 620,
//             maxWidth: 500,
//             alignContent: "center",
//           }}
//         >
//           <ImageSlider />
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default Login;

// src/components/auth/Login.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
  InputLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthenticateUser } from "../redux/slicers/authSlice";
import { ShowToast } from "../components/ToastAndSnacks/ShowToast";
import ImageSlider from "../components/sliders/ImageSlider";
import { saveRoleFromToken } from "../utils/authUtils";
import { GoogleLogin } from "@react-oauth/google";
import apiMethods from "../services/ApiMethods";
import ApiConfigures from "../services/ApiConfigures";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.trim()) {
      newErrors.email = "Email cannot be just whitespace";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const res = await dispatch(
          AuthenticateUser({
            email: formData.email,
            password: formData.password,
            type: "ADMIN",
          })
        ).unwrap();
        setIsSubmitting(false);
        setFormData({ email: "", password: "" });
        if (res.data) {
          localStorage.setItem("token", res.data.token);
          saveRoleFromToken(res.data.token);
          navigate("/bookings");
          ShowToast("success", "Login successful!");
        } else {
          setErrors((prev) => ({ ...prev, invalid: res.data.message }));
        }
      } catch (err) {
        setIsSubmitting(false);
        ShowToast("error", err?.message || "Login failed. Please try again.");
        setErrors((prev) => ({
          ...prev,
          invalid: err?.message || "Login failed. Please try again.",
        }));
      }
    }
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await apiMethods.post(ApiConfigures.ENDPOINTS.GOOGLE_LOGIN, {
        idToken: credentialResponse.credential,
      });
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        saveRoleFromToken(res.data.token);
        navigate("/bookings");
        ShowToast("success", "Login successful!");
      } else {
        ShowToast("error", res?.message || "Google login failed.");
      }
    } catch (err) {
      ShowToast("error", err?.message || "Google login failed.");
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        overflow: "auto",
        p: 2,
        gap: 2,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Form Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-end" },
          bgcolor: "#fff",
          borderRadius: 1,
          p: 2,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 1,
            width: "100%",
            // maxWidth: { xs: "100%", sm: 400, md: 480 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* <Box component="form" noValidate onSubmit={handleSubmit}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              Sign in to your account and explore a world of possibilities.
            </Typography>

            <InputLabel sx={{ fontWeight: 600, fontSize: 12 }}>Email</InputLabel>
            <TextField
              fullWidth
              name="email"
              size="small"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonIcon sx={{ color: "#bbb" }} />
                  </InputAdornment>
                ),
              }}
            />

            <InputLabel sx={{ fontWeight: 600, fontSize: 12 }}>Password</InputLabel>
            <TextField
              fullWidth
              name="password"
              size="small"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {errors.invalid && (
              <Typography color="error" variant="body2" mt={1}>
                {errors.invalid}
              </Typography>
            )}

            <Button
              fullWidth
              size="large"
              type="submit"
              sx={{
                mt: 4,
                color: "white",
                bgcolor: "#00b664",
                textTransform: "capitalize",
              }}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </Box> */}

          <Box
            mt={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
          </Box>
        </Paper>
      </Box>

      {/* Image Slider Section */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          justifyContent: "flex-start",
          bgcolor: "#fff",
          borderRadius: 1,
          p: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: 1,
            // maxWidth: 500,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageSlider />
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
