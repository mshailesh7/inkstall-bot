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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import PaperGenerationForm from './components/PaperGenerationForm';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import inkstallLogo from '../../assets/inkstall.png';
import axios from 'axios';

const steps = ['Configure & Upload', 'Edit Questions', 'Finalize Paper'];

// PDF Styles
const styles = StyleSheet.create({
  page: { 
    flexDirection: 'column', 
    backgroundColor: '#ffffff', 
    padding: 30,
    fontFamily: 'Times-Roman'
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
    fontFamily: 'Times-Roman'
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Times-Roman'
  },
  questionSection: {
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    fontFamily: 'Times-Roman'
  },
  questionContainer: {
    marginBottom: 15
  },
  question: {
    fontSize: 11,
    marginBottom: 5,
    fontFamily: 'Times-Roman'
  },
  marks: {
    fontSize: 10,
    fontStyle: 'italic',
    fontFamily: 'Times-Roman'
  },
  options: {
    marginLeft: 20,
    fontSize: 10,
    fontFamily: 'Times-Roman'
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
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 8,
    fontFamily: 'Times-Roman',
    fontStyle: 'italic'
  },
  footerLogo: {
    width: 50,
    height: 25,
    opacity: 0.7
  },
  instructionsSection: {
    marginTop: 20
  },
  instruction: {
    fontSize: 10,
    marginBottom: 5,
    fontFamily: 'Times-Roman'
  },
  bestOfLuck: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Times-Roman'
  },
  questionsHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Times-Roman'
  }
});

