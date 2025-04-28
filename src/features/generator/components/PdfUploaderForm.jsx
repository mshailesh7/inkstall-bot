import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Stack, 
  Alert, 
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import axios from 'axios';

// Helper function to get the auth token from session storage
const getAuthToken = () => {
  try {
    const tokenData = sessionStorage.getItem('token');
    if (tokenData) {
      const parsedToken = JSON.parse(tokenData);
      // Check if token is still valid
      if (parsedToken.expiry && parsedToken.expiry > Date.now()) {
        return parsedToken.value;
      }
    }
    return ''; // Return empty string if no token or expired
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return '';
  }
};

const PdfUploadForm = ({ onUploadComplete, handleNext }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [range, setRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  // Close the error notification
  const handleCloseError = () => {
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      setError("Please upload a PDF file");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', uploadedFile);
    // Range is not sent to the upload API as per requirements
    
    try {
      // For testing purposes, let's simulate a successful response
      // This will allow you to continue development while the backend is being fixed
      // REMOVE THIS CODE when the backend is working properly
      console.log('Simulating PDF upload and processing...');
      
      // Simulate processing delay (30 seconds instead of 10 minutes for testing)
      await new Promise(resolve => {
        const simulationTime = 30000; // 30 seconds
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + 2; // Increase by 2% for even more gradual progress
            if (newProgress >= 100) {
              clearInterval(interval);
              setTimeout(resolve, 1500); // Give a longer delay after reaching 100%
              return 100;
            }
            return newProgress;
          });
        }, simulationTime / 50); // 50 steps to reach 100%
      });
      
      // Simulate extracted text
      // const sampleExtractedText = "This is sample extracted text from the PDF. It would normally contain the actual content from your PDF document. The backend would process this text and use it to generate questions based on the parameters you specify in the next step.";
      
      // Use this simulated response for development
      // const response = { data: sampleExtractedText };
      // UNCOMMENT THIS CODE when the backend is working properly
      // Upload PDF to the first API endpoint - using the proxy configured in vite.config.js
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getAuthToken()}` // Add bearer token
        },
        // Increase timeout for large files (60 minutes)
        timeout: 60 * 60 * 1000,
        // Set maximum content length to handle large files (500MB)
        maxContentLength: 500 * 1024 * 1024,
        maxBodyLength: 500 * 1024 * 1024,
        // Disable request transformation for large files
        transformRequest: [(data) => data],
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      
      // Extract the text from the response
      const extractedText = response.data;
      setExtractedText(extractedText);
      // console.log('Extracted Text:', extractedText); 
      
      // Pass the extracted text to the parent component
      if (onUploadComplete && typeof onUploadComplete === 'function') {
        onUploadComplete(extractedText, range);
      }
      
      // Move to the next step
      if (handleNext && typeof handleNext === 'function') {
        handleNext();
      }
    } catch (err) {
      console.error('Error uploading PDF:', err);
      setError(err.response?.data?.message || "Failed to upload PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Upload PDF Document
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Upload a PDF document to extract content and generate questions. This process may take up to 10 minutes.
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box sx={{ 
            border: '2px dashed #ccc', 
            borderRadius: 2, 
            p: 3, 
            textAlign: 'center',
            mb: 2,
            bgcolor: uploadedFile ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
          }}>
            <input
              accept="application/pdf"
              style={{ display: 'none' }}
              id="pdf-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="pdf-upload">
              <Button 
                variant="contained" 
                component="span"
                startIcon={<Upload />}
                sx={{ mb: 2 }}
              >
                Select PDF File
              </Button>
            </label>
            
            {uploadedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                {uploadedFile.size > 10 * 1024 * 1024 && (
                  <Alert severity="info" sx={{ mt: 1, textAlign: 'left' }}>
                    Large file detected ({Math.round(uploadedFile.size / (1024 * 1024))} MB). Upload and processing may take longer.
                  </Alert>
                )}
              </Typography>
            )}
          </Box>
          
          <TextField
            fullWidth
            label="Page Range (optional)"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="e.g., 1-10, 15, 20-25"
            helperText="Specify page ranges to extract content from (leave empty for entire document)"
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !uploadedFile}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Processing PDF... This may take up to 10 minutes
              </Box>
            ) : (
              'Upload and Process PDF'
            )}
          </Button>
          
          {loading && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Upload Progress: {uploadProgress}%
              </Typography>
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '8px', 
                  bgcolor: '#eee', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    width: `${uploadProgress}%`, 
                    height: '100%', 
                    bgcolor: 'primary.main',
                    transition: 'width 0.3s ease-in-out'
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                PDF processing may take up to 10 minutes. Please do not close this window.
              </Typography>
            </Box>
          )}
        </Stack>
      </form>
      
      {/* Error notification */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default PdfUploadForm;
