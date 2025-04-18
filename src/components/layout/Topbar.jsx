// components/layout/Topbar.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const Topbar = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', // Center on larger screens
      alignItems: 'center', 
      // mb: 4,
      mt: 5
    }}>

      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          fontWeight: 'bold', 
          color: 'text.primary',
          textAlign: 'center', // Center the text
        }}
      >
        {/* Hi John, Welcome Back! 👋 */}
      </Typography>
    </Box>
  );
};

export default Topbar;