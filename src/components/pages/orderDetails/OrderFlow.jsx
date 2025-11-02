import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const OrderFlow = ({bookingInfo, isStatusUpdated }) => {
  // console.log("Booking info", isStatusUpdated);
  const bookingTime = bookingInfo?.bookingTime;
  let formattedDate = 'Invalid Date';

  if (bookingTime) {
    try {
      formattedDate = format(new Date(bookingTime), 'EEE, dd-MM-yyyy hh:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
    }
  }
  const statuses = [
    { id: 1, name: 'PENDING_MATCH', date: formattedDate },
    { id: 2, name: 'STARTED', date: formattedDate },
    { id: 3, name: 'COMPLETED', date: formattedDate },
    { id: 4, name: 'CANCELLED', date: formattedDate},
  ];
     

  const currentStatus = isStatusUpdated || bookingInfo?.orderStatus;
  const currentStatusIndex = statuses.findIndex(status => status.name === currentStatus);
  
  const activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : 0;
  
    const headingStyles = {
    color: "#1F2A37",
    fontWeight: "600",
    fontSize: "13px",
    lineHeight: "25px",
  };

    const paperStyles ={
    backgroundColor:'#F9FAFB',
    borderRadius:'6px',
    p:3

  }


  return (
    <Stack>
      <Typography sx={headingStyles}>Order Flow</Typography>
      
      <Stack direction="row" justifyContent="space-between" position="relative" sx={paperStyles}>
        <Box sx={{
          position: 'absolute',
          top: '54px',
          left: 0,
          right: 0,
          height: '1.4px',
          backgroundColor: '#e0e0e0',
          zIndex: 1,
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            backgroundColor: '#4caf50',
            width: `${(activeIndex / (statuses.length - 1)) * 100}%`,
            transition: 'width 0.3s ease',
          }
        }} />
        
        {statuses.map((status, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = status.name === bookingInfo?.status;
          
          return (
            <Box key={status.id} sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              // alignItems: 'center',
              zIndex: 2,
              position: 'relative',
            }}>

             {/* Status label */}
              <Typography   textTransform="capitalize"   fontWeight={isCurrent ? 'bold' : 'normal'} fontSize={'13px'}
                color={isCompleted ? '#4caf50' : 'lightgray'}>
                {status.name.toLocaleLowerCase().replace(/_/g, ' ')
                }
              
               </Typography>

              {/* Status indicator */}
              <Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: isCompleted ? '#4caf50' : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                border: isCurrent ? '1px solid #2e7d32' : 'none',
              }}>
                {isCompleted ? (
                  <CircleIcon sx={{ color: isCompleted ?  '#4caf50' :'#e0e0e0', fontSize: 10 }} />
                ) : (
                  <CircleIcon sx={{ color: isCompleted ?  '#4caf50' :'#e0e0e0', fontSize: 10 }} />
                )}
              </Box>
              
             
              
              {/* Date */}
              <Typography 
                variant="caption" 
                color={isCompleted ? 'text.primary' : 'text.secondary'}
                mt={1}
              >
                {status.date}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default OrderFlow;











// import React from 'react';
// import { Box, Stack, Typography } from '@mui/material';
// import { Circle as CircleIcon } from '@mui/icons-material';
// import { format } from 'date-fns';

// const OrderFlow = ({bookingInfo, isStatusUpdated }) => {
//   console.log("Booking info", isStatusUpdated);
//   const bookingTime = bookingInfo?.bookingTime;
//   let formattedDate = 'Invalid Date';

//   if (bookingTime) {
//     try {
//       formattedDate = format(new Date(bookingTime), 'EEE, dd-MM-yyyy hh:mm a');
//     } catch (error) {
//       console.error('Error formatting date:', error);
//     }
//   }
  
//   const statuses = [
//     { id: 1, name: 'PENDING_MATCH', date: formattedDate },
//     { id: 2, name: 'STARTED', date: formattedDate },
//     { id: 3, name: 'COMPLETED', date: formattedDate },
//     { id: 4, name: 'CANCELLED', date: formattedDate },
//   ];
     
//   const currentStatus = isStatusUpdated || bookingInfo?.orderStatus;
//   const currentStatusIndex = statuses.findIndex(status => status.name === currentStatus);
  
//   // Ensure the active index is between 0 (PENDING_MATCH) and 3 (CANCELLED)
//   const activeIndex = Math.max(0, Math.min(currentStatusIndex, statuses.length - 1));
  
//   const headingStyles = {
//     color: "#1F2A37",
//     fontWeight: "600",
//     fontSize: "13px",
//     lineHeight: "25px",
//   };

//   const paperStyles = {
//     backgroundColor: '#F9FAFB',
//     borderRadius: '6px',
//     p: 3
//   };

//   return (
//     <Stack>
//       <Typography sx={headingStyles}>Order Flow</Typography>
      
//       <Stack direction="row" justifyContent="space-between" position="relative" sx={paperStyles}>
//         {/* Progress line */}
//         <Box sx={{
//           position: 'absolute',
//           top: '54px',
//           left: '10%', // Start a bit in from the first circle
//           right: '10%', // End a bit before the last circle
//           height: '1.4px',
//           backgroundColor: '#e0e0e0',
//           zIndex: 1,
//           '&:before': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             height: '100%',
//             backgroundColor: '#4caf50',
//             width: `${(activeIndex / (statuses.length - 1)) * 100}%`,
//             transition: 'width 0.3s ease',
//           }
//         }} />
        
//         {statuses.map((status, index) => {
//           const isCompleted = index <= activeIndex;
//           const isCurrent = index === activeIndex;
          
//           return (
//             <Box key={status.id} sx={{ 
//               display: 'flex', 
//               flexDirection: 'column', 
//               alignItems: 'center',
//               zIndex: 2,
//               position: 'relative',
//               width: '100%', // Ensure equal spacing
//             }}>
//               {/* Status label */}
//               <Typography 
//                 textTransform="capitalize"   
//                 fontWeight={isCurrent ? 'bold' : 'normal'} 
//                 fontSize={'13px'}
//                 color={isCompleted ? '#4caf50' : 'lightgray'}
//                 sx={{ textAlign: 'center' }}
//               >
//                 {status.name.toLowerCase().replace(/_/g, ' ')}
//               </Typography>

//               {/* Status indicator */}
//               <Box sx={{
//                 width: 20,
//                 height: 20,
//                 borderRadius: '50%',
//                 backgroundColor: isCompleted ? '#4caf50' : '#e0e0e0',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 mb: 1,
//                 border: isCurrent ? '2px solid #2e7d32' : 'none',
//               }}>
//                 <CircleIcon sx={{ 
//                   color: 'white', 
//                   fontSize: 10,
//                   visibility: isCompleted ? 'visible' : 'hidden' 
//                 }} />
//               </Box>
              
//               {/* Date */}
//               {/* <Typography 
//                 variant="caption" 
//                 color={isCompleted ? 'text.primary' : 'text.secondary'}
//                 sx={{ textAlign: 'center' }}
//               >
//                 {status.date}
//               </Typography> */}
//             </Box>
//           );
//         })}
//       </Stack>
//     </Stack>
//   );
// };

// export default OrderFlow;
// export default OrderFlow;
