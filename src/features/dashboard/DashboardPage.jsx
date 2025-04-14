// features/dashboard/DashboardPage.jsx
import React, { useState } from 'react';
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

const DashboardPage = () => {
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
      width: 38,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1976d2',
      fontSize: 24,
      fontWeight: 'bold',
      border: '1px solid #1976d2',
      borderRadius: 1,
      mx: 0.5
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
      mx: 1
    }}>
      <Box sx={{ display: 'flex', mb: 0.5 }}>
        <TimerDigit digit={value.first} />
        <TimerDigit digit={value.second} />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14 }}>
        {label}
      </Typography>
    </Box>
  );

  // Action button component
  const ActionButton = ({ icon, text, onClick }) => (
    <Button
      variant="contained"
      startIcon={icon}
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
        <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>
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
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Quick Actions
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 48%' } }}>
            <ActionButton 
              icon={<AddIcon />} 
              text="Create New Paper" 
              onClick={() => console.log('Create New Paper')} 
            />
          </Box>
          
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 48%' }, display: { xs: 'none', md: 'block' } }}>
            <ActionButton 
              icon={<DescriptionIcon />} 
              text="Correct Paper" 
              onClick={() => console.log('Correct Paper')} 
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
            backgroundColor: 'white', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Next Scheduled Exam
              </Typography>
            </Box>
            
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              Physics Paper 1
            </Typography>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 3, color: 'text.secondary' }}>
              18 - 5 - 2025
            </Typography>
            
            {/* Timer */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" component="h4" sx={{ fontWeight: 600 }}>
                  Time Left
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <TimerUnit value={timeValues.days} label="Days" />
                <TimerUnit value={timeValues.hours} label="Hours" />
                <TimerUnit value={timeValues.minutes} label="Minutes" />
                <TimerUnit value={timeValues.seconds} label="Seconds" />
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ 
                justifyContent: 'space-between', 
                p: 1.5, 
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: 'none',
                fontWeight: 'bold',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                borderRadius: 1,
              }}
            >
              <span>View Exam Details</span>
              <Box 
                component="span" 
                sx={{ 
                  bgcolor: '#c3e0ff', 
                  p: 0.5, 
                  borderRadius: 1, 
                  display: 'flex', 
                  color: '#1976d2'
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </Box>
            </Button>
          </Card>
          
          {/* Exam Calendar Card */}
          <Card sx={{ 
            flex: { xs: '1 1 100%', md: '1 1 48%' }, 
            p: 3, 
            borderRadius: 2,
            backgroundColor: 'white', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            display: { xs: 'none', md: 'block' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Exam Calendar
              </Typography>
            </Box>
            
            {/* Exam List */}
            {upcomingExams.map((exam) => (
              <Box 
                key={exam.id} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  p: 1.5, 
                  mb: 1.5, 
                  bgcolor: 'white', 
                  borderRadius: 1,
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {exam.subject} {exam.paper}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, color: 'text.secondary' }}>
                    <Typography variant="body2">
                      {exam.date}
                    </Typography>
                    <Box component="span" sx={{ mx: 1, fontSize: '0.75rem' }}>•</Box>
                    <Typography variant="body2">
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
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ 
                justifyContent: 'space-between', 
                p: 1.5, 
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: 'none',
                fontWeight: 'bold',
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
                  color: '#1976d2'
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </Box>
            </Button>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;