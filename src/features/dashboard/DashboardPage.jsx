// features/dashboard/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import RecentActivity from './RecentActivity';


const DashboardPage = () => {
  const navigate = useNavigate();
  // State to control the intro visibility
  const [showIntro, setShowIntro] = useState(false);
  const [showContent, setShowContent] = useState(true);
  
  // Effect to check if welcome message should be shown (only after login)
  useEffect(() => {
    const shouldShowWelcome = localStorage.getItem('showWelcome') === 'true';
    
    if (shouldShowWelcome) {
      // Show welcome message
      setShowIntro(true);
      setShowContent(false);
      
      // Hide welcome message after 2 seconds
      const introTimer = setTimeout(() => {
        setShowIntro(false);
        setShowContent(true);
        
        // Remove the flag so it doesn't show again until next login
        localStorage.removeItem('showWelcome');
      }, 2000);
      
      return () => clearTimeout(introTimer);
    }
  }, []);
  // Initial timer values
  const timeValues = {
    days: { first: "0", second: "4" },
    hours: { first: "0", second: "6" },
    minutes: { first: "0", second: "8" },
    seconds: { first: "0", second: "9" }
  };
  
  // Mock data for exams
  const upcomingExams = [
    {
      id: 1,
      subject: 'Physics',
      paper: 'Paper 1',
      date: '18 - 5 - 2025',
      students: 30
    },
    {
      id: 2,
      subject: 'Chemistry',
      paper: 'Paper 2',
      date: '21 - 5 - 2025',
      students: 30
    },
    {
      id: 3,
      subject: 'Biology',
      paper: 'Paper 3',
      date: '26 - 5 - 2025',
      students: 30
    },
  ];

  // Timer digit component for consistent styling
  const TimerDigit = ({ digit }) => (
    <Box sx={{ 
      width: { xs: 30, sm: 38 },
      height: { xs: 36, sm: 48 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1976d2',
      fontSize: { xs: '0.9em', sm: '1.08em' },
      fontWeight: 500,
      border: '1px solid #1976d2',
      borderRadius: 1,
      mx: 0
    }}>
      {digit}
    </Box>
  );

  // Timer unit component (days, hours, etc.)
  const TimerUnit = ({ value, label }) => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 0
    }}>
      <Box sx={{ display: 'flex', gap: { xs: 0.4, sm: 0.4 }, mb: 0.5 }}>
        <TimerDigit digit={value.first} />
        <TimerDigit digit={value.second} />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85em', sm: '0.97em' } }}>
        {label}
      </Typography>
    </Box>
  );

  // Action button component
  const ActionButton = ({ icon, text, onClick }) => (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        p: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderRadius: 2,
        '&:hover': {
          bgcolor: '#f9f9f9',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography variant="body1" sx={{ ml: 1, fontWeight: 500, fontSize: '1.08em', color: '#222', fontFamily: 'inherit', textTransform: 'none' }}>
          {text}
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#c3e0ff',
        borderRadius: 1,
        p: 0.5,
      }}>
        <ChevronRightIcon sx={{ color: '#1976d2', fontSize: 18 }} />
      </Box>
    </Button>
  );

  return (
    <Box sx={{ p: 3, pt: 0 }}>
      {/* Intro screen - shows for 2 seconds */}
      {showIntro && (
        <Box 
          sx={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#c3e0ff',
            zIndex: 1500,
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#1976d2',
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            Hey John, Welcome Back
          </Typography>
        </Box>
      )}
      
      {/* Main dashboard content - appears after intro */}
      <Box 
        sx={{ 
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          visibility: showContent ? 'visible' : 'hidden',
        }}
      >

      
        {/* Quick Actions */}
      <Box sx={{ mb: 3, mt: 0 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Quick Actions
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 48%' } }}>
            <ActionButton 
              icon={<AddIcon />} 
              text="Create New Paper" 
              onClick={() => navigate('/generator')} 
            />
          </Box>
          
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 48%' }, display: { xs: 'block', md: 'block' } }}>
            <ActionButton 
              icon={<DescriptionIcon />} 
              
              text="Correct Paper" 
              onClick={() => navigate('/corrections')} 
            />
          </Box>
        </Box>
      </Box>

       {/* Upcoming Exam Schedule */}
       <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Upcoming Exam Schedule
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Next Scheduled Exam Card */}
          <Card sx={{ 
            flex: { xs: '1 1 100%', md: '1 1 48%' }, 
            p: 3, 
            borderRadius: 2,
            backgroundColor: '#e3f2fd', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
                Next Scheduled Exam
              </Typography>
            </Box>
            
            <Box sx={{
              background: '#fff',
              borderRadius: '14px',
              border: '1px solid #e6f0fa',
              boxShadow: '0 1px 4px #e6f0fa',
              padding: { xs: '12px 10px', sm: '18px 20px' },
              mb: 3,
            }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 500, fontSize: '1.08em', mb: 1 }}>
                Physics Paper 1
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '0.97em', color: '#888' }}>
                18 - 5 - 2025
              </Typography>
            </Box>
            
            {/* Timer */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" component="h4" sx={{ fontWeight: 500, fontSize: '1.08em' }}>
                  Time Left
                </Typography>
              </Box>
              
              <Box sx={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #e6f0fa',
                boxShadow: '0 1px 4px #e6f0fa',
                padding: { xs: '12px 10px', sm: '18px 20px' },
                mb: 3,
                display: 'flex',
                justifyContent: 'center',
                '@media (max-width: 570px)': {
                  display: 'block',
                  padding: '12px 16px',
                }
              }}>
                <Box sx={{
                  '@media (min-width: 571px)': {
                    display: 'flex',
                    justifyContent: 'center',
                    gap: { xs: 1, sm: 2 },
                  },
                  '@media (max-width: 570px)': {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: { xs: 1, sm: 2 },
                    textAlign: 'center',
                  }
                }}>
                  {/* Days */}
                  <TimerUnit value={timeValues.days} label="Days" />
                  {/* Hours */}
                  <TimerUnit value={timeValues.hours} label="Hours" />
                  {/* Minutes */}
                  <TimerUnit value={timeValues.minutes} label="Minutes" />
                  {/* Seconds */}
                  <TimerUnit value={timeValues.seconds} label="Seconds" />
                </Box>
              </Box>
            </Box>
            
            <Button
  variant="contained"
  startIcon={<AddIcon />}
  sx={{
    justifyContent: 'space-between',
    p: 2,
    bgcolor: 'background.paper',
    color: 'text.primary',
    border: 'none',
    fontWeight: 500,
    fontSize: '1.08em',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    mt: 2,
    borderRadius: 1,
    textTransform: 'none',
  }}
>
  <span style={{ lineHeight: 1.2 }}>View Exam Details</span>
  <Box
    component="span"
    sx={{
      bgcolor: '#c3e0ff',
      p: 0.5,
      borderRadius: 1,
      display: 'flex',
      color: '#1976d2',
      alignItems: 'center',
      justifyContent: 'center',
      ml: 1.5
    }}
  >
    <ChevronRightIcon style={{ fontSize: '1.4em', color: '#3498ff' }} />
  </Box>
</Button>

          </Card>
          
          {/* Exam Calendar Card */}
          <Card sx={{ 
            flex: { xs: '1 1 100%', md: '1 1 48%' }, 
            p: 3, 
            borderRadius: 2,
            backgroundColor: '#e3f2fd', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            display: { xs: 'block', md: 'block' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
                Exam Calendar
              </Typography>
            </Box>
            
            {/* Exam List */}
            {upcomingExams.map((exam) => (
              <Box 
                key={exam.id} 
                sx={{ 
                  background: '#fff',
                  borderRadius: '14px',
                  border: '1px solid #e6f0fa',
                  boxShadow: '0 1px 4px #e6f0fa',
                  padding: '18px 20px',
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 500, fontSize: '1.08em', color: '#222' }}>
                    {exam.subject} {exam.paper}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.97em', color: '#888' }}>
                      {exam.date}
                    </Typography>
                    <Box component="span" sx={{ mx: 1, fontSize: '0.75rem', color: '#888' }}>•</Box>
                    <Typography sx={{ fontSize: '0.97em', color: '#888' }}>
                      {exam.students} students
                    </Typography>
                  </Box>
                </Box>
                
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: '#c3e0ff', 
                    color: '#1976d2',
                    '&:hover': { bgcolor: '#a9d3ff' }
                  }}
                >
                  <ChevronRightIcon style={{ fontSize: '1.4em', color: '#3498ff' }} />
                </IconButton>
              </Box>
            ))}
            
            <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
  {/* Mobile View */}
  <Button
    variant="outlined"
    sx={{
      display: { xs: 'flex', md: 'none' },
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 10px #e6f0fa',
      border: 'none',
      px: 2.5,
      py: 1.2,
      minWidth: 0,
      mt: 2,
      gap: 1.5,
      textTransform: 'none',
      width: '100%',
      '&:hover': { background: '#f5faff', boxShadow: '0 2px 12px #e6f0fa' }
    }}
  >
    <AddIcon sx={{ fontSize: 22, color: '#1976d2', mr: 1 }} />
    <span style={{ fontSize: '1.08em', fontWeight: 500, color: '#222', fontFamily: 'inherit', lineHeight: 1.2 }}>
      Schedule New Exam
    </span>
    <Box
      component="span"
      sx={{
        bgcolor: '#c3e0ff',
        p: 0.5,
        borderRadius: 1,
        display: 'flex',
        color: '#1976d2',
        ml: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32,
        minHeight: 32
      }}
    >
      <ChevronRightIcon style={{ fontSize: '1.4em', color: '#3498ff' }} />
    </Box>
  </Button>
  {/* Desktop View */}
  <Button
    variant="contained"
    startIcon={<AddIcon />}
    sx={{
      display: { xs: 'none', md: 'flex' },
      justifyContent: 'space-between',
      p: 2,
      bgcolor: 'background.paper',
      color: 'text.primary',
      border: 'none',
      fontWeight: 500,
      fontSize: '1.08em',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      mt: 2,
      borderRadius: 1,
    }}
  >
    <span>Schedule New Exam</span>
    <Box
      component="span"
      sx={{
        bgcolor: '#c3e0ff',
        p: 0.5,
        borderRadius: 1,
        display: 'flex',
        color: '#1976d2',
        ml: 1.5
      }}
    >
      <ChevronRightIcon style={{ fontSize: '1.4em', color: '#3498ff' }} />
    </Box>
  </Button>
</Box>
          </Card>
        </Box>
      </Box>
      <RecentActivity />
      </Box>
    </Box>
  );
};

export default DashboardPage;
 