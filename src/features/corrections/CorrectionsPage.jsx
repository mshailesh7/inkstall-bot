import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GetAppIcon from '@mui/icons-material/GetApp';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const steps = ['Select Paper & Upload Answers', 'Initiate Correction', 'Review Results', 'Finalize'];

// Mock data for generated papers
const papers = [
  { id: 1, title: 'Physics Paper 1 - Mechanics' },
  { id: 2, title: 'Chemistry Paper 2 - Organic Chemistry' },
  { id: 3, title: 'Biology Paper 3 - Ecology' },
];

// Mock correction results
const mockCorrectionResults = [
  {
    questionId: 1,
    questionText: 'A car accelerates uniformly from rest to 20 m/s in 10 seconds. Calculate the acceleration of the car and the distance traveled during this time.',
    modelAnswer: 'Acceleration = change in velocity / time = 20 / 10 = 2 m/s². Distance = ½ × acceleration × time² = 0.5 × 2 × 10² = 100 meters.',
    studentAnswerImage: 'answer-image-placeholder.png',
    studentAnswerOcr: 'Acceleration = 20/10 = 2 m/s² Distance = 1/2 × 2 × 10² = 100m',
    aiMark: 5,
    maxMark: 5,
    aiFeedback: 'Correct calculation of acceleration using the formula. Correct calculation of distance using the appropriate kinematic equation. All working shown clearly.',
    teacherMark: 5,
    teacherFeedback: '',
    reviewed: false,
  },
  {
    questionId: 2,
    questionText: 'Explain how electromagnetic induction works and give one practical application.',
    modelAnswer: 'Electromagnetic induction is the process where a changing magnetic field creates an electric current in a conductor. This happens when a conductor moves through a magnetic field or when a magnetic field changes around a conductor. The induced current creates its own magnetic field that opposes the change that produced it (Lenz\'s law). A practical application is in electrical generators where mechanical energy is converted to electrical energy.',
    studentAnswerImage: 'answer-image-placeholder.png',
    studentAnswerOcr: 'Electromagnetic induction is when a changing magnetic field produces a current in a conductor. It happens when you move a magnet near a coil of wire. This is used in generators to make electricity.',
    aiMark: 4,
    maxMark: 6,
    aiFeedback: 'Basic explanation of electromagnetic induction is correct but missing mention of Lenz\'s law. The practical application (generators) is correct but lacks detail on how it works. Missing some key points from the model answer.',
    teacherMark: 4,
    teacherFeedback: '',
    reviewed: false,
  },
  {
    questionId: 3,
    questionText: 'A radioactive isotope has a half-life of 8 days. If the initial activity is 160 Bq, what will be the activity after 24 days?',
    modelAnswer: 'After 24 days, that\'s 24/8 = 3 half-lives. So the activity will be 160 × (1/2)³ = 160 × 1/8 = 20 Bq.',
    studentAnswerImage: 'answer-image-placeholder.png',
    studentAnswerOcr: '24 days = 3 half-lives. Activity = 160 × (1/2)³ = 160 × 1/8 = 20 Bq',
    aiMark: 4,
    maxMark: 4,
    aiFeedback: 'Correct identification of the number of half-lives. Correct application of the decay formula. Correct final answer with units.',
    teacherMark: 4,
    teacherFeedback: '',
    reviewed: false,
  },
];

const CorrectionsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedPaper, setSelectedPaper] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [correctionResults, setCorrectionResults] = useState([]);
  const [overallScore, setOverallScore] = useState({ earned: 0, total: 0 });
  const [overallComments, setOverallComments] = useState('');

  const handleNext = () => {
    if (activeStep === 1) {
      // Simulate correction process
      setLoading(true);
      const timer = setInterval(() => {
        setProcessingProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setCorrectionResults(mockCorrectionResults);
              const totalEarned = mockCorrectionResults.reduce((sum, q) => sum + q.aiMark, 0);
              const totalPossible = mockCorrectionResults.reduce((sum, q) => sum + q.maxMark, 0);
              setOverallScore({ earned: totalEarned, total: totalPossible });
              setLoading(false);
              setActiveStep((prevStep) => prevStep + 1);
            }, 500);
          }
          return newProgress;
        });
      }, 500);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFileUpload = () => {
    // In a real app, this would handle the actual file upload
    setFileUploaded(true);
  };

  const handleMarkChange = (index, value) => {
    const updatedResults = [...correctionResults];
    updatedResults[index].teacherMark = value;
    setCorrectionResults(updatedResults);
    
    // Update overall score
    const totalEarned = updatedResults.reduce((sum, q) => sum + q.teacherMark, 0);
    setOverallScore({ ...overallScore, earned: totalEarned });
  };

  const handleFeedbackChange = (index, value) => {
    const updatedResults = [...correctionResults];
    updatedResults[index].teacherFeedback = value;
    setCorrectionResults(updatedResults);
  };

  const handleReviewToggle = (index) => {
    const updatedResults = [...correctionResults];
    updatedResults[index].reviewed = !updatedResults[index].reviewed;
    setCorrectionResults(updatedResults);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Paper</InputLabel>
                  <Select
                    value={selectedPaper}
                    onChange={(e) => setSelectedPaper(e.target.value)}
                    label="Select Paper"
                  >
                    {papers.map((paper) => (
                      <MenuItem key={paper.id} value={paper.id}>
                        {paper.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={12}>
                <Box 
                  sx={{ 
                    border: '2px dashed #ccc', 
                    borderRadius: 2, 
                    p: 3, 
                    textAlign: 'center',
                    bgcolor: fileUploaded ? 'success.light' : 'background.paper',
                    color: fileUploaded ? 'white' : 'inherit',
                  }}
                >
                  {fileUploaded ? (
                    <>
                      <CheckCircleIcon sx={{ fontSize: 60, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        File Uploaded Successfully
                      </Typography>
                      <Typography variant="body2">
                        student_answers.pdf
                      </Typography>
                      <Button 
                        variant="outlined" 
                        sx={{ mt: 2, color: 'white', borderColor: 'white' }}
                        onClick={() => setFileUploaded(false)}
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 60, mb: 2, color: 'text.secondary' }} />
                      <Typography variant="h6" gutterBottom>
                        Upload Student Answer Sheets
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Drag and drop PDF files here, or click to browse
                      </Typography>
                      <Button 
                        variant="contained" 
                        onClick={handleFileUpload}
                      >
                        Browse Files
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        );
        
      case 1:
        return (
          <Paper sx={{ p: 3 }}>
            {loading ? (
              <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Processing Answer Sheets
                </Typography>
                <Box sx={{ width: '100%', mt: 2, mb: 4 }}>
                  <LinearProgress variant="determinate" value={processingProgress} />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {processingProgress < 30 && 'Uploading scans...'}
                  {processingProgress >= 30 && processingProgress < 60 && 'Processing with Vision API (OCR)...'}
                  {processingProgress >= 60 && processingProgress < 90 && 'Matching answers and evaluating...'}
                  {processingProgress >= 90 && 'Finalizing correction...'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take a few minutes
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Ready to Start Correction
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  The system will process the uploaded answer sheets and compare them with the model answers from the selected paper.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => handleNext()}
                >
                  Start Automated Correction
                </Button>
              </Box>
            )}
          </Paper>
        );
        
      case 2:
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Correction Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review the AI-generated marks and provide your feedback. You can adjust marks and add comments as needed.
              </Typography>
            </Box>
            
            {correctionResults.map((result, index) => (
              <Card key={result.questionId} sx={{ mb: 3 }}>
                <CardHeader
                  title={`Question ${index + 1} (${result.maxMark} marks)`}
                  action={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Reviewed:
                      </Typography>
                      <IconButton
                        color={result.reviewed ? 'success' : 'default'}
                        onClick={() => handleReviewToggle(index)}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    {/* Column 1: Original Question */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Original Question:
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {result.questionText}
                      </Typography>
                      
                      <Typography variant="subtitle1" gutterBottom>
                        Model Answer:
                      </Typography>
                      <Typography variant="body2">
                        {result.modelAnswer}
                      </Typography>
                    </Grid>
                    
                    {/* Column 2: Student Answer */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Student Answer:
                      </Typography>
                      <Box sx={{ 
                        height: 150, 
                        bgcolor: 'grey.100', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '1px solid grey.300',
                        mb: 2
                      }}>
                        <Typography>Answer Image Placeholder</Typography>
                      </Box>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Extracted Text (OCR):
                      </Typography>
                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                        {result.studentAnswerOcr}
                      </Typography>
                    </Grid>
                    
                    {/* Column 3: AI Marking & Feedback */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        AI Assessment:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ mr: 1 }}>
                          AI Mark:
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {result.aiMark}/{result.maxMark}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" paragraph>
                        <strong>AI Feedback:</strong> {result.aiFeedback}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle1" gutterBottom>
                        Teacher Override:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          Adjust Mark:
                        </Typography>
                        <TextField
                          type="number"
                          size="small"
                          value={result.teacherMark}
                          onChange={(e) => handleMarkChange(index, parseInt(e.target.value))}
                          InputProps={{ inputProps: { min: 0, max: result.maxMark } }}
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          / {result.maxMark}
                        </Typography>
                      </Box>
                      
                      <TextField
                        fullWidth
                        label="Teacher Feedback"
                        multiline
                        rows={3}
                        value={result.teacherFeedback}
                        onChange={(e) => handleFeedbackChange(index, e.target.value)}
                        placeholder="Add your feedback or comments here..."
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overall Assessment
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Total Score:
                </Typography>
                <Typography variant="h5" color="primary">
                  {overallScore.earned}/{overallScore.total} ({Math.round((overallScore.earned / overallScore.total) * 100)}%)
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Overall Comments"
                multiline
                rows={4}
                value={overallComments}
                onChange={(e) => setOverallComments(e.target.value)}
                placeholder="Add overall feedback for the student..."
              />
            </Paper>
          </>
        );
        
      case 3:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Correction Complete
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                You have successfully reviewed and corrected the student's answers.
              </Typography>
              <Typography variant="body1" paragraph>
                Final Score: <strong>{overallScore.earned}/{overallScore.total} ({Math.round((overallScore.earned / overallScore.total) * 100)}%)</strong>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Save Corrected Paper
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetAppIcon />}
              >
                Export Feedback Report (PDF)
              </Button>
            </Box>
          </Paper>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, overflowX: 'hidden', maxWidth: '100vw', width: '100%', pb: '60px' }}>
      <Typography variant="h4" gutterBottom>
        Answer Correction
      </Typography>
      <Box sx={{ overflowX: (isMobile || isTablet) ? 'auto' : 'visible', width: '100%', mb: { xs: 2, sm: 3 } }}>
        <Stepper
          activeStep={activeStep}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{
            minWidth: 0,
            '& .MuiStepLabel-label': {
              fontSize: isMobile ? '0.98rem' : isTablet ? '0.98rem' : '1.1rem',
              whiteSpace: 'normal',
              textAlign: isMobile ? 'left' : 'center',
              lineHeight: 1.3,
              maxWidth: { xs: '220px', sm: '150px', md: '180px' },
            },
            '& .MuiStep-root': {
              minWidth: isTablet ? 120 : 0,
              flex: isTablet ? '1 1 0' : 'unset',
              px: isTablet ? 1.5 : 2,
              mb: isMobile ? 2 : 0,
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {renderStepContent(activeStep)}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        {activeStep > 0 && activeStep < 3 && (
          <Button
            onClick={handleBack}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Back
          </Button>
        )}
        
        {activeStep < 3 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && (!selectedPaper || !fileUploaded)) ||
              loading
            }
          >
            {activeStep === 0 ? 'Next' : activeStep === 1 ? 'Process' : 'Finalize'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CorrectionsPage;