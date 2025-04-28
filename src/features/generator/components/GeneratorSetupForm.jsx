import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Paper, Stack, Alert, Snackbar } from '@mui/material';
import { generateQuestions } from '../../../services/apiClient';

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

// Static subject data
const SUBJECTS = [
    { id: 'science', name: 'Science' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' },
    { id: 'computer-science', name: 'Computer Science' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'social-science', name: 'Social Science' }
];

const GeneratorSetupForm = ({ onSubmit, isGenerating, handleNext, extractedText }) => {
    // --- State for form ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState(null);
    const [showPdfPreview, setShowPdfPreview] = useState(false);

    // --- Form State ---
    const [subjectId, setSubjectId] = useState('science'); // Default to Science
    const [numQuestions, setNumQuestions] = useState(10);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(['MCQ', 'Structured']);
    const [difficulty, setDifficulty] = useState('Medium');
    const [paperTitle, setPaperTitle] = useState('');
    const [totalMarks, setTotalMarks] = useState(undefined);
    const [timeLimit, setTimeLimit] = useState(undefined);

    // --- Handle Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('subject', subjectId);
        formData.append('difficulty', difficulty);
        formData.append('questionTypes', JSON.stringify(selectedQuestionTypes));
        formData.append('numQuestions', numQuestions);
        formData.append('totalMarks', totalMarks || 100);
        formData.append('paperTitle', paperTitle || `${SUBJECTS.find(s => s.id === subjectId).name} Exam`);
        formData.append('timeLimit', timeLimit || 60);
        
        // Add authorization token to the form data
        const token = getAuthToken();
        console.log('Token in GeneratorSetupForm:', token ? 'Token exists' : 'No token found');
        // console.log('Token value:', token);
        
        // Log form data for debugging
        // console.log('Form data values:');
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
        
        if (!token) {
            setError("Authentication token not found. Please log in again.");
            setLoading(false);
            return;
        }
        
        // If we have extracted text from PDF, we don't need to upload a file
        if (extractedText) {
            // Pass the form data and token to the parent component
            if (onSubmit && typeof onSubmit === 'function') {
                // Pass token along with form data
                onSubmit(formData, token);
            }
            return;
        }
        
        setLoading(false);
    };

    // Close the success notification
    const handleCloseSuccess = () => {
        setSuccess(false);
    };

    // Close the error notification
    const handleCloseError = () => {
        setError(null);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Configure Paper
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3 }}>
                {extractedText ? 'PDF has been processed. Now set parameters to generate questions.' : 'Set parameters to generate questions from your uploaded PDF.'}
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    {extractedText && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            PDF successfully processed. Text extracted and ready for question generation.
                        </Alert>
                    )}
                    
                    <FormControl fullWidth>
                        <InputLabel>Subject</InputLabel>
                        <Select
                            value={subjectId}
                            label="Subject"
                            onChange={(e) => setSubjectId(e.target.value)}
                        >
                            {SUBJECTS.map((subject) => (
                                <MenuItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Question Types</InputLabel>
                        <Select
                            value={selectedQuestionTypes}
                            label="Question Types"
                            onChange={(e) => setSelectedQuestionTypes(e.target.value)}
                            multiple
                        >
                            <MenuItem value="MCQ">Multiple Choice Questions</MenuItem>
                            <MenuItem value="Structured">Structured Questions</MenuItem>
                            <MenuItem value="Short Answer">Short Answer Questions</MenuItem>
                            <MenuItem value="Essay">Essay Questions</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Number of Questions"
                        type="number"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
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

                    <TextField
                        fullWidth
                        label="Paper Title"
                        value={paperTitle}
                        onChange={(e) => setPaperTitle(e.target.value)}
                        placeholder="Leave blank for default title"
                    />

                    <TextField
                        fullWidth
                        label="Total Marks"
                        type="number"
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(e.target.value)}
                        placeholder="Default: 100"
                    />

                    <TextField
                        fullWidth
                        label="Time Limit (minutes)"
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading || isGenerating}
                    >
                        {loading || isGenerating ? 'Generating...' : 'Generate Paper'}
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

export default GeneratorSetupForm;
