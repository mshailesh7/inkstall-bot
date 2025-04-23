import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Paper, Stack, Alert, Snackbar } from '@mui/material';
import { Upload } from '@mui/icons-material';
import { generateQuestions } from '../../../services/apiClient';

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

const GeneratorSetupForm = ({ onSubmit, isGenerating, handleNext }) => {
    // --- State for subjects ---
    const [uploadedFile, setUploadedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState(null);
    const [showPdfPreview, setShowPdfPreview] = useState(false);

    // --- Form State ---
    const [subjectId, setSubjectId] = useState('science'); // Default to Science
    const [range, setRange] = useState('');
    const [numQuestions, setNumQuestions] = useState(10);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(['MCQ', 'Structured']);
    const [difficulty, setDifficulty] = useState('Medium');
    const [paperTitle, setPaperTitle] = useState('');
    const [totalMarks, setTotalMarks] = useState(undefined);
    const [timeLimit, setTimeLimit] = useState(undefined);

    // --- Handle PDF Upload ---
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    // --- Handle Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!uploadedFile) {
            setError("Please upload a textbook PDF file");
            return;
        }
        
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('subject', subjectId);
        formData.append('difficulty', difficulty);
        formData.append('questionTypes', JSON.stringify(selectedQuestionTypes));
        formData.append('numQuestions', numQuestions);
        formData.append('totalMarks', totalMarks || 100);
        formData.append('paperTitle', paperTitle || `${SUBJECTS.find(s => s.id === subjectId).name} Exam`);
        formData.append('range', range);
        
        try {
            const result = await generateQuestions(formData);
            setSuccess(true);
            
            // Store the generated questions for PDF generation
            const questionPaperData = {
                paperTitle: paperTitle || `${SUBJECTS.find(s => s.id === subjectId).name} Exam`,
                subject: SUBJECTS.find(s => s.id === subjectId).name,
                totalMarks: totalMarks || 100,
                timeLimit: timeLimit,
                questions: result.questions || result
            };
            
            setGeneratedQuestions(questionPaperData);
            setShowPdfPreview(true);
            
            // If parent component provided an onSubmit callback, call it with the result
            if (onSubmit && typeof onSubmit === 'function') {
                // Pass the formatted data directly to the parent component
                onSubmit(questionPaperData);
            }
            
            // If parent component provided a handleNext callback, call it
            if (handleNext && typeof handleNext === 'function') {
                handleNext();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate questions. Please try again.");
        } finally {
            setLoading(false);
        }
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
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
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

                    <TextField
                        fullWidth
                        label="Page Range"
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        placeholder="e.g., 1-10 or 15-25"
                        helperText="Enter the page range from your textbook"
                    />

                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Upload Textbook
                        </Typography>
                        <input
                            accept=".pdf"
                            style={{ display: 'none' }}
                            id="textbook-upload"
                            type="file"
                            onChange={handleFileUpload}
                        />
                        <label htmlFor="textbook-upload">
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<Upload />}
                                fullWidth
                            >
                                {uploadedFile ? uploadedFile.name : 'Upload Textbook PDF'}
                            </Button>
                        </label>
                    </Box>

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
