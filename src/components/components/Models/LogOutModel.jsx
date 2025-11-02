import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Confetti from 'react-confetti';

const LogOutModel = ({ open, onClose }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    setShowConfetti(true);
    
    setTimeout(() => {
      localStorage.clear(); 
      sessionStorage.clear();
      navigate('/');
      onClose();
      setShowConfetti(false);
      setIsLoggingOut(false);
    }, 1500);
  };

  const friendlyMessages = [
    "We'll miss you! Come back soon!",
    "Your data is safe with us!",
    "Thanks for stopping by!",
    "See you next time!",
    "Don't stay away too long!",
    "You're always welcome back!",
  ];

  const randomMessage = friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)];

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          gravity={0.2}
        />
      )}

      <Dialog
        open={open}
        onClose={isLoggingOut ? null : onClose} 
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'down' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '6px',
            pt:2,
            background: 'linear-gradient(145deg, #f5f7fa 0%, #e4e8f0 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: '600',
            lineHeight:'20px',
            fontSize: isMobile ? '1.25rem' : '1.8rem',
            color: '#00b664',
            // pb: 1,/
          }}
        >
          {isLoggingOut ? 'Logging out...' : 'Ready to log out?'}
        </DialogTitle>

        <DialogContent sx={{ px: isMobile ? 2 : 4 }}>
          <DialogContentText
            sx={{
              textAlign: 'center',
              color: '#4b5563',
              fontSize: isMobile ? '0.9rem' : '1rem',
            //   mb: 2,
            }}
          >
            {isLoggingOut ? (
              <Typography color="text.secondary" fontStyle="italic">
                {randomMessage}
              </Typography>
            ) : (
              <span>Don’t worry — you can always come back and sign in again.</span>
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'center',
            // gap: 2,
            px: 2,
            pb: 2,
          }}
        >
          {!isLoggingOut && (
            <Button
              onClick={onClose}
              startIcon={<CancelRoundedIcon />}
              sx={{
                border: '1px solid #00b664',
                textTransform: 'none',
                color: '#00b664',
                px: 2,
                py: 1,
                borderRadius: '8px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(100, 116, 139, 0.1)',
                },
              }}
            >
              Stay Logged In
            </Button>
          )}

          <Button
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
            startIcon={<LogoutRoundedIcon />}
            sx={{
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: '8px',
              fontWeight: 500,
              backgroundColor: '#00b664',
              color: 'white',
              '&:hover': {
                backgroundColor: '#00b664',
              },
              '&:disabled': {
                backgroundColor: '#cbd5e1',
                color: '#64748b',
              },
            }}
            variant="contained"
          >
            {isLoggingOut ? 'Bye for now!' : 'Yes, Logout'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogOutModel;
