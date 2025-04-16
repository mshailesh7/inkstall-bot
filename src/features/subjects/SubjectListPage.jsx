import React, { useState, useEffect, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import { getSubjects, addSubject, updateSubject, deleteSubject } from '../../services/subjectService';
import SubjectTable from './components/SubjectTable';
import AddSubjectModal from './components/AddSubjectModal';
import EditSubjectModal from './components/EditSubjectModal';
import DeleteConfirmationDialog from '../../components/common/DeleteConfirmationDialog';

const SubjectListPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [page, setPage] = useState(1);

  // Modal and dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Snackbar for notifications
  const [snackbar, setSnackbar] = useState(null);

  const navigate = useNavigate();

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsRetrying(false);

    try {
      const data = await getSubjects();
      setSubjects(data);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError(err.message || 'An unknown error occurred while fetching subjects.');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    setSnackbar({ open: true, message: 'Retrying to fetch subjects...', severity: 'info' });

    try {
      const data = await getSubjects();
      setSubjects(data);
      setError(null);
      setRetryCount(0);
      setSnackbar({ open: true, message: 'Successfully fetched subjects!', severity: 'success' });
    } catch (err) {
      console.error('Error retrying fetch:', err);
      setError(err.message || 'Failed to fetch subjects. Please try again.');
      setSnackbar({ open: true, message: 'Failed to fetch subjects. Please try again.', severity: 'error' });
    } finally {
      setIsRetrying(false);
    }
  }, []);

  // Handlers for Add Subject
  const handleAddSubjectClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSubjectAdded = (newSubject) => {
    setSubjects(prevSubjects => [...prevSubjects, newSubject]);
    handleCloseAddModal();
    setSnackbar({ open: true, message: `Subject "${newSubject.name}" added successfully!`, severity: 'success' });
  };

  // Handlers for Edit Subject
  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSubject(null);
  };

  const handleSubjectUpdated = (updatedSubject) => {
    setSubjects(prevSubjects =>
      prevSubjects.map(subject =>
        subject.id === updatedSubject.id ? updatedSubject : subject
      )
    );
    handleCloseEditModal();
    setSnackbar({ open: true, message: `Subject "${updatedSubject.name}" updated successfully!`, severity: 'success' });
  };

  // Handlers for Delete Subject
  const handleDeleteSubject = (subjectId) => {
    setSubjectToDelete(subjectId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSubjectToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!subjectToDelete) return;

    setIsDeleting(true);
    try {
      await deleteSubject(subjectToDelete);
      const deletedSubject = subjects.find(s => s.id === subjectToDelete);
      const subjectName = deletedSubject ? deletedSubject.name : 'Subject';
      setSubjects(prevSubjects => prevSubjects.filter(subject => subject.id !== subjectToDelete));
      setSnackbar({ open: true, message: `${subjectName} deleted successfully!`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to delete subject.', severity: 'error' });
    } finally {
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  const handleManageTextbooks = (subjectId) => {
    console.log('Navigate to textbooks for subject ID:', subjectId);
    navigate(`/subjects/${subjectId}/textbooks`);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderErrorState = () => (
    <Paper elevation={2} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, backgroundColor: 'rgba(255, 0, 0, 0.05)', mb: 3 }}>
      <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h6" color="error" gutterBottom>
        Failed to fetch subjects
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
        {error || 'There was an error loading the subjects. Please try again.'}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRetry}
        disabled={isRetrying}
        startIcon={isRetrying ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
      >
        {isRetrying ? 'Retrying...' : 'Retry Now'}
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ 
      p: 3,
      height: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: '#1a1a1a', fontWeight: 500 }}>
          Subjects
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon sx={{ color: '#000' }} />}
          endIcon={<ChevronRightIcon sx={{ color: '#fff' }} />}
          onClick={handleAddSubjectClick}
          sx={{
            bgcolor: '#fff',
            color: '#000',
            textTransform: 'none',
            px: 2,
            py: 1,
            borderRadius: 1,
            '&:hover': {
              bgcolor: '#f5f5f5'
            },
            '& .MuiButton-endIcon': {
              bgcolor: '#3f88f5',
              borderRadius: '50%',
              p: 0.5,
              ml: 1
            }
          }}
        >
          Create New Paper
        </Button>
      </Box>

      {error && !isLoading && renderErrorState()}

      {(!error || isLoading) && (
        <Box sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              overflow: 'visible',
              mb: 2
            }}
          >
            <SubjectTable
              subjects={subjects}
              isLoading={isLoading}
              onEdit={handleEditSubject}
              onDelete={handleDeleteSubject}
              onManageTextbooks={handleManageTextbooks}
              page={page}
              onPageChange={handlePageChange}
            />
          </Paper>
        </Box>
      )}
      <AddSubjectModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubjectAdded={handleSubjectAdded}
        addSubject={addSubject}
      />

      <EditSubjectModal
        open={isEditModalOpen}
        subject={selectedSubject}
        onClose={handleCloseEditModal}
        onSubjectUpdated={handleSubjectUpdated}
        updateSubject={updateSubject}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete Subject"
        contentText="Are you sure you want to delete this subject? This action cannot be undone. If the subject has associated textbooks, you must remove them first."
        isDeleting={isDeleting}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      {snackbar && (
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default SubjectListPage;