// Ultra basic PDF Document component - hardcoded for maximum stability
const QuestionPaperPDF = ({ data }) => {
  // Make extra sure we have data
  if (!data || !data.questions) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No valid data available could be the AI error please try again or contact the devepoler for enhancement</Text>
        </Page>
      </Document>
    );
  }
  
  // Extract the paper info safely
  const paperTitle = data.paper?.title || "IGCSE Question Paper";
  const paperCode = data.paper?.code || "";
  const paperTier = data.paper?.tier || "";
  const paperTime = data.paper?.duration_minutes || 45;
  const paperMarks = data.paper?.total_marks || 40;
  
  // Get the questions array safely
  const questions = Array.isArray(data.questions) ? data.questions : [];
  
  // Create a document with dynamic pages
  return (
    <Document>
      {/* First page with header, instructions, and first set of questions */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image src={inkstallLogo} style={styles.logo} />
            <Text style={styles.title}>{paperTitle}</Text>
            <Text style={styles.subHeader}>Paper Code: {paperCode}</Text>
            <Text style={styles.subHeader}>Tier: {paperTier}</Text>
            <Text style={styles.subHeader}>
              Time: {paperTime} minutes | Total Marks: {paperMarks}
            </Text>
          </View>
        </View>
        
        {/* Instructions Section */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>INSTRUCTIONS TO CANDIDATES</Text>
          {Array.isArray(data.paper?.instructions) && 
            data.paper.instructions.map((instr, i) => (
              <Text key={i} style={styles.instruction}>• {instr}</Text>
            ))
          }
        </View>
        
        {/* Information Section */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>INFORMATION FOR CANDIDATES</Text>
          {Array.isArray(data.paper?.information) && 
            data.paper.information.map((info, i) => (
              <Text key={i} style={styles.instruction}>• {info}</Text>
            ))
          }
        </View>
        
        {/* Questions Heading */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>QUESTIONS</Text>
        </View>
        
        {/* Footer with page numbers and logo */}
        <View fixed style={styles.footer}>
          <Image src={inkstallLogo} style={styles.footerLogo} />
          <Text style={styles.footerText}>Page <Text render={({ pageNumber }) => `${pageNumber}`} /></Text>
        </View>
      </Page>

      {/* Content pages with questions */}
      <Page size="A4" style={styles.page} wrap>
        {/* Questions Section - All questions in one continuous flow */}
        <View style={styles.questionSection}>
          {questions.map((q, i) => {
            const questionNumber = i + 1;
            return (
              <View key={i} style={styles.questionContainer} wrap={false}>
                <Text style={styles.question}>
                  {q.number || questionNumber}. {q.question || ""}
                </Text>
                
                {/* Only render options for multiple-choice questions */}
                {q.options && (q.options.A || q.options.B || q.options.C || q.options.D) && (
                  <View style={styles.options}>
                    {q.options.A && <Text style={styles.option}>A. {q.options.A}</Text>}
                    {q.options.B && <Text style={styles.option}>B. {q.options.B}</Text>}
                    {q.options.C && <Text style={styles.option}>C. {q.options.C}</Text>}
                    {q.options.D && <Text style={styles.option}>D. {q.options.D}</Text>}
                  </View>
                )}
              </View>
            );
          })}
          
          {/* Best of Luck message */}
          <Text style={styles.bestOfLuck}>*******All The Best*******</Text>
        </View>
        
        {/* Footer with page numbers and logo - fixed to appear on all pages */}
        <View fixed style={styles.footer}>
          <Image src={inkstallLogo} style={styles.footerLogo} />
          <Text style={styles.footerText}>Page <Text render={({ pageNumber }) => `${pageNumber}`} /></Text>
        </View>
      </Page>
    </Document>
  );
};

// Answer key PDF component
const AnswerKeyPDF = ({ data }) => {
  // Make extra sure we have data
  if (!data || !data.questions) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No valid data available</Text>
        </Page>
      </Document>
    );
  }
  
  // Extract the paper info safely
  const paperTitle = data.paper?.title || "IGCSE Answer Key";
  const paperCode = data.paper?.code || "";
  const paperTier = data.paper?.tier || "";
  
  // Get the questions array safely
  const questions = Array.isArray(data.questions) ? data.questions : [];
  
  // Create a document with dynamic pages for answer key
  return (
    <Document>
      {/* First page with header */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image src={inkstallLogo} style={styles.logo} />
            <Text style={styles.title}>{paperTitle} - ANSWER KEY</Text>
            <Text style={styles.subHeader}>Paper Code: {paperCode}</Text>
            <Text style={styles.subHeader}>Tier: {paperTier}</Text>
          </View>
        </View>
        
        {/* Footer with logo - fixed to appear on all pages */}
        <View fixed style={styles.footer}>
          <Image src={inkstallLogo} style={styles.footerLogo} />
          <Text style={styles.footerText}>Page <Text render={({ pageNumber }) => `${pageNumber}`} /></Text>
        </View>
      </Page>

      {/* Content page with answers */}
      <Page size="A4" style={styles.page} wrap>
        {/* Questions Section */}
        <View style={styles.questionSection}>
          {questions.map((q, i) => {
            const questionNumber = i + 1;
            return (
              <View key={i} style={styles.questionContainer} wrap={false}>
                <Text style={styles.question}>
                  {q.number || questionNumber}. {q.question || ""}
                </Text>
                
                {/* Only render options for multiple-choice questions - display options first */}
                {q.options && (q.options.A || q.options.B || q.options.C || q.options.D) && (
                  <View style={styles.options}>
                    {q.options.A && <Text style={styles.option}>A. {q.options.A}</Text>}
                    {q.options.B && <Text style={styles.option}>B. {q.options.B}</Text>}
                    {q.options.C && <Text style={styles.option}>C. {q.options.C}</Text>}
                    {q.options.D && <Text style={styles.option}>D. {q.options.D}</Text>}
                  </View>
                )}
                
                {/* Display answer after options */}
                <Text style={[styles.question, { fontWeight: 'bold', marginTop: 5 }]}>
                  Answer: {q.answer || ""}
                </Text>
              </View>
            );
          })}
        </View>
        
        {/* Footer with logo - fixed to appear on all pages */}
        <View fixed style={styles.footer}>
          <Image src={inkstallLogo} style={styles.footerLogo} />
          <Text style={styles.footerText}>Page <Text render={({ pageNumber }) => `${pageNumber}`} /></Text>
        </View>
      </Page>
    </Document>
  );
};

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

// Helper function to validate token format
const isValidTokenFormat = (token) => {
  if (!token) return false;
  
  // Check if it's a JWT token (simple format check)
  // JWT tokens typically have 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Check if each part is base64 encoded
  try {
    for (const part of parts) {
      // Add padding if needed
      const paddedPart = part.padEnd(Math.ceil(part.length / 4) * 4, '=');
      // Try to decode
      atob(paddedPart.replace(/-/g, '+').replace(/_/g, '/'));
    }
    return true;
  } catch (e) {
    return false;
  }
};

const PaperGeneratorPage = () => {
  // State for stepper
  const [activeStep, setActiveStep] = useState(0);
  
  // State for loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for uploaded file and extracted text
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  
  // State for generated questions
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editFormData, setEditFormData] = useState({
    question: '',
    answer: '',
    options: { A: '', B: '', C: '', D: '' },
    marks: ''
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // State for final PDF data
  const [pdfData, setPdfData] = useState({
    paperTitle: '',
    subject: '',
    totalMarks: 0,
    timeLimit: 60,
    questions: []
  });
  
  // Handle file upload
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    console.log('File uploaded:', file.name);
    // You could extract text here if needed
  };
  
  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Handle generation form submission
  const handleGenerateSubmit = (responseData) => {
    console.log('Generation response:', responseData);
    
    // Store the complete response data
    if (responseData && responseData.questions && Array.isArray(responseData.questions)) {
      // Extract just the questions array from the response
      setGeneratedQuestions(responseData.questions);
      
      // Also store the complete response for PDF generation
      setPdfData({
        paperTitle: responseData.paper?.title || 'Examination Paper',
        subject: responseData.paper?.subject || '',
        totalMarks: responseData.paper?.total_marks || responseData.questions.length,
        timeLimit: responseData.paper?.duration_minutes || 60,
        questions: responseData.questions,
        paper: responseData.paper // Store the complete paper info
      });
    } else {
      // If no valid questions array is found
      setGeneratedQuestions([]);
      setError('Invalid response format from server. Please try again.');
    }
    
    setActiveStep(1);
  };
  
  // Handle editing a specific question
  const handleEditQuestion = (questionNumber) => {
    const questionToEdit = generatedQuestions.find(q => 
      q.number === questionNumber || 
      q.number === String(questionNumber) || 
      (typeof questionNumber === 'number' && q.number === undefined && questionNumber === index)
    );
    
    if (questionToEdit) {
      // Check if this is a multiple-choice question by checking if it has options
      // or if the answer is a single letter (A, B, C, or D)
      const hasOptions = 
        (questionToEdit.hasOwnProperty('options') && 
         questionToEdit.options && 
         typeof questionToEdit.options === 'object') ||
        (questionToEdit.answer && 
         typeof questionToEdit.answer === 'string' && 
         /^[A-D]$/.test(questionToEdit.answer.trim()));
      
      setEditingQuestion({
        ...questionToEdit,
        hasOptions
      });
      
      setEditFormData({
        question: questionToEdit.question || '',
        answer: questionToEdit.answer || '',
        options: questionToEdit.options || { A: '', B: '', C: '', D: '' },
        marks: questionToEdit.marks || ''
      });
      
      setEditDialogOpen(true);
    }
  };
  
  // Handle form field changes
  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle option change
  const handleOptionChange = (option, value) => {
    setEditFormData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: value
      }
    }));
  };
  
  // Handle saving edited question
  const handleSaveEditedQuestion = () => {
    if (editingQuestion) {
      // Create the base updated question with common fields
      const updatedQuestion = {
        ...editingQuestion,
        question: editFormData.question,
        answer: editFormData.answer,
        marks: editFormData.marks
      };

      // If it's an MCQ, include the options
      if (editingQuestion.hasOptions) {
        updatedQuestion.options = editFormData.options;
      } else {
        // For structured questions, ensure no options property exists
        delete updatedQuestion.options;
      }
      
      // Update question in the questions array
      setGeneratedQuestions(prevQuestions => 
        prevQuestions.map(q => 
          (q.number === editingQuestion.number || 
           (typeof q.number === 'undefined' && typeof editingQuestion.number === 'undefined' && 
            q.question === editingQuestion.question)) ? updatedQuestion : q
        )
      );
      
      // Update PDF data
      setPdfData(prevData => ({
        ...prevData,
        questions: prevData.questions?.map(q => 
          (q.number === editingQuestion.number || 
           (typeof q.number === 'undefined' && typeof editingQuestion.number === 'undefined' && 
            q.question === editingQuestion.question)) ? updatedQuestion : q
        ) || []
      }));
      
      // Close dialog and reset form
      setEditDialogOpen(false);
      setEditingQuestion(null);
    }
  };
  
  // Handle question deletion
  const handleDeleteQuestion = (id) => {
    setGeneratedQuestions(prevQuestions => 
      prevQuestions.filter(q => q.id !== id)
    );
    
    // Update PDF data
    setPdfData(prevData => ({
      ...prevData,
      questions: prevData.questions.filter(q => q.id !== id)
    }));
  };
  
  // Responsive stepper component
  const ResponsiveStepper = () => {
    return (
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                sx={{
                  '@media (max-width: 600px)': {
                    display: activeStep === index ? 'block' : 'none'
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  };
  
  return (
    <Box className="container mx-auto px-4 py-8">
      <Typography variant="h4" className="text-center mb-6 font-bold">
        Question Paper Generator
      </Typography>
      
      <ResponsiveStepper />
      
      {/* Step 1: Configure & Upload */}
      {activeStep === 0 && (
        <PaperGenerationForm
          onSubmit={handleGenerateSubmit}
          isGenerating={loading}
          onFileUpload={handleFileUpload}
        />
      )}
      
      {/* Step 2: Edit Questions */}
      {activeStep === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className="p-4">
              <Typography variant="h6" className="mb-4">
                Edit Generated Questions
              </Typography>
              
              {error && (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              )}
              
              <Box className="space-y-4">
                {generatedQuestions.length === 0 ? (
                  <Typography>No questions generated yet.</Typography>
                ) : (
                  generatedQuestions.map((q, index) => (
                    <Box 
                      key={q.number || `question-${index}`} 
                      className="p-3 border rounded-md"
                      sx={{ 
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        mb: 2
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}
                      >
                        <Box sx={{ width: '90%' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {q.number || index + 1}. {q.question}
                          </Typography>
                          {q.answer && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                              Answer: {q.answer}
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditQuestion(q.number || index)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      {q.options && (
                        <Box sx={{ ml: 3, mt: 1 }}>
                          {q.options.A && (
                            <Typography sx={{ mb: 0.5 }}>
                              A. {q.options.A}
                            </Typography>
                          )}
                          {q.options.B && (
                            <Typography sx={{ mb: 0.5 }}>
                              B. {q.options.B}
                            </Typography>
                          )}
                          {q.options.C && (
                            <Typography sx={{ mb: 0.5 }}>
                              C. {q.options.C}
                            </Typography>
                          )}
                          {q.options.D && (
                            <Typography sx={{ mb: 0.5 }}>
                              D. {q.options.D}
                            </Typography>
                          )}
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
      
      {/* Step 3: Finalize Paper */}
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
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" className="font-medium mb-3 text-sm">
                    Question Paper
                  </Typography>
                  <Box 
                    sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1, 
                      p: 2, 
                      height: '400px', 
                      overflow: 'auto',
                      bgcolor: '#f9f9f9'
                    }}
                  >
                    <Typography variant="body2" gutterBottom>
                      Paper Title: {pdfData.paperTitle}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Time Allowed: {pdfData.timeLimit} minutes
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    {pdfData.questions.map((q, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="body1" fontWeight="bold">
                          Question {q.number || index + 1} {q.marks ? `[${q.marks} marks]` : ''}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                          {q.question}
                        </Typography>
                        {q.options && (
                          <Box sx={{ mt: 1 }}>
                            {q.options.A && (
                              <Typography variant="body2">A. {q.options.A}</Typography>
                            )}
                            {q.options.B && (
                              <Typography variant="body2">B. {q.options.B}</Typography>
                            )}
                            {q.options.C && (
                              <Typography variant="body2">C. {q.options.C}</Typography>
                            )}
                            {q.options.D && (
                              <Typography variant="body2">D. {q.options.D}</Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <PDFDownloadLink
                      document={<QuestionPaperPDF data={pdfData} />}
                      fileName={`${pdfData.paperTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`}
                      style={{ textDecoration: 'none' }}
                    >
                      {({ loading: pdfLoading, error }) => (
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={pdfLoading || error}
                          size="large"
                          fullWidth
                        >
                          {pdfLoading ? 'Preparing PDF...' : 'Download Question Paper'}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" className="font-medium mb-3 text-sm">
                    Answer Key
                  </Typography>
                  <Box 
                    sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1, 
                      p: 2, 
                      height: '400px', 
                      overflow: 'auto',
                      bgcolor: '#f9f9f9'
                    }}
                  >
                    <Typography variant="body2" gutterBottom>
                      Paper Title: {pdfData.paperTitle} - Answer Key
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    {pdfData.questions.map((q, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="body1" fontWeight="bold">
                          Question {q.number || index + 1} {q.marks ? `[${q.marks} marks]` : ''}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                          {q.question}
                        </Typography>
                        {q.options && (
                          <Box sx={{ mt: 1 }}>
                            {q.options.A && (
                              <Typography variant="body2" sx={{ 
                                fontWeight: q.answer === 'A' ? 'bold' : 'normal',
                                color: q.answer === 'A' ? 'green' : 'inherit'
                              }}>
                                A. {q.options.A} {q.answer === 'A' && '✓'}
                              </Typography>
                            )}
                            {q.options.B && (
                              <Typography variant="body2" sx={{ 
                                fontWeight: q.answer === 'B' ? 'bold' : 'normal',
                                color: q.answer === 'B' ? 'green' : 'inherit'
                              }}>
                                B. {q.options.B} {q.answer === 'B' && '✓'}
                              </Typography>
                            )}
                            {q.options.C && (
                              <Typography variant="body2" sx={{ 
                                fontWeight: q.answer === 'C' ? 'bold' : 'normal',
                                color: q.answer === 'C' ? 'green' : 'inherit'
                              }}>
                                C. {q.options.C} {q.answer === 'C' && '✓'}
                              </Typography>
                            )}
                            {q.options.D && (
                              <Typography variant="body2" sx={{ 
                                fontWeight: q.answer === 'D' ? 'bold' : 'normal',
                                color: q.answer === 'D' ? 'green' : 'inherit'
                              }}>
                                D. {q.options.D} {q.answer === 'D' && '✓'}
                              </Typography>
                            )}
                          </Box>
                        )}
                        {!q.options && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              Answer:
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'green' }}>
                              {q.answer}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <PDFDownloadLink
                      document={<AnswerKeyPDF data={pdfData} />}
                      fileName={`${pdfData.paperTitle.replace(/\s+/g, '-').toLowerCase()}-answer-key.pdf`}
                      style={{ textDecoration: 'none' }}
                    >
                      {({ loading: pdfLoading, error }) => (
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={pdfLoading || error}
                          size="large"
                          fullWidth
                        >
                          {pdfLoading ? 'Preparing Answer Key...' : 'Download Answer Key'}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
      
      {/* Navigation Buttons */}
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
          disabled={activeStep === steps.length - 1}
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
      
      {/* Edit Question Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Question {editingQuestion?.number ? `#${editingQuestion.number}` : ''}
          {editingQuestion?.hasOptions ? ' (Multiple Choice)' : ' (Structured)'}
        </DialogTitle>
        <DialogContent>
          {editingQuestion?.hasOptions ? (
            // Multiple choice question with options
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
              <TextField
                label="Question"
                value={editFormData.question}
                onChange={(e) => handleEditFormChange('question', e.target.value)}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Answer (A, B, C, or D)"
                  value={editFormData.answer}
                  onChange={(e) => handleEditFormChange('answer', e.target.value)}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  label="Marks"
                  value={editFormData.marks || '1'}
                  onChange={(e) => handleEditFormChange('marks', e.target.value)}
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 1 }}
                  sx={{ width: '100px' }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" fontWeight="medium">Options:</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    label="A"
                    value={editFormData.options.A}
                    onChange={(e) => handleOptionChange('A', e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    label="B"
                    value={editFormData.options.B}
                    onChange={(e) => handleOptionChange('B', e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    label="C"
                    value={editFormData.options.C}
                    onChange={(e) => handleOptionChange('C', e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    label="D"
                    value={editFormData.options.D}
                    onChange={(e) => handleOptionChange('D', e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Box>
              </Box>
            </Box>
          ) : (
            // Structured question without options - use larger text areas
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Question:</Typography>
                  <TextField
                    value={editFormData.question}
                    onChange={(e) => handleEditFormChange('question', e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Enter the full question text here..."
                  />
                </Box>
                <TextField
                  label="Marks"
                  value={editFormData.marks || ''}
                  onChange={(e) => handleEditFormChange('marks', e.target.value)}
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 1 }}
                  sx={{ width: '100px', mt: 4 }}
                />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Answer:</Typography>
                <TextField
                  value={editFormData.answer}
                  onChange={(e) => handleEditFormChange('answer', e.target.value)}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={8}
                  placeholder="Enter the model answer here..."
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEditedQuestion} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaperGeneratorPage;