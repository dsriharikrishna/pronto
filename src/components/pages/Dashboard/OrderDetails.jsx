import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const OrderDetails = () => {
  return (
    <Box sx={{ p: 1, backgroundColor: "#fff", height: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Orders Details
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center",}}>
        <IconButton>
          <ArrowBack />
        </IconButton>
        <Typography variant="subtitle1">Back</Typography>
      </Box>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Order Over view
      </Typography>

      <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0" }}>
        <Typography>
          <strong>Order id:</strong> 102ca289-dafc-4204-9
        </Typography>
        <Typography>
          <strong>Order Status:</strong> Pending Match
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <WhatsAppIcon color="success" sx={{ mr: 1 }} />
        <Typography variant="body1">Whatsapp</Typography>
        <Chip
          label="Recurring Weekly"
          size="small"
          sx={{ ml: 2, backgroundColor: "#e3f2fd" }}
        />
      </Box>
      </Paper>

      {/* <Divider sx={{ my: 3 }} /> */}

      

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Customer Details
      </Typography>

      <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0" }}>
        <Typography gutterBottom>
          <strong>Nitesh Kumar Reddy</strong>
          <br />
          +91 8756778532
        </Typography>

        <Typography gutterBottom>
          <strong>Saikumar@gmail.com</strong>
          <br />
          GH8, Vigyan Vihar, Sector 56, Gurugram, Haiderpur, Haryana 122011, India
        </Typography>

        <Typography>
          <strong>BHK:</strong> 4, <strong>Bathroom:</strong> 4, <strong>Balcony:</strong> 1
        </Typography>
      </Paper>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Service Details
      </Typography>

      <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Submit Time:</strong> 11:40 am
            </Typography>
            <Typography>
              <strong>Submit Date:</strong> 09 May 2025, Friday
            </Typography>
            <Typography>
              <strong>Service Time:</strong> 08:40 am and 18:30 pm
            </Typography>
            <Typography>
              <strong>Service Date:</strong> 12 May 2025, Friday to 28 May 2025, Sunday
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Status:</strong> Completed
            </Typography>
            <Typography>
              <strong>Service Type:</strong> Bundle Custom(Sun,Mon,Tue,Wed,Thu,Fri,Sat)
            </Typography>
            <Typography>
              <strong>Services:</strong> Laundry, Fan, Stairs, Sweeping, Mopping
            </Typography>
            <Typography>
              <strong>Total Paid:</strong> 11090 ₹
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Main Details
      </Typography>

      <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Name:</strong> Tajeshwari Devi Kakimunari
            </Typography>
            <Typography>
              <strong>Mobile Number:</strong> +91 8796778906
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Worker ID:</strong> 102ca289-dafc-4204-9
            </Typography>
            <Typography>
              <strong>Hub:</strong> Sector 57
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default OrderDetails;