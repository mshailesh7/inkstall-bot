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

const EditSubjectModal = ({ open, subject, onClose, onSubjectUpdated, updateSubject }) => {
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (subject) {
      setFormData({ name: subject.name, code: subject.code });
    }
  }, [subject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Subject name is required';
    if (!formData.code.trim()) {
      newErrors.code = 'IGCSE code is required';
    } else if (!/^\d{4}$/.test(formData.code)) {
      newErrors.code = 'IGCSE code must be a 4-digit number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setApiError(null);
    if (!validateForm() || !subject) return;
    setIsSubmitting(true);
    try {
      const updatedSubject = await updateSubject(subject.id, formData);
      onSubjectUpdated(updatedSubject);
      handleReset();
    } catch (error) {
      setApiError(error.message || 'Failed to update subject. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (subject) {
      setFormData({ name: subject.name, code: subject.code });
    } else {
      setFormData({ name: '', code: '' });
    }
    setErrors({});
    setApiError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Subject</DialogTitle>
      <DialogContent>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Subject Name"
            name="name"
            autoComplete="off"
            autoFocus
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isSubmitting}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label="IGCSE Code (e.g., 0625)"
            name="code"
            autoComplete="off"
            value={formData.code}
            onChange={handleChange}
            error={!!errors.code}
            helperText={errors.code || "The 4-digit code assigned by Cambridge Assessment International Education"}
            disabled={isSubmitting}
            inputProps={{ maxLength: 4 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} /> : null}>
          {isSubmitting ? 'Updating...' : 'Update Subject'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSubjectModal;
