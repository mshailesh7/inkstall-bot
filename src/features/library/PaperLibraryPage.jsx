import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SearchIcon from '@mui/icons-material/Search';

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
  const [papers, setPapers] = useState(mockPapers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeletePaper = (id) => {
    setPapers(papers.filter(paper => paper.id !== id));
  };

  const filteredPapers = papers.filter(paper => 
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Paper Library
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search papers by title or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((paper) => (
                <TableRow key={paper.id}>
                  <TableCell>{paper.title}</TableCell>
                  <TableCell>
                    <Chip 
                      label={paper.subject} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{new Date(paper.dateCreated).toLocaleDateString()}</TableCell>
                  <TableCell>{paper.questionCount}</TableCell>
                  <TableCell>{paper.totalMarks}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        color="primary" 
                        title="Edit Paper"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="primary"
                        title="Download PDF"
                        size="small"
                      >
                        <GetAppIcon />
                      </IconButton>
                      <IconButton 
                        color="secondary"
                        title="Start Correction"
                        size="small"
                      >
                        <FactCheckIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeletePaper(paper.id)}
                        title="Delete Paper"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredPapers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No papers found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPapers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained"
          onClick={() => window.location.href = '/generator'}
        >
          Generate New Paper
        </Button>
      </Box>
    </Box>
  );
};

export default PaperLibraryPage;
