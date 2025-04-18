// src/features/textbooks/TextbookListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';

import { getTextbooksBySubject, addTextbook, updateTextbook, deleteTextbook } from '../../services/textbookService';
import { getSubjects } from '../../services/subjectService';
import TextbookCard from './components/TextbookCard';
import AddTextbookModal from './components/AddTextbookModal';
import EditTextbookModal from './components/EditTextbookModal';
import DeleteConfirmationDialog from '../../components/common/DeleteConfirmationDialog';

const TextbookListPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const [textbooks, setTextbooks] = useState([]);
  const [subject, setSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for controlling the Add Textbook Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // State for controlling the Edit Textbook Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTextbook, setSelectedTextbook] = useState(null);
  
  // State for controlling the Delete Confirmation Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [textbookToDelete, setTextbookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for showing success/error messages (Snackbar)
  const [snackbar, setSnackbar] = useState(null);

  // Fetch subject and its textbooks when the component mounts
  const fetchData = useCallback(async () => {
    if (!subjectId) {
      setError('Subject ID is missing.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch the subject first
      const subjects = await getSubjects();
      const currentSubject = subjects.find(s => s.id === subjectId);
      
      if (!currentSubject) {
        throw new Error(`Subject with ID ${subjectId} not found.`);
      }
      
      setSubject(currentSubject);
      
      // Then fetch the textbooks for this subject
      const textbooksData = await getTextbooksBySubject(subjectId);
      setTextbooks(textbooksData);
    } catch (err) {
      setError(err.message || 'An unknown error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add Textbook Handlers
  const handleAddTextbook = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleTextbookAdded = (newTextbook) => {
    setTextbooks(prevTextbooks => [...prevTextbooks, newTextbook]);
    handleCloseAddModal();
    setSnackbar({ open: true, message: `Textbook "${newTextbook.title}" added successfully!`, severity: 'success' });
  };

  // Edit Textbook Handlers
  const handleEditTextbook = (textbook) => {
    setSelectedTextbook(textbook);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTextbook(null);
  };

  const handleTextbookUpdated = (updatedTextbook) => {
    setTextbooks(prevTextbooks => 
      prevTextbooks.map(textbook => 
        textbook.id === updatedTextbook.id ? updatedTextbook : textbook
      )
    );
    handleCloseEditModal();
    setSnackbar({ open: true, message: `Textbook "${updatedTextbook.title}" updated successfully!`, severity: 'success' });
  };

  // Delete Textbook Handlers
  const handleDeleteTextbook = (textbookId) => {
    // Find the textbook to show its name in the confirmation dialog
    const textbook = textbooks.find(t => t.id === textbookId);
    if (!textbook) return;
    
    setTextbookToDelete(textbookId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTextbookToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!textbookToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteTextbook(textbookToDelete);
      
      // Find the textbook name for the success message
      const deletedTextbook = textbooks.find(t => t.id === textbookToDelete);
      const textbookTitle = deletedTextbook ? deletedTextbook.title : 'Textbook';
      
      // Update the UI
      setTextbooks(prevTextbooks => prevTextbooks.filter(textbook => textbook.id !== textbookToDelete));
      setSnackbar({ open: true, message: `${textbookTitle} deleted successfully!`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to delete textbook.', severity: 'error' });
    } finally {
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  const handleViewTextbook = (textbook) => {
    // For now, just show a message
    setSnackbar({ open: true, message: `Viewing details for "${textbook.title}" will be implemented in the next phase.`, severity: 'info' });
  };

  const handleBackToSubjects = () => {
    navigate('/subjects');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error} - <Button onClick={fetchData} size="small">Retry</Button>
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToSubjects}
          sx={{ mt: 2 }}
        >
          Back to Subjects
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={handleBackToSubjects}
          sx={{ cursor: 'pointer' }}
        >
          Subjects
        </Link>
        <Typography color="text.primary">
          {subject?.name || 'Textbooks'}
        </Typography>
      </Breadcrumbs>

      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            {subject?.name} Textbooks
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            IGCSE Code: {subject?.code}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTextbook}
        >
          Add Textbook
        </Button>
      </Box>

      {/* Textbooks grid */}
      {textbooks.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No textbooks found for this subject. Click "Add Textbook" to add one.
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ 
          mt: 2,
          '@media (max-width: 750px)': {
            justifyContent: 'center',
            '& .MuiGrid-item': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }
          }
        }}>
          {textbooks.map((textbook) => (
            <Grid item key={textbook.id} xs={12} sm={6} md={4} lg={3}>
              <TextbookCard 
                textbook={textbook} 
                onEdit={handleEditTextbook}
                onDelete={handleDeleteTextbook}
                onView={handleViewTextbook}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Back button */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBackToSubjects}
        sx={{ mt: 4 }}
      >
        Back to Subjects
      </Button>

      {/* Add Textbook Modal */}
      {subjectId && (
        <AddTextbookModal
          open={isAddModalOpen}
          subjectId={subjectId}
          onClose={handleCloseAddModal}
          onSuccess={handleTextbookAdded}
          addTextbook={addTextbook}
        />
      )}

      {/* Edit Textbook Modal */}
      <EditTextbookModal
        open={isEditModalOpen}
        textbook={selectedTextbook}
        onClose={handleCloseEditModal}
        onTextbookUpdated={handleTextbookUpdated}
        updateTextbook={updateTextbook}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete Textbook"
        contentText="Are you sure you want to delete this textbook? This action cannot be undone."
        isDeleting={isDeleting}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      {/* Snackbar for notifications */}
      {snackbar && (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default TextbookListPage;