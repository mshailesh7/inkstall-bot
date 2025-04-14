// styles/theme.js
import { createTheme } from '@mui/material/styles';

// Theme matching the dashboard image
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Main blue
      light: '#c3e0ff', // Light blue background
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00c4cc', // Teal accent
      light: '#5df7ff',
      dark: '#00939b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#c3e0ff', // Light blue background from the image
      paper: '#ffffff',
    },
    error: {
      main: '#ff3d71',
    },
    warning: {
      main: '#ffaa00',
    },
    info: {
      main: '#0095ff',
    },
    success: {
      main: '#00d68f',
    },
    text: {
      primary: '#2e3a59',
      secondary: '#8f9bb3',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none', // Matches image style without uppercase
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Rounded corners like in the image
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.07)',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: '#1976d2',
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
              borderColor: '#1976d2',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 8,
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;