// AppLayout.jsx - Updated version
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import theme from '../../styles/theme';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AppLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for the sidebar open/close status
  // On desktop, sidebar starts open, on mobile it starts closed
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Set sidebar width using CSS variables
  const sidebarWidth = 'min(280px, 25%)';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          bgcolor: '#c3e0ff', 
          minHeight: '100vh',
          position: 'relative',
          // Add a CSS variable to be used throughout the component
          '--sidebar-width': sidebarWidth
        }}
      >
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Header bar with hamburger, notification and profile icons */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: { 
              xs: 0, 
              md: sidebarOpen ? `var(--sidebar-width)`: 0
            },
            right: 0,
            zIndex: 1200,
            display: 'flex',
            justifyContent: 'space-between',
            transition: 'left 0.3s ease',
            padding: '8px 16px',
            backgroundColor: '#c3e0ff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          {/* Hamburger menu button */}
          <IconButton
            aria-label="toggle sidebar"
            onClick={toggleSidebar}
            sx={{
              bgcolor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* User actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              sx={{
                bgcolor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: 40,
                height: 40,
              }}
            >
              <Badge badgeContent={1} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton 
              sx={{
                bgcolor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: 40,
                height: 40,
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Box>
        
        {/* Main content area - Shift when sidebar is open */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: 0,
            // Set margin-left to sidebar width when open
            marginLeft: { 
              xs: 0, 
              md: sidebarOpen ? 'var(--sidebar-width)' : 0 
            },
            // Adjust width to take sidebar into account
            width: { 
              xs: '100%', 
              md: sidebarOpen ? `calc(100% - var(--sidebar-width))` : '100%' 
            },
            // Smooth transition
            transition: 'margin-left 0.3s ease, width 0.3s ease',
          }}
        >
          {/* Content with proper spacing for the hamburger button */}
          <Box sx={{ 
            pt: 5, // Reduced space for fixed header bar
            px: 2
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              pb: 0
            }}>
              <Topbar />
            </Box>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;