import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const SubjectTable = ({ subjects, isLoading, error, onEdit, onDelete, onManageTextbooks }) => {
  const renderSkeletons = (count = 5) =>
    Array.from(new Array(count)).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" width={100} /></TableCell>
      </TableRow>
    ));

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} aria-label="subject table">
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
            <TableCell>Subject Name</TableCell>
            <TableCell>IGCSE Code</TableCell>
            <TableCell>Textbooks</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            renderSkeletons()
          ) : error ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography color="error">{error}</Typography>
              </TableCell>
            </TableRow>
          ) : subjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography color="textSecondary">No subjects found. Add one to get started!</Typography>
              </TableCell>
            </TableRow>
          ) : (
            subjects.map((subject) => (
              <TableRow key={subject.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover>
                <TableCell component="th" scope="row">
                  {subject.name}
                </TableCell>
                <TableCell>{subject.code}</TableCell>
                <TableCell>{subject.textbookCount ?? 0}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Manage Textbooks">
                    <IconButton size="small" onClick={() => onManageTextbooks && onManageTextbooks(subject.id)} color="primary" aria-label={`manage textbooks for ${subject.name}`}>
                      <FolderOpenIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Subject">
                    <IconButton size="small" onClick={() => onEdit && onEdit(subject)} color="secondary" aria-label={`edit subject ${subject.name}`}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Subject">
                    <IconButton size="small" onClick={() => onDelete && onDelete(subject.id)} color="error" aria-label={`delete subject ${subject.name}`}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubjectTable;
