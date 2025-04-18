import React, { useState } from 'react';
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
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ITEMS_PER_PAGE = 5;

const SubjectTable = ({ subjects = [], isLoading, error, onEdit, onDelete, onManageTextbooks, page, onPageChange }) => {
  const totalPages = Math.ceil(subjects.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubjects = subjects.slice(startIndex, endIndex);
  const isMobile = useMediaQuery('(max-width:730px)');
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderSkeletons = (count = 5) => {
    if (isMobile) {
      return Array.from(new Array(count)).map((_, index) => (
        <Card key={`skeleton-${index}`} sx={{ mb: 2, borderRadius: 1 }}>
          <CardContent sx={{ p: 2 }}>
            <Skeleton animation="wave" height={30} />
            <Skeleton animation="wave" width="60%" />
          </CardContent>
        </Card>
      ));
    }
    
    return Array.from(new Array(count)).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" width={100} /></TableCell>
      </TableRow>
    ));
  };

  const renderMobileView = () => (
    <Box sx={{ px: 1 }}>
      {isLoading ? (
        renderSkeletons()
      ) : error ? (
        <Card sx={{ mb: 2, borderRadius: 1 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      ) : paginatedSubjects.length === 0 ? (
        <Card sx={{ mb: 2, borderRadius: 1 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography>No subjects found</Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {paginatedSubjects.map((subject) => (
            <Card 
              key={subject.id} 
              sx={{ 
                mb: 2, 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                bgcolor: 'white'
              }}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  borderBottom: expandedRows[subject.id] ? '1px solid #f0f0f0' : 'none'
                }}
                onClick={() => toggleRowExpansion(subject.id)}
              >
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: '#1a1a1a', mb: 0.5 }}
                  >
                    {subject.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: '#666', fontWeight: 'medium' }}
                  >
                    IGCSE Code: {subject.code}
                  </Typography>
                </Box>
                <IconButton 
                  size="small"
                  sx={{
                    p: 0,
                    bgcolor: 'transparent !important',
                    '&:hover': {
                      bgcolor: 'transparent !important'
                    },
                    '&:active': {
                      bgcolor: 'transparent !important'
                    }
                  }}
                >
                  {expandedRows[subject.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              
              <Collapse in={expandedRows[subject.id]} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ color: '#666', fontWeight: 'medium' }}
                    >
                      Textbooks
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'medium' }}>
                      {subject.textbookCount || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(subject);
                        }}
                        sx={{ 
                          color: '#2196f3',
                          p: 1
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                   
                    <Tooltip title="Manage Textbooks">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onManageTextbooks?.(subject.id);
                        }}
                        sx={{ 
                          color: '#455a64',
                          p: 1
                        }}
                      >
                        <FolderOpenIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(subject.id);
                        }}
                        sx={{ 
                          color: '#f44336',
                          p: 1
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Collapse>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );

  const renderDesktopView = () => (
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
  );

  return (
    <Box>
      {isMobile ? renderMobileView() : renderDesktopView()}
      
      {/* Show pagination only when there are more than 5 subjects */}
      {subjects.length > ITEMS_PER_PAGE && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            color="primary"
            size={isMobile ? "medium" : "large"}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#1976d2',
              },
              '& .Mui-selected': {
                bgcolor: '#1976d2 !important',
                color: 'white !important'
              }
            }}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: NavigateBeforeIcon, next: NavigateNextIcon }}
                {...item}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default SubjectTable;
