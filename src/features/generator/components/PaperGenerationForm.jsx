import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Paper, 
  Stack, 
  Alert, 
  Snackbar,
  CircularProgress,
  Divider,
  LinearProgress
} from '@mui/material';
import axios from 'axios';
import { 
  getAvailableBoards, 
  getAvailableClasses, 
  getAvailableSubjects, 
  getAvailablePaperTypes,
  getPromptTemplate
} from './paperPatterns';

const PaperGenerationForm = ({ onSubmit, isGenerating, pdfText, onFileUpload }) => {
  // Form state
  const [board, setBoard] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [paperType, setPaperType] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  // Options for dropdowns (populated dynamically)
  const [availableBoards, setAvailableBoards] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availablePaperTypes, setAvailablePaperTypes] = useState([]);

  // Reference to store the interval ID
  const progressIntervalRef = useRef(null);

  // Initialize available boards on component mount
  useEffect(() => {
    setAvailableBoards(getAvailableBoards());
  }, []);

  // Update available classes when board changes
  useEffect(() => {
    if (board) {
      setAvailableClasses(getAvailableClasses(board));
      setClassLevel('');
      setSubject('');
      setPaperType('');
    } else {
      setAvailableClasses([]);
    }
  }, [board]);

  // Update available subjects when class changes
  useEffect(() => {
    if (board && classLevel) {
      setAvailableSubjects(getAvailableSubjects(board, classLevel));
      setSubject('');
      setPaperType('');
    } else {
      setAvailableSubjects([]);
    }
  }, [board, classLevel]);

  // Update available paper types when subject changes
  useEffect(() => {
    if (board && classLevel && subject) {
      setAvailablePaperTypes(getAvailablePaperTypes(board, classLevel, subject));
      setPaperType('');
    } else {
      setAvailablePaperTypes([]);
    }
  }, [board, classLevel, subject]);

  // Set default paper title when paper type is selected
  useEffect(() => {
    if (board && classLevel && subject && paperType) {
      setPaperTitle(`${board.toUpperCase()} ${classLevel} ${subject} ${paperType}`);
    }
  }, [board, classLevel, subject, paperType]);

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
      
      // Also check for authToken format (from the login update)
      const authToken = sessionStorage.getItem('authToken');
      if (authToken) {
        return authToken;
      }
      
      return ''; // Return empty string if no token or expired
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return '';
    }
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileSize(`${(selectedFile.size / 1024).toFixed(2)} KB`);
      
      // Create a FileReader to read the file
      const reader = new FileReader();
      reader.onload = (e) => {
        // Call the onFileUpload callback with the file content
        if (onFileUpload) {
          onFileUpload(selectedFile);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!file) {
      setError('Please upload a file');
      return;
    }
    
    if (!board || !classLevel || !subject || !paperType) {
      setError('Please select all options (board, class, subject, and paper type)');
      return;
    }
    
    setLoading(true);
    setError(null);
    setGenerationProgress(0);
    
    // Start the progress interval - increase by 2% every second
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      setGenerationProgress(prev => {
        // Randomize the increment between 1-2% for more genuine appearance
        const randomIncrement = Math.floor(Math.random() * 2) + 1;
        const newProgress = prev + randomIncrement;
        return newProgress >= 98 ? 98 : newProgress;
      });
    }, 1000); // 1000ms = 1 second
    
    // Get the prompt template
    const promptTemplate = getPromptTemplate(board, classLevel, subject, paperType);
    
    if (!promptTemplate) {
      clearInterval(progressIntervalRef.current);
      setError('Failed to get prompt template. Please try different selections.');
      setLoading(false);
      return;
    }
    
    // Get auth token
    const token = getAuthToken();
    
    if (!token) {
      clearInterval(progressIntervalRef.current);
      setError('Authentication token not found. Please log in again.');
      setLoading(false);
      return;
    }
    
    try {
      // Create form data for the API request
      const formData = new FormData();
      formData.append('file', file);
      formData.append('promptTemplate', promptTemplate);
      formData.append('paperTitle', paperTitle);
      formData.append('difficulty', difficulty);
      
    //   console.log('Sending request with token:', token.substring(0, 20) + '...');
      
      // Use relative URL to leverage the Vite proxy configuration
      const response = await axios.post('/api/questions/generate', formData, {
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          // Calculate and update upload progress percentage
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
    //   console.log('API Response:', response.data);
      
      // Set generation progress to 100% when complete
      setGenerationProgress(100);
      clearInterval(progressIntervalRef.current);
      
      setSuccess(true);
      
      // Pass the response to the parent component if needed
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit(response.data);
      }
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(err.response?.data?.message || 'Failed to generate questions. Please try again.');
      clearInterval(progressIntervalRef.current);
    } finally {
      setLoading(false);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Close notifications
  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Question Paper Generator
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* File Upload Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload File
            </Typography>
            
            <Box 
              sx={{ 
                border: '2px dashed #3f51b5', 
                borderRadius: 2, 
                p: 3, 
                textAlign: 'center',
                mb: 2,
                backgroundColor: '#f5f8ff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#eef2ff',
                  borderColor: '#2196f3'
                }
              }}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button 
                  variant="contained" 
                  component="span"
                  sx={{ 
                    mb: 2,
                    backgroundColor: '#3f51b5',
                    '&:hover': {
                      backgroundColor: '#303f9f'
                    }
                  }}
                  startIcon={<span role="img" aria-label="upload">📄</span>}
                >
                  Choose File
                </Button>
              </label>
              
              {fileName ? (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  backgroundColor: '#fff'
                }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    {fileName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {fileSize}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    onClick={() => {
                      setFile(null);
                      setFileName('');
                      setFileSize('');
                    }}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  Drag and drop a file here, or click to select a file
                </Typography>
              )}
            </Box>
          </Box>
          
          <Divider />
          
          {/* Paper Configuration Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Configure Paper
            </Typography>
            
            <Stack spacing={3}>
              <FormControl fullWidth required>
                <InputLabel>Examination Board</InputLabel>
                <Select
                  value={board}
                  label="Examination Board"
                  onChange={(e) => setBoard(e.target.value)}
                >
                  {availableBoards.map((boardOption) => (
                    <MenuItem key={boardOption} value={boardOption}>
                      {boardOption.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth required disabled={!board}>
                <InputLabel>Class/Level</InputLabel>
                <Select
                  value={classLevel}
                  label="Class/Level"
                  onChange={(e) => setClassLevel(e.target.value)}
                >
                  {availableClasses.map((classOption) => (
                    <MenuItem key={classOption} value={classOption}>
                      Class {classOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth required disabled={!classLevel}>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={subject}
                  label="Subject"
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {availableSubjects.map((subjectOption) => (
                    <MenuItem key={subjectOption} value={subjectOption}>
                      {subjectOption.charAt(0).toUpperCase() + subjectOption.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth required disabled={!subject}>
                <InputLabel>Paper Type</InputLabel>
                <Select
                  value={paperType}
                  label="Paper Type"
                  onChange={(e) => setPaperType(e.target.value)}
                >
                  {availablePaperTypes.map((paperTypeOption) => (
                    <MenuItem key={paperTypeOption} value={paperTypeOption}>
                      {paperTypeOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Paper Title"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                required
              />
              
              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={difficulty}
                  label="Difficulty Level"
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
          
          {(loading || isGenerating) && uploadProgress > 0 && uploadProgress < 100 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Uploading and processing: {uploadProgress}%
              </Typography>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={uploadProgress} 
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#3f51b5',
                    },
                    backgroundColor: '#e0e0e0'
                  }}
                />
              </Box>
            </Box>
          )}
          
          {(loading || isGenerating) && generationProgress > 0 && generationProgress < 100 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Generating questions: {generationProgress}%
              </Typography>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={generationProgress} 
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#3f51b5',
                    },
                    backgroundColor: '#e0e0e0'
                  }}
                />
              </Box>
            </Box>
          )}
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || isGenerating || !file || !board || !classLevel || !subject || !paperType}
            sx={{ mt: 2 }}
          >
            {loading || isGenerating ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                {uploadProgress >= 100 ? 'Processing...' : 'Uploading...'}
              </>
            ) : (
              'Generate Paper'
            )}
          </Button>
        </Stack>
      </form>
      
      {/* Success notification */}
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Questions generated successfully!
        </Alert>
      </Snackbar>
      
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

export default PaperGenerationForm;