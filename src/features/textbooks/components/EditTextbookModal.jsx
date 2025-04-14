// src/features/textbooks/components/EditTextbookModal.jsx
import React, { useState, useEffect } from 'react';
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

const EditTextbookModal = ({
  open,
  textbook,
  onClose,
  onTextbookUpdated,
  updateTextbook,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    edition: '',
    publicationYear: undefined,
    isbn: '',
    subjectId: '',
    coverImageUrl: '',
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // API call state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Load textbook data when the modal opens or textbook changes
  useEffect(() => {
    if (textbook) {
      setFormData({
        title: textbook.title,
        author: textbook.author,
        publisher: textbook.publisher,
        edition: textbook.edition || '',
        publicationYear: textbook.publicationYear,
        isbn: textbook.isbn || '',
        subjectId: textbook.subjectId,
        coverImageUrl: textbook.coverImageUrl || '',
      });
    }
  }, [textbook]);

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
    // Clear any previous API errors
    setApiError(null);
    
    // Validate form
    if (!validateForm() || !textbook) {
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    try {
      const updatedTextbook = await updateTextbook(textbook.id, formData);
      onTextbookUpdated(updatedTextbook);
      handleReset(); // Reset form after successful submission
    } catch (error) {
      setApiError(error.message || 'Failed to update textbook. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form state
  const handleReset = () => {
    if (textbook) {
      setFormData({
        title: textbook.title,
        author: textbook.author,
        publisher: textbook.publisher,
        edition: textbook.edition || '',
        publicationYear: textbook.publicationYear,
        isbn: textbook.isbn || '',
        subjectId: textbook.subjectId,
        coverImageUrl: textbook.coverImageUrl || '',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        publisher: '',
        edition: '',
        publicationYear: undefined,
        isbn: '',
        subjectId: '',
        coverImageUrl: '',
      });
    }
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
      <DialogTitle>Edit Textbook</DialogTitle>
      
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
                InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() + 1 } }}
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
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                id="coverImageUrl"
                label="Cover Image URL"
                name="coverImageUrl"
                autoComplete="off"
                value={formData.coverImageUrl || ''}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="https://example.com/cover.jpg"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="caption">URL:</Typography>
                    </InputAdornment>
                  ),
                }}
              />
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
          {isSubmitting ? 'Updating...' : 'Update Textbook'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTextbookModal;