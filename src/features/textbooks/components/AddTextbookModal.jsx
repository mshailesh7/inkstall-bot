// src/features/textbooks/components/AddTextbookModal.jsx
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const AddTextbookModal = ({
  open,
  subjectId,
  onClose,
  onSuccess,
  addTextbook,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    edition: '',
    publicationYear: undefined,
    isbn: '',
    subjectId: subjectId,
  });
  
  // File upload state
  const [files, setFiles] = useState({
    coverImage: null,
    coverImagePreview: null,
    pdfFile: null
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // API call state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle number fields
    if (name === 'publicationYear') {
      const yearValue = value === '' ? undefined : parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: yearValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (type, file) => {
    setFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  // Handle file removal
  const handleRemoveFile = (type) => {
    setFiles(prev => ({
      ...prev,
      [type]: null
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Textbook title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
    }
    
    if (!formData.publisher.trim()) {
      newErrors.publisher = 'Publisher name is required';
    }
    
    if (formData.publicationYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (formData.publicationYear < 1900 || formData.publicationYear > currentYear + 1) {
        newErrors.publicationYear = `Year must be between 1900 and ${currentYear + 1}`;
      }
    }
    
    if (formData.isbn && !/^(?:\d[- ]?){9}[\dXx]$|^(?:\d[- ]?){13}\d$/.test(formData.isbn.replace(/[- ]/g, ''))) {
      newErrors.isbn = 'ISBN must be a valid 10 or 13 digit number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setApiError(null);
    setIsSubmitting(true);
    
    try {
      console.log("Starting form submission");
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value);
          console.log(`Added form field: ${key} = ${value}`);
        }
      });

      // Add files if selected
      if (files.coverImage) {
        formDataToSend.append('coverImage', files.coverImage);
        console.log(`Added cover image: ${files.coverImage.name}`);
      }
      if (files.pdfFile) {
        formDataToSend.append('pdfFile', files.pdfFile);
        console.log(`Added PDF: ${files.pdfFile.name}`);
      }

      console.log("Calling addTextbook service");
      const newTextbook = await addTextbook(formDataToSend);
      console.log("Textbook added successfully:", newTextbook);
      
      onSuccess(newTextbook);
      handleClose();
    } catch (error) {
      console.error("Error adding textbook:", error);
      setApiError(error.message || 'Failed to add textbook. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form state
  const handleReset = () => {
    setFormData({
      title: '',
      author: '',
      publisher: '',
      edition: '',
      publicationYear: undefined,
      isbn: '',
      subjectId: subjectId,
    });
    setFiles({
      coverImage: null,
      coverImagePreview: null,
      pdfFile: null
    });
    setErrors({});
    setApiError(null);
  };

  // Handle modal close
  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Add New Textbook</DialogTitle>
      
      <DialogContent>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Textbook Title"
                name="title"
                autoComplete="off"
                autoFocus
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="author"
                label="Author(s)"
                name="author"
                autoComplete="off"
                value={formData.author}
                onChange={handleChange}
                error={!!errors.author}
                helperText={errors.author}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="publisher"
                label="Publisher"
                name="publisher"
                autoComplete="off"
                value={formData.publisher}
                onChange={handleChange}
                error={!!errors.publisher}
                helperText={errors.publisher}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                id="edition"
                label="Edition (Optional)"
                name="edition"
                autoComplete="off"
                value={formData.edition || ''}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g., 3rd Edition"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                id="publicationYear"
                label="Publication Year (Optional)"
                name="publicationYear"
                type="number"
                autoComplete="off"
                value={formData.publicationYear || ''}
                onChange={handleChange}
                error={!!errors.publicationYear}
                helperText={errors.publicationYear}
                disabled={isSubmitting}
                InputProps={{
                  inputProps: { min: 1900, max: new Date().getFullYear() + 1 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                id="isbn"
                label="ISBN (Optional)"
                name="isbn"
                autoComplete="off"
                value={formData.isbn || ''}
                onChange={handleChange}
                error={!!errors.isbn}
                helperText={errors.isbn || "ISBN-10 or ISBN-13 format"}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                <Typography variant="subtitle1">Upload Files</Typography>
                
                {/* Cover Image Upload */}
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mb: 1 }}
                    startIcon={<ImageIcon />}
                  >
                    Choose Cover Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFiles(prev => ({
                              ...prev,
                              coverImage: file,
                              coverImagePreview: reader.result
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Button>
                  {files.coverImage && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                      <img 
                        src={files.coverImagePreview} 
                        alt="Cover preview" 
                        style={{ 
                          maxWidth: '100px', 
                          maxHeight: '100px', 
                          objectFit: 'cover', 
                          borderRadius: '4px'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption">
                          {files.coverImage.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {files.coverImage.size.toLocaleString()} bytes
                        </Typography>
                      </Box>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleRemoveFile('coverImage')}
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* PDF Upload */}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mb: 1 }}
                    startIcon={<PictureAsPdfIcon />}
                  >
                    Choose PDF File
                    <input
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload('pdfFile', e.target.files[0])}
                    />
                  </Button>
                  {files.pdfFile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" sx={{ flex: 1 }}>
                        {files.pdfFile.name}
                      </Typography>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleRemoveFile('pdfFile')}
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Adding...' : 'Add Textbook'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTextbookModal;