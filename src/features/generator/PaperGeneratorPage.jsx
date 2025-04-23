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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import GeneratorSetupForm from './components/GeneratorSetupForm';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import inkstallLogo from '../../assets/inkstall.png';

const subjects = [
  { id: 1, name: 'Physics', code: '0625' },
  { id: 2, name: 'Chemistry', code: '0620' },
  { id: 3, name: 'Biology', code: '0610' },
];

const steps = ['Configure', 'Edit Questions', 'Finalize Paper'];

// PDF Styles
const styles = StyleSheet.create({
  page: { 
    flexDirection: 'column', 
    backgroundColor: '#ffffff', 
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 10,
    alignSelf: 'center'
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Helvetica'
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica'
  },
  questionSection: {
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    fontFamily: 'Helvetica'
  },
  questionContainer: {
    marginBottom: 15
  },
  question: {
    fontSize: 11,
    marginBottom: 5,
    fontFamily: 'Helvetica'
  },
  marks: {
    fontSize: 10,
    fontStyle: 'italic',
    fontFamily: 'Helvetica'
  },
  options: {
    marginLeft: 20,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  option: {
    marginBottom: 3
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    paddingTop: 10,
    borderTop: 1,
    fontSize: 8,
    fontFamily: 'Helvetica',
    fontStyle: 'italic'
  }
});

// PDF Document component
const QuestionPaperPDF = ({ data }) => {
  // Group questions by type
  const mcqQuestions = data.questions.filter(q => q.type === 'MCQ');
  const shortAnswerQuestions = data.questions.filter(q => q.type === 'Short Answer');
  const structuredQuestions = data.questions.filter(q => q.type === 'Structured');
  const essayQuestions = data.questions.filter(q => q.type === 'Essay');
  
  // Function to render a group of questions
  const renderQuestionGroup = (questions, startIndex) => {
    return questions.map((q, index) => (
      <View key={index.toString()} style={styles.questionContainer}>
        <Text style={styles.question}>
          {startIndex + index + 1}. {q.question || q.text} [{q.marks} marks]
        </Text>
        {q.type === 'MCQ' && q.options && (
          <View style={styles.options}>
            {q.options.map((option, optIndex) => (
              <Text key={optIndex.toString()} style={styles.option}>
                {String.fromCharCode(97 + optIndex)}. {option}
              </Text>
            ))}
          </View>
        )}
      </View>
    ));
  };
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image style={styles.logo} src={inkstallLogo} />
            <Text style={styles.title}>{data.paperTitle || "Question Paper"}</Text>
            <Text style={styles.subHeader}>Subject: {data.subject}</Text>
            <Text style={styles.subHeader}>Total Marks: {data.totalMarks}</Text>
            {data.timeLimit && (
              <Text style={styles.subHeader}>Duration: {data.timeLimit} minutes</Text>
            )}
          </View>
        </View>
        
        <View style={styles.questionSection}>
          {mcqQuestions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Section A: Multiple Choice Questions</Text>
              {renderQuestionGroup(mcqQuestions, 0)}
            </>
          )}
          
          {shortAnswerQuestions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Section B: Short Answer Questions</Text>
              {renderQuestionGroup(shortAnswerQuestions, mcqQuestions.length)}
            </>
          )}
          
          {structuredQuestions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Section C: Structured Questions</Text>
              {renderQuestionGroup(structuredQuestions, mcqQuestions.length + shortAnswerQuestions.length)}
            </>
          )}
          
          {essayQuestions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Section D: Essay Questions</Text>
              {renderQuestionGroup(essayQuestions, mcqQuestions.length + shortAnswerQuestions.length + structuredQuestions.length)}
            </>
          )}
        </View>
      </Page>
    </Document>
  );
};

const PaperGeneratorPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [paperConfig, setPaperConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState({
    id: 0,
    text: '',
    modelAnswer: '',
    type: 'MCQ',
    marks: 2,
    options: ['', '', '', ''],
    correctAnswer: '',
    diagram: false
  });
  
  // PDF preview data
  const [pdfData, setPdfData] = useState({
    paperTitle: 'Question Paper',
    subject: 'General',
    totalMarks: 0,
    timeLimit: 60,
    questions: []
  });

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

  const handleGenerateSubmit = (formData) => {
    // If formData is a FormData object (from the form), extract the config
    // If it's already processed data (from the API response), use it directly
    const isProcessedData = formData.questions !== undefined;
    
    if (isProcessedData) {
      // This is already processed data from the API
      const questionData = formData;
      
      // Extract paper configuration
      const config = {
        paperTitle: questionData.paperTitle || 'Untitled Paper',
        subjectId: questionData.subject || '',
        totalMarks: questionData.totalMarks || 100,
        timeLimit: questionData.timeLimit || 60
      };
      
      setPaperConfig(config);
      
      // Transform questions to match the expected format
      const formattedQuestions = questionData.questions.map((q, index) => ({
        id: index + 1,
        text: q.question || q.text,
        modelAnswer: q.answer || q.correctAnswer || q.modelAnswer || '',
        type: q.type || 'Short Answer',
        marks: q.marks || 2,
        diagram: false,
        options: q.options || []
      }));
      
      // Sort questions by type: MCQs first, then Short Answer, then others
      const sortedQuestions = [...formattedQuestions].sort((a, b) => {
        // Define the order of question types
        const typeOrder = {
          'MCQ': 1,
          'Short Answer': 2,
          'Structured': 3,
          'Essay': 4
        };
        
        // Get the order value for each question type, defaulting to a high number for unknown types
        const orderA = typeOrder[a.type] || 999;
        const orderB = typeOrder[b.type] || 999;
        
        // Sort by type order
        return orderA - orderB;
      });
      
      // Reassign IDs based on the new order
      const reindexedQuestions = sortedQuestions.map((q, index) => ({
        ...q,
        id: index + 1
      }));
      
      // Store all generated questions
      setGeneratedQuestions(reindexedQuestions);
      
      // Set up PDF data
      setPdfData({
        paperTitle: config.paperTitle,
        subject: subjects.find(s => s.id.toString() === config.subjectId)?.name || 'General',
        totalMarks: config.totalMarks,
        timeLimit: config.timeLimit,
        questions: [] // Start with empty questions array
      });
      
      // Set the first question as current
      if (reindexedQuestions.length > 0) {
        setCurrentQuestion(reindexedQuestions[0]);
        setCurrentQuestionIndex(0);
      }
      
      setActiveStep(1); // Move to question editing step
    }
  };

  const addQuestion = () => {
    // Add current question to the PDF preview
    const updatedQuestions = [...questions, currentQuestion];
    setQuestions(updatedQuestions);

    // Update PDF data with the new question
    const updatedPdfData = {
      ...pdfData,
      questions: [...pdfData.questions, currentQuestion],
      totalMarks: pdfData.questions.reduce((sum, q) => sum + q.marks, 0) + currentQuestion.marks
    };
    setPdfData(updatedPdfData);

    // Move to the next question from generated questions
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < generatedQuestions.length) {
      setCurrentQuestion(generatedQuestions[nextIndex]);
      setCurrentQuestionIndex(nextIndex);
    } else {
      // If no more generated questions, prepare a new empty question
      const newQuestion = {
        id: questions.length + 1,
        text: '',
        modelAnswer: '',
        type: 'MCQ',
        marks: 2,
        options: ['', '', '', ''],
        correctAnswer: '',
        diagram: false
      };
      setCurrentQuestion(newQuestion);
    }
  };

  const handleRegenerateQuestion = (id) => {
    console.log(`Regenerating question with ID: ${id}`);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
    
    // Update PDF data
    setPdfData({
      ...pdfData,
      questions: pdfData.questions.filter(q => q.id !== id)
    });
  };

  const handleQuestionEdit = (editedQuestion) => {
    const updatedQuestions = questions.map(q => 
      q.id === editedQuestion.id ? editedQuestion : q
    );
    setQuestions(updatedQuestions);

    // Update PDF data with the edited question
    const updatedPdfData = {
      ...pdfData,
      questions: updatedQuestions
    };
    setPdfData(updatedPdfData);

    // Prepare the next question for editing
    const nextQuestion = {
      id: questions.length + 1,
      text: '',
      modelAnswer: '',
      type: 'MCQ',
      marks: 2,
      options: ['', '', '', ''],
      correctAnswer: '',
      diagram: false
    };
    setCurrentQuestion(nextQuestion);
  };

  const handleAddQuestion = () => {
    // Add the current question to the PDF preview
    if (currentQuestion.text.trim() === '') {
      alert("Please enter a question text");
      return;
    }
    
    // Check if the question is already in the PDF
    const existingIndex = pdfData.questions.findIndex(q => q.id === currentQuestion.id);
    
    if (existingIndex !== -1) {
      // Update existing question
      const updatedQuestions = [...pdfData.questions];
      updatedQuestions[existingIndex] = {...currentQuestion};
      
      setPdfData({
        ...pdfData,
        questions: updatedQuestions,
        totalMarks: updatedQuestions.reduce((sum, q) => sum + q.marks, 0)
      });
    } else {
      // Add new question
      setPdfData({
        ...pdfData,
        questions: [...pdfData.questions, {...currentQuestion}],
        totalMarks: pdfData.questions.reduce((sum, q) => sum + q.marks, 0) + currentQuestion.marks
      });
    }
    
    // Clear the current question or prepare for the next one
    const nextQuestionIndex = questions.findIndex(q => q.id === currentQuestion.id) + 1;
    
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestion(questions[nextQuestionIndex]);
    } else {
      // Create a new empty question
      setCurrentQuestion({
        id: pdfData.questions.length + 1,
        text: '',
        modelAnswer: '',
        type: 'MCQ',
        marks: 2,
        options: ['', '', '', ''],
        correctAnswer: '',
        diagram: false
      });
    }
  };
  
  const handleEditQuestion = (id) => {
    const questionToEdit = pdfData.questions.find(q => q.id === id);
    if (questionToEdit) {
      setCurrentQuestion(questionToEdit);
    }
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  // Responsive stepper component that shows only the current step on mobile
  const ResponsiveStepper = () => {
    return (
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        sx={{
          mb: 4,
          '@media (max-width: 600px)': {
            '& .MuiStepLabel-labelContainer': {
              display: { xs: 'none', sm: 'block' }
            },
            '& .MuiStepConnector-root': {
              display: { xs: 'none', sm: 'block' }
            },
            '& .MuiStep-root': {
              display: { xs: 'none', sm: 'flex' },
              '&.Mui-active': {
                display: 'flex'
              }
            }
          }
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
    <Box className="min-h-screen bg-gray-50 py-8 px-4">
      <Box className="max-w-6xl mx-auto">
        <Typography variant="h4" className="text-2xl font-bold mb-6 text-center">
          Question Paper Generator
        </Typography>
        
        <ResponsiveStepper />
        
        {/* Step 1: Configure */}
        {activeStep === 0 && (
          <GeneratorSetupForm 
            onSubmit={handleGenerateSubmit} 
            isGenerating={loading} 
            handleNext={handleNext}
          />
        )}

        {/* Step 2: Edit Questions */}
        {activeStep === 1 && (
          <Grid container spacing={3}>
            {/* Left Container: Question Editor */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Question Editor
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Question Text"
                    multiline
                    minRows={2}
                    value={currentQuestion.text}
                    onChange={(e) => handleQuestionChange('text', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Question Type</InputLabel>
                        <Select
                          value={currentQuestion.type}
                          label="Question Type"
                          onChange={(e) => handleQuestionChange('type', e.target.value)}
                        >
                          <MenuItem value="MCQ">Multiple Choice</MenuItem>
                          <MenuItem value="Short Answer">Short Answer</MenuItem>
                          <MenuItem value="Structured">Structured</MenuItem>
                          <MenuItem value="Essay">Essay</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Marks"
                        type="number"
                        value={currentQuestion.marks}
                        onChange={(e) => handleQuestionChange('marks', parseInt(e.target.value) || 0)}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Grid>
                  </Grid>
                  
                  {currentQuestion.type === 'MCQ' && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Options:
                      </Typography>
                      {currentQuestion.options.map((option, index) => (
                        <TextField
                          key={index}
                          fullWidth
                          label={`Option ${String.fromCharCode(97 + index)}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          sx={{ mb: 1 }}
                        />
                      ))}
                      <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel>Correct Answer</InputLabel>
                        <Select
                          value={currentQuestion.correctAnswer}
                          label="Correct Answer"
                          onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                        >
                          {currentQuestion.options.map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {String.fromCharCode(97 + index)}. {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                  
                  <TextField
                    fullWidth
                    label="Model Answer"
                    multiline
                    minRows={3}
                    value={currentQuestion.modelAnswer}
                    onChange={(e) => handleQuestionChange('modelAnswer', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addQuestion}
                      startIcon={<AddIcon />}
                    >
                      {currentQuestionIndex < generatedQuestions.length - 1 ? 'Add Next Question' : 'Add Question'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => {
                        // Clear current question
                        setCurrentQuestion({
                          id: questions.length + 1,
                          text: '',
                          modelAnswer: '',
                          type: 'MCQ',
                          marks: 2,
                          options: ['', '', '', ''],
                          correctAnswer: '',
                          diagram: false
                        });
                      }}
                    >
                      Clear
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            {/* Right Container: PDF Preview */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Paper Preview
                  </Typography>
                  
                  {pdfData.questions.length > 0 && (
                    <PDFDownloadLink
                      document={<QuestionPaperPDF data={pdfData} />}
                      fileName={`${pdfData.paperTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`}
                      style={{ textDecoration: 'none' }}
                    >
                      {({ loading: pdfLoading }) => (
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={pdfLoading}
                          size="small"
                        >
                          {pdfLoading ? 'Preparing PDF...' : 'Download PDF'}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  )}
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h5">
                    {pdfData.paperTitle}
                  </Typography>
                  <Typography variant="subtitle1">
                    Subject: {pdfData.subject}
                  </Typography>
                  <Typography variant="subtitle2">
                    Total Marks: {pdfData.totalMarks} | Time: {pdfData.timeLimit} minutes
                  </Typography>
                </Box>
                
                <Box sx={{ maxHeight: '500px', overflow: 'auto', p: 1 }}>
                  {pdfData.questions.length === 0 ? (
                    <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                      No questions added yet. Use the editor on the left to add questions.
                    </Typography>
                  ) : (
                    pdfData.questions.map((q, index) => (
                      <Box key={q.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography sx={{ flex: 1 }}>
                            <strong>{index + 1}. {q.text}</strong> [{q.marks} marks]
                          </Typography>
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditQuestion(q.id)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteQuestion(q.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        {q.type === 'MCQ' && q.options && (
                          <Box sx={{ ml: 3, mt: 1 }}>
                            {q.options.map((option, optIndex) => (
                              <Typography key={optIndex} sx={{ mb: 0.5 }}>
                                {String.fromCharCode(97 + optIndex)}. {option}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Box className="space-y-4">
            <Card>
              <CardHeader title="Final Paper Preview" />
              <CardContent>
                <Typography variant="h6" className="font-medium mb-4 text-sm">
                  {pdfData.paperTitle}
                </Typography>
                <Typography className="mb-2 text-sm">
                  Subject: {pdfData.subject}
                </Typography>
                <Typography className="mb-2 text-sm">
                  Number of Questions: {pdfData.questions.length}
                </Typography>
                <Typography className="mb-2 text-sm">
                  Total Marks: {pdfData.totalMarks}
                </Typography>
                
                <Box sx={{ mt: 4 }}>
                  <PDFDownloadLink
                    document={<QuestionPaperPDF data={pdfData} />}
                    fileName={`${pdfData.paperTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`}
                    style={{ textDecoration: 'none' }}
                  >
                    {({ loading: pdfLoading }) => (
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={pdfLoading}
                        size="large"
                        fullWidth
                      >
                        {pdfLoading ? 'Preparing PDF...' : 'Download Final PDF'}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </Box>
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