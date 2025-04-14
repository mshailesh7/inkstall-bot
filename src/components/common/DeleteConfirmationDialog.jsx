// src/components/common/DeleteConfirmationDialog.jsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Dialog component for confirming deletion actions
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {string} props.title - Dialog title
 * @param {string} props.contentText - Dialog content
 * @param {boolean} props.isDeleting - Whether deletion is in progress
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Function} props.onConfirm - Function to call when deletion is confirmed
 */
const DeleteConfirmationDialog = ({
  open,
  title,
  contentText,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={isDeleting}
          color="primary"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;