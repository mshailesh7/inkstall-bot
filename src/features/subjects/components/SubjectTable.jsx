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
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PaginationItem from '@mui/material/PaginationItem';

const ITEMS_PER_PAGE = 5;

const SubjectTable = ({ subjects = [], isLoading, error, onEdit, onDelete, onManageTextbooks, page, onPageChange }) => {
  const totalPages = Math.ceil(subjects.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubjects = subjects.slice(startIndex, endIndex);

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
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          overflow: 'auto',
          mb: 2,
          height: '400px',
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 650,
            tableLayout: 'fixed',
            '& th': {
              py: 1.5,
              px: 2,
              borderBottom: '2px solid #e0e0e0',
              backgroundColor: '#fff'
            },
            '& td': {
              py: 1.5,
              px: 2,
              borderBottom: '1px solid #e0e0e0'
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#1a1a1a'
              }}>
                Subject Name
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#1a1a1a'
              }}>
                IGCSE Code
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#1a1a1a'
              }}>
                Textbooks
              </TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 600, 
                color: '#1a1a1a'
              }}>
                Actions
              </TableCell>
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
            ) : paginatedSubjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography>No subjects found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedSubjects.map((subject) => (
                <TableRow
                  key={subject.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                  }}
                >
                  <TableCell>
                    {subject.name}
                  </TableCell>
                  <TableCell>
                    {subject.code}
                  </TableCell>
                  <TableCell>
                    {subject.textbookCount ?? 0}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Manage Textbooks">
                      <IconButton
                        size="small"
                        onClick={() => onManageTextbooks?.(subject.id)}
                        color="primary"
                        sx={{ color: '#000' }}
                      >
                        <FolderOpenIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Subject">
                      <IconButton
                        size="small"
                        onClick={() => onEdit?.(subject)}
                        color="secondary"
                        sx={{ color: '#1976d2' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Subject">
                      <IconButton
                        size="small"
                        onClick={() => onDelete?.(subject.id)}
                        color="error"
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: NavigateBeforeIcon, next: NavigateNextIcon }}
                {...item}
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 1,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mx: 0.5,
                  '&.Mui-selected': {
                    bgcolor: '#3f88f5',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: '#3f88f5',
                    }
                  }
                }}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default SubjectTable;
