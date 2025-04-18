import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';

const SettingsPage = () => {
  const [profileData, setProfileData] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Teacher',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const handleProfileChange = (name, value) => {
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  
  const handlePasswordChange = (name, value) => {
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };
  
  const handleSaveProfile = () => {
    setSnackbar({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success',
    });
  };
  
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New passwords do not match',
        severity: 'error',
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 8 characters long',
        severity: 'error',
      });
      return;
    }
    
    setSnackbar({
      open: true,
      message: 'Password changed successfully',
      severity: 'success',
    });
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };
  
  return (
    <Box sx={{ 
      // bgcolor: '#f0f7ff', 
      minHeight: '100vh', 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start'
    }}>
      <Box sx={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#333',
        mb: 2
      }}>
        Setting
      </Box>
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            height: '100%'
          }}>
            <Typography variant="h6" gutterBottom>
              Profile Settings
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative', mr: 2 }}>
                <Avatar
                  sx={{ 
                    width: 70, 
                    height: 70,
                    bgcolor: '#333'
                  }}
                  alt={profileData.name}
                  src="/static/images/avatar/1.jpg"
                />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {profileData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profileData.role}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    mt: 0.5
                  }}
                >
                  <PhotoCamera fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                  Change Photo
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                Full Name
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                sx={{ 
                  mt: 0.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                Email ID
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                sx={{ 
                  mt: 0.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                Role
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={profileData.role}
                disabled
                sx={{ 
                  mt: 0.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </Box>
            
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveProfile}
              sx={{ 
                bgcolor: '#3f88f5', 
                borderRadius: 1,
                textTransform: 'none',
                px: 2
              }}
            >
              Save Profile
            </Button>
          </Paper>
        </Grid>
        
        {/* Password Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            '@media (max-width: 450px)': {
              // minHeight: '350px',
              height: 'auto'
            }
          }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              
              <Box sx={{ mb: 2, mt: 4 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  variant="outlined"
                  size="small"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  variant="outlined"
                  size="small"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  sx={{ 
                    mb: 0.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                  Password must be at least 8 characters long
                </Typography>
                
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                  size="small"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1
                    }
                  }}
                />
                
                <Button
                  variant="contained"
                  startIcon={<LockIcon />}
                  onClick={handleChangePassword}
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  sx={{ 
                    bgcolor: '#3f88f5', 
                    borderRadius: 1,
                    textTransform: 'none',
                    px: 2
                  }}
                >
                  Change Password
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default SettingsPage;
