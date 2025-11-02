// import * as React from 'react';
// import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import Typography from '@mui/material/Typography';

// const initialData = {
//   "Pending Match": [
//     {
//       id: "order-1",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//     {
//       id: "order-2",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//     {
//       id: "order-3",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//     {
//       id: "order-4",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//     {
//       id: "order-5",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//     {
//       id: "order-6",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//   ],
//   Started: [],
//   Completed: [],
//   Cancelled: [],
// };

// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialogContent-root': {
//     padding: theme.spacing(2),
//   },
//   '& .MuiDialogActions-root': {
//     padding: theme.spacing(1),
//   },
// }));

// export default function CustomizedDialogs({isOpen, handleClose}) {
//   return (
//     <React.Fragment>
//       <BootstrapDialog
//         onClose={handleClose}
//         aria-labelledby="customized-dialog-title"
//         open={isOpen}
//       >
//         <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
//           Modal title
//         </DialogTitle>
//         <IconButton
//           aria-label="close"
//           onClick={handleClose}
//           sx={(theme) => ({
//             position: 'absolute',
//             right: 8,
//             top: 8,
//             color: theme.palette.grey[500],
//           })}
//         >
//           <CloseIcon />
//         </IconButton>
//         <DialogContent dividers>
//           <Typography gutterBottom>
//             Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
//             dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
//             consectetur ac, vestibulum at eros.
//           </Typography>
//           <Typography gutterBottom>
//             Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
//             Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
//           </Typography>
//           <Typography gutterBottom>
//             Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
//             magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
//             ullamcorper nulla non metus auctor fringilla.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button autoFocus onClick={handleClose}>
//             Save changes
//           </Button>
//         </DialogActions>
//       </BootstrapDialog>
//     </React.Fragment>
//   );
// }





import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

const initialData = {
  "Pending Match": Array(3).fill().map((_, i) => ({
    id: `order-${i+1}`,
    time: "12-May-2025 1:33 AM",
    name: "Vivek Gupta",
    phone: "7674043257",
    address: "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
    task: "Utensils",
    bhk: "3",
    bath: "4",
    balcony: "1",
  })),
  'Started': Array(2).fill().map((_, i) => ({
    id: `order-${i+4}`,
    time: "12-May-2025 1:33 AM",
    name: "Vivek Gupta",
    phone: "7674043257",
    address: "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
    task: "Utensils",
    bhk: "3",
    bath: "4",
    balcony: "1",
  })),
  'Completed': Array(2).fill().map((_, i) => ({
    id: `order-${i+6}`,
    time: "12-May-2025 1:33 AM",
    name: "Vivek Gupta",
    phone: "7674043257",
    address: "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
    task: "Utensils",
    bhk: "3",
    bath: "4",
    balcony: "1",
  })),
  'Cancelled': Array(2).fill().map((_, i) => ({
    id: `order-${i+8}`,
    time: "12-May-2025 1:33 AM",
    name: "Vivek Gupta",
    phone: "7674043257",
    address: "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
    task: "Utensils",
    bhk: "3",
    bath: "4",
    balcony: "1",
  })),
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    minWidth: '600px',
  },
}));

const taskTypes = [
  'Utensils',
  'Bathroom',
  'Kitchen',
  'Full Home',
  'Windows',
  'Fridge',
  'Other'
];

