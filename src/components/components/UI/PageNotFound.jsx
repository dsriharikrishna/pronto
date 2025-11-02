import React from 'react';
import { 
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();
  const randomImageId = Math.floor(Math.random() * 1000);
  const imageUrl = `https://picsum.photos/id/${randomImageId}/800/400`;

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2
      }}
    >
      <Card sx={{ width: '100%' }}>
        <CardMedia
          component="img"
          height="240"
          image={imageUrl}
          alt="Random scenery"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400?text=404+Not+Found';
          }}
        />
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h1" component="div" sx={{ fontSize: '4rem', fontWeight: 'bold', mb: 1, color:'info.light' }}>
            404
          </Typography>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Oops! The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate(-1)}
              sx={{ px: 3, py: 1, bgcolor:'#00b664', textTransform:'capitalize' }}
            >
              Go Back
            </Button>
            {/* <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
              sx={{ px: 3, py: 1, border:'1px solid #00b664', textTransform:'capitalize', color:'#00b664' }}
            >
              Home
            </Button> */}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PageNotFound;