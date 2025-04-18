// src/features/textbooks/components/TextbookCard.jsx
import React, { useState } from 'react';
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Default placeholder image as base64 - light gray with "No Cover Available" text
const DEFAULT_COVER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjVmNWY1Ij48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMThweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+Tm8gQ292ZXIgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';

const TextbookCard = ({
  textbook,
  onEdit,
  onDelete,
  onView,
}) => {
  const [imgSrc, setImgSrc] = useState(textbook.coverImageUrl || DEFAULT_COVER_IMAGE);
  
  // Function to handle cover image loading errors
  const handleImageError = () => {
    console.log('Image failed to load, using default image');
    setImgSrc(DEFAULT_COVER_IMAGE);
  };

  // Function to open PDF in new tab if URL exists
  const handleOpenPdf = (e) => {
    e.stopPropagation();
    if (textbook.pdfUrl) {
      window.open(textbook.pdfUrl, '_blank');
    }
  };

  return (
    <Card 
      sx={{ 
        width: 345, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box 
        sx={{ 
          height: 250, 
          position: 'relative',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CardMedia
          component="img"
          image={imgSrc}
          alt={`Cover of ${textbook.title}`}
          onError={handleImageError}
          sx={{ 
            height: '100%',
            objectFit: 'contain',
            padding: 1
          }}
        />
      </Box>
      <CardContent sx={{ 
        flexGrow: 1, 
        pt: 2,
        pb: 0,
        px: 2
      }}>
        <Box sx={{ mb: 1.5 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              lineHeight: 1.4,
              mb: 0.5
            }}
          >
            {textbook.title}
          </Typography>
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}
          >
            by {textbook.author}
          </Typography>
        </Box>
        <Box sx={{ mt: 1.5 }}>
          <Typography 
            variant="body2" 
            component="div"
            sx={{ 
              fontSize: '0.875rem',
              mb: 0.5
            }}
          >
            <strong>Publisher:</strong> {textbook.publisher}
          </Typography>
          {textbook.edition && (
            <Typography 
              variant="body2" 
              component="div"
              sx={{ 
                fontSize: '0.875rem',
                mb: 0.5
              }}
            >
              <strong>Edition:</strong> {textbook.edition}
            </Typography>
          )}
          {textbook.publicationYear && (
            <Typography 
              variant="body2" 
              component="div"
              sx={{ 
                fontSize: '0.875rem',
                mb: 0.5
              }}
            >
              <strong>Year:</strong> {textbook.publicationYear}
            </Typography>
          )}
          {textbook.isbn && (
            <Typography 
              variant="body2" 
              component="div"
              sx={{ 
                fontSize: '0.875rem',
                mb: 0.5
              }}
            >
              <strong>ISBN:</strong> {textbook.isbn}
            </Typography>
          )}
          {textbook.pdfUrl && (
            <Typography 
              variant="body2" 
              component="div"
              sx={{ 
                fontSize: '0.875rem',
                mb: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={handleOpenPdf}
            >
              <PictureAsPdfIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
              <span>PDF Available</span>
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ 
        justifyContent: 'space-between', 
        p: 2,
        borderTop: '1px solid rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Textbook">
            <IconButton 
              size="small" 
              color="primary" 
              onClick={onEdit}
              sx={{
                p: 0.75,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)'
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Textbook">
            <IconButton 
              size="small" 
              color="error" 
              onClick={onDelete}
              sx={{
                p: 0.75,
                '&:hover': {
                  backgroundColor: 'rgba(220, 53, 69, 0.1)'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Button 
          size="small" 
          color="primary" 
          onClick={onView}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            borderRadius: 1,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)'
            }
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TextbookCard;