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
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={4}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Settings
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80, mr: 2 }}
                alt={profileData.name}
                src="/static/images/avatar/1.jpg"
              />
              <Box>
                <Typography variant="body1">
                  {profileData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profileData.role}
                </Typography>
                <IconButton 
                  color="primary" 
                  aria-label="upload picture" 
                  component="label"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  <input hidden accept="image/*" type="file" />
                  <PhotoCamera fontSize="small" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    Change Photo
                  </Typography>
                </IconButton>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role"
                  value={profileData.role}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                >
                  Save Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Password Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  helperText="Password must be at least 8 characters long"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                  helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<LockIcon />}
                  onClick={handleChangePassword}
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Admin Settings (Optional) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Alert severity="info" sx={{ mb: 2 }}>
              These settings are only available to administrators.
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Google Vision API Key"
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="OpenAI API Key"
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                />
              </Grid>
            </Grid>
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