export default function OrderEditModel({ isOpen, handleClose, selectedId }) {
      const [openPicker, setOpenPicker] = React.useState(false);
  // Find the selected order from all categories
  // console.log("Id", selectedId)
  const findOrderById = (id) => {
    for (const category in initialData) {
      const foundOrder = initialData[category].find(order => order.id === id);
      if (foundOrder) return foundOrder;
    }
    return null;
  };

  const selectedOrder = findOrderById(selectedId);
  const [formData, setFormData] = React.useState(selectedOrder || {});

  // Update form data when isSelectedId changes
  React.useEffect(() => {
    if (selectedId) {
      const order = findOrderById(selectedId);
      if (order) {
        setFormData(order);
      }
    }
  }, [selectedId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   const handleTextFieldClick = () => {
    setOpenPicker(true);
  };

   const handleDateTimeChange = (newValue) => {
    if (newValue && newValue.isValid()) {
      const formattedDateTime = newValue.format('DD-MMM-YYYY h:mm A');
      setFormData(prev => ({
        ...prev,
        time: formattedDateTime
      }));
    }
    setOpenPicker(false);
  };

  const handleSubmit = () => {
    // Here you would typically save the data back to your state/API
    console.log('Updated data:', formData);
    handleClose();
  };

  if (!selectedOrder) {
    return (
      <BootstrapDialog onClose={handleClose} open={isOpen}>
        <DialogTitle>Order Not Found</DialogTitle>
        <DialogContent>
          <Typography>No order found with ID: {selectedId}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </BootstrapDialog>
    );
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Edit Order #{formData.id}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column',}}>
          <Typography variant="subtitle1" gutterBottom fontWeight={'bold'} fontSize={'18px'}>
            Customer Information
          </Typography>
          
          <TextField
            label="Name"
            name="name"
            size='small'
            value={formData.name || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Phone"
            name="phone"
            size='small'
            value={formData.phone || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Address"
            name="address"
            size='small'
            value={formData.address || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />

          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle1" gutterBottom  fontWeight={'700'} fontSize={'18px'}>
            Service Details
          </Typography>
          
          <TextField
            select
            label="Task Type"
            name="task"
            size='small'
            value={formData.task || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {taskTypes.map((option) => (
              <MenuItem key={option} value={option} >
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="BHK"
              name="bhk"
              size='small'
              value={formData.bhk || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bathrooms"
              name="bath"
              size='small'
              value={formData.bath || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Balcony"
              name="balcony"
              size='small'
              value={formData.balcony || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Timing Information
          </Typography>

          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticDateTimePicker orientation="landscape"/>
         </LocalizationProvider>
          
          <TextField
            label="Order Time"
            name="time"
            size='small'
            value={formData.time || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            // disabled
          /> */}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDateTimePicker
            open={openPicker}
            onClose={() => setOpenPicker(false)}
            orientation="landscape"
            value={formData.time ? dayjs(formData.time, 'DD-MMM-YYYY h:mm A') : null}
            onChange={handleDateTimeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Order Time"
                name="time"
                size="small"
                value={formData.time || ''}
                fullWidth
                margin="normal"
                sx={{ mt: 2 }}
                onClick={handleTextFieldClick}
                InputProps={{
                  ...params.InputProps,
                //   readOnly: true, // Prevent manual text input
                }}
              />
            )}
          />
        </LocalizationProvider>
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <StaticDateTimePicker
    orientation="landscape"
    value={formData.time ? dayjs(formData.time, 'DD-MMM-YYYY h:mm A') : null}
    onChange={handleDateTimeChange}
  />
</LocalizationProvider>

<TextField
  label="Order Time"
  name="time"
  size="small"
  value={formData.time || ''}
  onChange={handleChange}
  fullWidth
  margin="normal"
  sx={{ mt: 2 }}
/>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

// import * as React from 'react';
// import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import MenuItem from '@mui/material/MenuItem';
// import Box from '@mui/material/Box';
// import Divider from '@mui/material/Divider';

// const initialData = {
//   "Pending Match": [
//     {
//       id: "order-1",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//     {
//       id: "order-2",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//     {
//       id: "order-3",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//     {
//       id: "order-4",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//     {
//       id: "order-5",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//     {
//       id: "order-6",
//       time: "12-May-2025 1:33 AM",
//       name: "Vivek Gupta",
//       phone: "7674043257",
//       address:
//         "D237 Vigyan Vihar, Golf Course Road, near BMW Bird Automotive I, Shushant Lok 2, Sector 56, Gurugram, Ghata, Haryana 122011",
//       task: "Utensils",
//       bhk: "3",
//       bath: "4",
//       balcony: "1",
//     },
//   ],
//   Started: [],
//   Completed: [],
//   Cancelled: [],
// };
// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialogContent-root': {
//     padding: theme.spacing(2),
//   },
//   '& .MuiDialogActions-root': {
//     padding: theme.spacing(1),
//   },
//   '& .MuiDialog-paper': {
//     minWidth: '600px',
//   },
// }));

// const taskTypes = [
//   'Utensils',
//   'Bathroom',
//   'Kitchen',
//   'Full Home',
//   'Windows',
//   'Fridge',
//   'Other'
// ];

// export default function OrderEditModel({ isOpen, handleClose, isSelectedId }) {
//   const [formData, setFormData] = React.useState(initialData || {});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = () => {
//     // Here you would typically save the data back to your state/API
//     console.log('Updated data:', formData);
//     handleClose();
//   };

//   return (
//     <BootstrapDialog
//       onClose={handleClose}
//       aria-labelledby="customized-dialog-title"
//       open={isOpen}
//     >
//       <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
//         Edit Order #{formData.id}
//       </DialogTitle>
//       <IconButton
//         aria-label="close"
//         onClick={handleClose}
//         sx={{
//           position: 'absolute',
//           right: 8,
//           top: 8,
//           color: (theme) => theme.palette.grey[500],
//         }}
//       >
//         <CloseIcon />
//       </IconButton>
//       <DialogContent dividers>
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Customer Information
//           </Typography>
          
//           <TextField
//             label="Name"
//             name="name"
//             value={formData.name || ''}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
          
//           <TextField
//             label="Phone"
//             name="phone"
//             value={formData.phone || ''}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
          
//           <TextField
//             label="Address"
//             name="address"
//             value={formData.address || ''}
//             onChange={handleChange}
//             fullWidth
//             multiline
//             rows={3}
//             margin="normal"
//           />

//           <Divider sx={{ my: 2 }} />

//           <Typography variant="subtitle1" gutterBottom>
//             Service Details
//           </Typography>
          
//           <TextField
//             select
//             label="Task Type"
//             name="task"
//             value={formData.task || ''}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           >
//             {taskTypes.map((option) => (
//               <MenuItem key={option} value={option}>
//                 {option}
//               </MenuItem>
//             ))}
//           </TextField>

//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <TextField
//               label="BHK"
//               name="bhk"
//               value={formData.bhk || ''}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Bathrooms"
//               name="bath"
//               value={formData.bath || ''}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Balcony"
//               name="balcony"
//               value={formData.balcony || ''}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//             />
//           </Box>

//           <Divider sx={{ my: 2 }} />

//           <Typography variant="subtitle1" gutterBottom>
//             Timing Information
//           </Typography>
          
//           <TextField
//             label="Order Time"
//             name="time"
//             value={formData.time || ''}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             disabled
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" color="primary">
//           Save Changes
//         </Button>
//       </DialogActions>
//     </BootstrapDialog>
//   );
// }