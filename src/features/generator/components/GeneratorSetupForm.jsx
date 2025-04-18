import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Checkbox,
    ListItemText,
    FormHelperText,
    Typography,
    CircularProgress,
    Chip,
} from '@mui/material';

import { getSubjects } from '../../../services/subjectService';

// --- Constants (Move to a config file later if needed) ---
const AVAILABLE_QUESTION_TYPES = ['MCQ', 'Structured', 'Short Answer', 'Essay', 'Data Response'];
const AVAILABLE_DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard', 'Mixed'];
const AVAILABLE_ASSESSMENT_OBJECTIVES = ['AO1', 'AO2', 'AO3'];

const GeneratorSetupForm = ({ onSubmit, isGenerating, handleNext }) => {
    // --- State for fetched subjects ---
    const [subjects, setSubjects] = useState([]);
    const [subjectsLoading, setSubjectsLoading] = useState(true);
    const [subjectsError, setSubjectsError] = useState(null);

    // --- Form State ---
    const [subjectId, setSubjectId] = useState('');
    const [topics, setTopics] = useState('');
    const [numQuestions, setNumQuestions] = useState(10);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(['MCQ', 'Structured']);
    const [difficulty, setDifficulty] = useState('Medium');
    const [targetAOs, setTargetAOs] = useState([]);
    const [commandWords, setCommandWords] = useState('');
    const [paperTitle, setPaperTitle] = useState('');
    const [totalMarks, setTotalMarks] = useState(undefined);
    const [timeLimit, setTimeLimit] = useState(undefined);

    // --- Fetch Subjects ---
    const fetchSubjectData = useCallback(async () => {
        setSubjectsLoading(true);
        setSubjectsError(null);
        try {
            const data = await getSubjects();
            setSubjects(data);
        } catch (err) {
            setSubjectsError(err.message || 'Failed to load subjects.');
        } finally {
            setSubjectsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjectData();
    }, [fetchSubjectData]);

    // --- Handlers ---
    const handleQuestionTypeChange = (event) => {
        const { target: { value } } = event;
        setSelectedQuestionTypes(typeof value === 'string' ? value.split(',') : value);
    };

    const handleAOChange = (event) => {
        const { target: { value } } = event;
        setTargetAOs(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!subjectId) {
            alert("Please select a subject.");
            return;
        }

        const config = {
            subjectId,
            topics,
            numQuestions: Number(numQuestions),
            questionTypes: selectedQuestionTypes,
            difficulty,
            targetAOs: targetAOs.length > 0 ? targetAOs : undefined,
            commandWords: commandWords.trim() || undefined,
            paperTitle: paperTitle.trim() || `Generated Paper - ${new Date().toLocaleDateString()}`,
            totalMarks: totalMarks ? Number(totalMarks) : undefined,
            timeLimit: timeLimit ? Number(timeLimit) : undefined,
        };
        onSubmit(config);
    };

    const formContent = (
        <Box 
            component="form" 
            onSubmit={handleSubmit}
            className="bg-white rounded-lg"
            sx={{
                width: '100%',
                '@media (max-width: 450px)': {
                    '& .MuiFormLabel-root': {
                        width: '100%',
                        marginBottom: '4px',
                    },
                    '& .MuiInputLabel-shrink': {
                        transform: 'translate(0, -1.5px) scale(0.75)',
                        transformOrigin: 'top left',
                    },
                    '& .MuiFormControl-root .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
                        transform: 'translate(0, 16px) scale(1)',
                    },
                    '& .MuiOutlinedInput-notchedOutline legend': {
                        width: '100%',
                    }
                }
            }}
        >
            {/* <Typography variant="h6" className="text-lg font-medium mb-4 text-center">
                Configure Paper Generation
            </Typography> */}
            <div className="space-y-6">
                {/* Subject and Title - Same Line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormControl 
                        fullWidth 
                        required 
                        error={!!subjectsError || (!subjectsLoading && subjects.length === 0)}
                        className="mb-2"
                        sx={{
                            '@media (max-width: 450px)': {
                                width: '100% !important',
                                maxWidth: '100% !important',
                            }
                        }}
                    >
                        <InputLabel id="subject-select-label">Subject</InputLabel>
                        <Select
                            labelId="subject-select-label"
                            id="subject-select"
                            value={subjectId}
                            label="Subject"
                            onChange={(e) => setSubjectId(e.target.value)}
                            disabled={subjectsLoading || isGenerating}
                            sx={{
                                '@media (max-width: 450px)': {
                                    width: '100% !important',
                                    maxWidth: '100% !important',
                                }
                            }}
                        >
                            {subjectsLoading && <MenuItem value=""><CircularProgress size={20} sx={{ mr: 1}} /> Loading...</MenuItem>}
                            {subjectsError && <MenuItem value="" disabled>{subjectsError}</MenuItem>}
                            {!subjectsLoading && subjects.length === 0 && !subjectsError && <MenuItem value="" disabled>No subjects available</MenuItem>}
                            {subjects.map((subject) => (
                                <MenuItem key={subject.id} value={subject.id}>
                                    {subject.name} ({subject.code})
                                </MenuItem>
                            ))}
                        </Select>
                         {subjectsError && <FormHelperText error>{subjectsError}</FormHelperText>}
                         {!subjectsLoading && subjects.length === 0 && !subjectsError && <FormHelperText>Please add subjects in the 'Subjects & Books' section.</FormHelperText>}
                    </FormControl>
                    <TextField
                        fullWidth
                        id="paper-title"
                        label="Paper Title (Optional)"
                        value={paperTitle}
                        onChange={(e) => setPaperTitle(e.target.value)}
                        disabled={isGenerating}
                        helperText="Defaults if left blank"
                        className="mb-2"
                        sx={{
                            width: '100% !important',
                            maxWidth: '100% !important',
                            '& .MuiInputBase-root': {
                                width: '100% !important',
                                maxWidth: '100% !important',
                            },
                            '@media (max-width: 450px)': {
                                width: '100% !important',
                                maxWidth: '100% !important',
                                '& .MuiInputBase-root': {
                                    width: '100% !important',
                                    maxWidth: '100% !important',
                                }
                            }
                        }}
                    />
                </div>

                {/* Topics and Number of Questions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                        <TextField
                            fullWidth
                            id="topics"
                            label="Topic/Keywords to Cover*"
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            disabled={isGenerating}
                            helperText="Enter comma-separated topics or keywords (e.g., Kinematics, Forces, Newton's Laws)"
                            required
                            sx={{
                                '@media (max-width: 450px)': {
                                    width: '100%'
                                }
                            }}
                            className="mb-0"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <TextField
                            fullWidth
                            required
                            id="num-questions"
                            label="Number of Questions*"
                            type="number"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                            disabled={isGenerating}
                            InputProps={{ inputProps: { min: 1, step: 1 } }}
                            sx={{
                                '@media (max-width: 450px)': {
                                    width: '100%'
                                }
                            }}
                            className="mb-0"
                        />
                    </div>
                </div>

                {/* Question Types and Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormControl fullWidth required>
                        <InputLabel id="question-types-label">Question Types*</InputLabel>
                        <Select
                            labelId="question-types-label"
                            id="question-types-select"
                            multiple
                            value={selectedQuestionTypes}
                            onChange={handleQuestionTypeChange}
                            input={<OutlinedInput label="Question Types*" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} size="small" className="bg-blue-100 text-blue-700" />
                                ))}
                                </Box>
                            )}
                            MenuProps={{
                                PaperProps: { style: { maxHeight: 250 } },
                            }}
                            disabled={isGenerating}
                            className="mb-0"
                        >
                            {AVAILABLE_QUESTION_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                    <Checkbox checked={selectedQuestionTypes.indexOf(type) > -1} />
                                    <ListItemText primary={type} />
                                </MenuItem>
                            ))}
                        </Select>
                        {selectedQuestionTypes.length === 0 && <FormHelperText error>Please select at least one question type.</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth required>
                        <InputLabel id="difficulty-label">Difficulty Level*</InputLabel>
                        <Select
                            labelId="difficulty-label"
                            id="difficulty-select"
                            value={difficulty}
                            label="Difficulty Level*"
                            onChange={(e) => setDifficulty(e.target.value)}
                            disabled={isGenerating}
                            className="mb-0"
                        >
                            {AVAILABLE_DIFFICULTY_LEVELS.map((level) => (
                                <MenuItem key={level} value={level}>{level}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* Assessment Objectives and Command Words */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormControl fullWidth>
                        <InputLabel id="assessment-objectives-label">Assessment Objectives (Optional)</InputLabel>
                        <Select
                            labelId="assessment-objectives-label"
                            id="assessment-objectives-select"
                            multiple
                            value={targetAOs}
                            onChange={handleAOChange}
                            input={<OutlinedInput label="Assessment Objectives (Optional)" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} size="small" />
                                ))}
                                </Box>
                            )}
                            disabled={isGenerating}
                            className="mb-0"
                        >
                            {AVAILABLE_ASSESSMENT_OBJECTIVES.map((ao) => (
                                <MenuItem key={ao} value={ao}>
                                    <Checkbox checked={targetAOs.indexOf(ao) > -1} />
                                    <ListItemText primary={ao} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        id="command-words"
                        label="Command Words (Optional)"
                        value={commandWords}
                        onChange={(e) => setCommandWords(e.target.value)}
                        disabled={isGenerating}
                        helperText="Enter comma-separated command words (e.g., Explain, Compare, Analyze)"
                        sx={{
                            '@media (max-width: 450px)': {
                                width: '100%'
                            }
                        }}
                        className="mb-0"
                    />
                </div>

                {/* Total Marks and Time Limit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                        fullWidth
                        id="total-marks"
                        label="Total Marks (Optional)"
                        type="number"
                        value={totalMarks || ''}
                        onChange={(e) => setTotalMarks(e.target.value)}
                        disabled={isGenerating}
                        InputProps={{ inputProps: { min: 1 } }}
                        sx={{
                            '@media (max-width: 450px)': {
                                width: '100%'
                            }
                        }}
                        className="mb-0"
                    />

                    <TextField
                        fullWidth
                        id="time-limit"
                        label="Time Limit in Minutes (Optional)"
                        type="number"
                        value={timeLimit || ''}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        disabled={isGenerating}
                        InputProps={{ inputProps: { min: 1 } }}
                        sx={{
                            '@media (max-width: 450px)': {
                                width: '100%'
                            }
                        }}
                        className="mb-0"
                    />
                </div>

                {/* Generate Paper Button in bottom right */}
                <div className="flex justify-end mt-6">
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isGenerating}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                    >
                        {isGenerating ? <CircularProgress size={24} /> : 'Generate Paper'}
                    </Button>
                </div>
            </div>
        </Box>
    );

    return (
        <Box className="min-h-screen bg-white py-8 px-4">
            {formContent}
            {/* <div className="mt-6 flex justify-end">
                <Button 
                    variant="contained" 
                    className="bg-black text-white px-6 py-2 hover:bg-gray-800"
                    onClick={handleNext}
                >
                    Next
                </Button>
            </div> */}
        </Box>
    );
};

export default GeneratorSetupForm;
