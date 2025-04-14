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
// Remove unused icons
// import SaveIcon from '@mui/icons-material/Save';
// import GetAppIcon from '@mui/icons-material/GetApp';

import GeneratorSetupForm from './components/GeneratorSetupForm';

const subjects = [
  { id: 1, name: 'Physics', code: '0625' },
  { id: 2, name: 'Chemistry', code: '0620' },
  { id: 3, name: 'Biology', code: '0610' },
];

// Remove unused questionTypeOptions or use it in the component
// const questionTypeOptions = [
//   { id: 1, name: 'Multiple Choice' },
//   { id: 2, name: 'Structured' },
//   { id: 3, name: 'Short Answer' },
//   { id: 4, name: 'Essay' },
//   { id: 5, name: 'Data Response' },
// ];

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

  // Remove unused functions or implement them
  // const handleSavePaper = () => {
  //   console.log('Saving paper');
  // };

  // const handleExportPaper = () => {
  //   console.log('Exporting paper as PDF');
  // };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Paper sx={{ p: 3 }}>
            <GeneratorSetupForm
              onSubmit={handleGenerateSubmit}
              isGenerating={loading}
            />
          </Paper>
        );
        
      case 1:
        return (
          <Box>
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
        );
        
      case 2:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Paper Summary</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Title:</strong> {paperConfig?.paperTitle || 'Untitled Paper'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Subject:</strong> {
                    subjects.find(s => s.id.toString() === paperConfig?.subjectId)?.name || 'Not selected'
                  }
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Total Questions:</strong> {questions.length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Total Marks:</strong> {questions.reduce((sum, q) => sum + q.marks, 0)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        );
      
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {generationError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {generationError}
        </Alert>
      )}
      
      <Box sx={{ mt: 4 }}>
        {renderStepContent(activeStep)}
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleNext} disabled={loading}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default PaperGeneratorPage;