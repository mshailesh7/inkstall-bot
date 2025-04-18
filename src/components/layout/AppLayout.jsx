// AppLayout.jsx - Updated version
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
      
      {/* Root container */}
      <Box sx={{ height: '100vh', overflow: 'hidden' }}>
        {/* Sidebar - positioned outside the main content flow */}
        <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main content container - includes header and scrollable content */}
        <Box 
          sx={{ 
            height: '100vh',
            marginLeft: { xs: 0, md: sidebarOpen ? 'var(--sidebar-width)' : 0 },
            transition: theme.transitions.create(['margin-left']),
            '--sidebar-width': sidebarWidth,
          }}
        >
          {/* Fixed Header bar with hamburger and notification icons */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: { xs: 0, md: sidebarOpen ? 'var(--sidebar-width)' : 0 },
              right: 0,
              zIndex: 1200,
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 16px',
              backgroundColor: '#c3e0ff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: theme.transitions.create(['left']),
              height: '56px',
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
                <Badge color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton 
                onClick={() => navigate('/settings')}
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
          
          {/* Scrollable Content Area */}
          <Box 
            sx={{ 
              height: '100vh',
              overflow: 'auto',
              bgcolor: '#c3e0ff',
              marginTop: '56px', // Add margin to account for fixed header
              '&::-webkit-scrollbar': {
                width: 8,
              },
              '&::-webkit-scrollbar-track': {
                background: '#e6f2ff',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#a6c8ff',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#84b3ff',
              }
            }}
          >
            <Box sx={{ p: 3 }}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;