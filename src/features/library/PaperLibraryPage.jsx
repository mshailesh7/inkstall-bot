import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

// Mock data for generated papers
const mockPapers = [
  {
    id: 1,
    title: 'Physics Paper 1 - Mechanics',
    subject: 'Physics (0625)',
    dateCreated: '2025-03-27',
    questionCount: 10,
    totalMarks: 50,
  },
  {
    id: 2,
    title: 'Chemistry Paper 2 - Organic Chemistry',
    subject: 'Chemistry (0620)',
    dateCreated: '2025-03-25',
    questionCount: 8,
    totalMarks: 40,
  },
  {
    id: 3,
    title: 'Biology Paper 3 - Ecology',
    subject: 'Biology (0610)',
    dateCreated: '2025-03-23',
    questionCount: 12,
    totalMarks: 60,
  },
  {
    id: 4,
    title: 'Physics Paper 2 - Waves and Optics',
    subject: 'Physics (0625)',
    dateCreated: '2025-03-20',
    questionCount: 9,
    totalMarks: 45,
  },
  {
    id: 5,
    title: 'Chemistry Paper 1 - Atomic Structure',
    subject: 'Chemistry (0620)',
    dateCreated: '2025-03-18',
    questionCount: 7,
    totalMarks: 35,
  },
];

const PaperLibraryPage = () => {
  const [papers] = useState(mockPapers);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const itemsPerPage = 5;

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const filteredPapers = papers.filter(paper => 
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredPapers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const TableView = () => (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: '#ffff',
              '& th': { 
                fontWeight: 'bold',
                color: '#333',
                borderBottom: '2px solid #a4cafe',
              }
            }}>
              <TableCell>Title</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Date Created</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPapers
              .slice(startIndex, endIndex)
              .map((paper) => (
                <TableRow key={paper.id} sx={{ 
                  '&:hover': { backgroundColor: '#f9f9f9' },
                  borderBottom: '2px solid #a4cafe',
                }}>
                  <TableCell>{paper.title}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'inline-block',
                      bgcolor: '#ffff', 
                      color: '#0066cc',
                      border: '1px solid #2e3a59',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '14px'
                    }}>
                      {paper.subject}
                    </Box>
                  </TableCell>
                  <TableCell>{paper.dateCreated}</TableCell>
                  <TableCell>{paper.questionCount}</TableCell>
                  <TableCell>{paper.totalMarks}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton size="small" sx={{ color: '#4dabf5' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#4dabf5' }}>
                        <GetAppIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#4dabf5' }}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#f44336' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredPapers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No papers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <Pagination 
          count={pageCount} 
          page={page} 
          onChange={handlePageChange}
          variant="outlined" 
          color="primary"
          size={isMobileOrTablet ? "small" : "medium"}
        />
      </Box>
    </Box>
  );

  const AccordionView = () => (
    <Box>
      {filteredPapers
        .slice(startIndex, endIndex)
        .map((paper) => (
          <Accordion key={paper.id} sx={{ mb: 1, borderRadius: '4px !important' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0'
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {paper.title}
                </Typography>
                <Box sx={{ 
                  display: 'inline-block',
                  bgcolor: '#ffff', 
                  color: '#0066cc',
                  border: '1px solid #2e3a59',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '14px',
                  mt: 1
                }}>
                  {paper.subject}
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Date Created:</Typography>
                  <Typography variant="body2">{paper.dateCreated}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Questions:</Typography>
                  <Typography variant="body2">{paper.questionCount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Marks:</Typography>
                  <Typography variant="body2">{paper.totalMarks}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                  <IconButton size="small" sx={{ color: '#4dabf5' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#4dabf5' }}>
                    <GetAppIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#4dabf5' }}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#f44336' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      {filteredPapers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          No papers found
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <Pagination 
          count={pageCount} 
          page={page} 
          onChange={handlePageChange}
          variant="outlined" 
          color="primary"
          size={isMobileOrTablet ? "small" : "medium"}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      bgcolor: '#cfe8ff', 
      minHeight: '100vh', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      pb: '60px'
    }}>
      <Box sx={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#333',
        mb: 2
      }}>
        Question Paper Generator
      </Box>
      
      <Box sx={{ 
        width: '100%', 
        bgcolor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        border: '2px solid #a4cafe',
      }}>
        <SearchIcon sx={{ color: '#666', mr: 1 }} />
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search papers by title or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            '& .MuiInputBase-input': {
              padding: '8px 0',
            }
          }}
        />
      </Box>
      
      <Paper sx={{ 
        width: '100%', 
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        mb: 3
      }}>
        {isMobileOrTablet ? <AccordionView /> : <TableView />}
      </Paper>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        position: 'sticky',
        bottom: 20,
        right: 20,
        zIndex: 1
      }}>
        <Button 
          variant="contained"
          sx={{ 
            bgcolor: '#8bc4ff', 
            '&:hover': { bgcolor: '#2196f3' },
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '120px', 
            py: 1
          }}
        >
          Download
        </Button>
      </Box>
    </Box>
  );
};

export default PaperLibraryPage;
