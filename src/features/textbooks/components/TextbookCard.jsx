// src/features/textbooks/components/TextbookCard.jsx
import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

// Default placeholder image for textbooks without a cover
const DEFAULT_COVER_IMAGE = 'https://via.placeholder.com/300x400?text=No+Cover+Available';

const TextbookCard = ({
  textbook,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={textbook.coverImageUrl || DEFAULT_COVER_IMAGE}
        alt={`Cover of ${textbook.title}`}
        sx={{ objectFit: 'contain', bgcolor: '#f5f5f5', p: 1 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {textbook.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          by {textbook.author}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Publisher:</strong> {textbook.publisher}
          </Typography>
          {textbook.edition && (
            <Typography variant="body2" component="div">
              <strong>Edition:</strong> {textbook.edition}
            </Typography>
          )}
          {textbook.publicationYear && (
            <Typography variant="body2" component="div">
              <strong>Year:</strong> {textbook.publicationYear}
            </Typography>
          )}
          {textbook.isbn && (
            <Typography variant="body2" component="div">
              <strong>ISBN:</strong> {textbook.isbn}
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Tooltip title="Edit Textbook">
            <IconButton size="small" color="primary" onClick={onEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Textbook">
            <IconButton size="small" color="error" onClick={onDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Button size="small" color="primary" onClick={onView}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TextbookCard;