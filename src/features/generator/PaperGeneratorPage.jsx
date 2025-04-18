import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Grid,
    TextField,
    Card,
    CardHeader,
    CardContent,
    Divider,
    IconButton,
    Alert,
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import GeneratorSetupForm from './components/GeneratorSetupForm';

const subjects = [
  { id: 1, name: 'Physics', code: '0625' },
  { id: 2, name: 'Chemistry', code: '0620' },
  { id: 3, name: 'Biology', code: '0610' },
];

const steps = ['Configure', 'Review Questions', 'Finalize Paper'];

const PaperGeneratorPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [paperConfig, setPaperConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      console.log('Paper generation completed!');
      return;
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleGenerateSubmit = (config) => {
    setPaperConfig(config);
    setLoading(true);
    setGenerationError(null);

    setTimeout(() => {
      try {
        const generatedQuestions = [
          {
            id: 1,
            text: "Explain Newton's First Law of Motion and provide an example from everyday life.",
            modelAnswer: "Newton's First Law states that an object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an external force. Example: A book on a table remains at rest until a force is applied to move it.",
            type: 'Short Answer',
            marks: 5,
            diagram: false
          },
          {
            id: 2,
            text: "Calculate the acceleration of a 2kg object when a force of 10N is applied to it.",
            modelAnswer: "Using F = ma, where F is force, m is mass, and a is acceleration: 10N = 2kg × a, therefore a = 10N ÷ 2kg = 5 m/s²",
            type: 'Structured',
            marks: 3,
            diagram: false
          },
          {
            id: 3,
            text: "Describe the structure of an atom and explain the differences between protons, neutrons, and electrons.",
            modelAnswer: "An atom consists of a nucleus containing protons and neutrons, with electrons orbiting around it. Protons have a positive charge, neutrons have no charge, and electrons have a negative charge. Protons and neutrons have similar mass, while electrons are much lighter.",
            type: 'Essay',
            marks: 8,
            diagram: true
          }
        ];
        
        setQuestions(generatedQuestions);
        setActiveStep(1); 
      } catch (error) {
        setGenerationError('Failed to generate paper. Please try again with different parameters.');
      } finally {
        setLoading(false);
      }
    }, 2000); 
  };

  const handleRegenerateQuestion = (id) => {
    console.log(`Regenerating question with ID: ${id}`);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleAddQuestion = () => {
    console.log('Adding new question');
  };

  const handleQuestionChange = (id, field, value) => {
    const updatedQuestions = [...questions];
    const questionIndex = updatedQuestions.findIndex(q => q.id === id);
    if (questionIndex !== -1) {
      updatedQuestions[questionIndex][field] = value;
      setQuestions(updatedQuestions);
    }
  };

  // Responsive stepper component that shows only the current step on mobile
  const ResponsiveStepper = () => {
    const isMobile = window.matchMedia('(max-width: 450px)').matches;
    
    if (isMobile) {
      // On mobile, show only the current step
      return (
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mb: 3
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              mb: 1
            }}>
              {activeStep + 1}
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {steps[activeStep]}
            </Typography>
          </Box>
        </Box>
      );
    }
    
    // On desktop, show the regular stepper
    return (
      <Stepper 
        activeStep={activeStep} 
        className="mb-6"
        orientation="horizontal"
        sx={{
          '& .MuiStep-root': {
            '& .MuiStepIcon-root': {
              width: '32px',
              height: '32px',
              fontSize: '12px',
            },
            '& .MuiStepLabel-label': {
              fontSize: '0.9rem',
              fontWeight: 500,
            },
          },
          '& .MuiStepConnector-line': {
            height: '2px',
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  };

  return (
    <Box 
      className="min-h-screen" 
      style={{ backgroundColor: "#c3e0ff", border: '1px solid blue' }}
      sx={{
        px: { xs: 1, sm: 3, md: 6 },
        py: { xs: 2, sm: 3, md: 6 }
      }}
    >
      <Box 
        className="bg-white rounded-lg shadow-md"
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mx: { xs: 0, sm: 2, md: 3 },
          width: { xs: '100%', sm: '95%', md: '90%' }
        }}
      >
        {/* <Typography variant="h4" className="text-2xl font-bold mb-8 text-center">
          Paper Generator
        </Typography> */}

        {/* Responsive Stepper */}
        <ResponsiveStepper />

        {/* Responsive Content */}
        {activeStep === 0 && (
          <Box className="space-y-4">
            <GeneratorSetupForm
              onSubmit={handleGenerateSubmit}
              isGenerating={loading}
              handleNext={() => setActiveStep(1)}
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id} sx={{ mb: 3 }}>
                <CardHeader
                  title={`Question ${index + 1}`}
                  subheader={`${question.marks} marks - ${question.type}`}
                  action={
                    <Box>
                      <IconButton 
                        aria-label="regenerate" 
                        onClick={() => handleRegenerateQuestion(question.id)}
                        disabled={loading}
                      >
                        <RefreshIcon />
                      </IconButton>
                      <IconButton 
                        aria-label="delete" 
                        onClick={() => handleDeleteQuestion(question.id)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Question:</Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={6}
                        value={question.text}
                        onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    
                    {question.diagram && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">Diagram:</Typography>
                        <Box sx={{ 
                          height: 150, 
                          bgcolor: 'grey.100', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mb: 2
                        }}>
                          <Typography variant="body2" color="text.secondary">Diagram Placeholder</Typography>
                        </Box>
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Model Answer:</Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={8}
                        value={question.modelAnswer}
                        onChange={(e) => handleQuestionChange(question.id, 'modelAnswer', e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Marks"
                        type="number"
                        value={question.marks}
                        onChange={(e) => handleQuestionChange(question.id, 'marks', parseInt(e.target.value) || 0)}
                        InputProps={{ inputProps: { min: 1 } }}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Add Question
            </Button>
          </Box>
        )}

        {activeStep === 2 && (
          <Box className="space-y-4">
            <Card>
              <CardHeader title="Final Paper Preview" />
              <CardContent>
                <Typography variant="h6" className="font-medium mb-4 text-sm">
                  {paperConfig?.paperTitle || 'Untitled Paper'}
                </Typography>
                <Typography className="mb-2 text-sm">
                  Subject: {
                    subjects.find(s => s.id.toString() === paperConfig?.subjectId)?.name || 'Not selected'
                  }
                </Typography>
                <Typography className="mb-2 text-sm">
                  Number of Questions: {questions.length}
                </Typography>
                <Typography className="mb-2 text-sm">
                  Total Marks: {questions.reduce((sum, q) => sum + q.marks, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Responsive Navigation Buttons */}
        <Box className="flex flex-row justify-between items-center mt-6">
          <Button 
            variant="contained"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            sx={{
              bgcolor: 'black',
              color: 'white',
              '&:hover': {
                bgcolor: 'gray.800'
              },
              padding: '8px 16px',
              fontSize: '0.9rem',
              '@media (max-width: 640px)': {
                padding: '6px 12px',
                fontSize: '0.8rem'
              }
            }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button 
            variant="contained"  
            onClick={handleNext} 
            sx={{
              bgcolor: 'black',
              color: 'white',
              '&:hover': {
                bgcolor: 'gray.800'
              },
              padding: '8px 16px',
              fontSize: '0.9rem',
              '@media (max-width: 640px)': {
                padding: '6px 12px',
                fontSize: '0.8rem'
              }
            }}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PaperGeneratorPage;