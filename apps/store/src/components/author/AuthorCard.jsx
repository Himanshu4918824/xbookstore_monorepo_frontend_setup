import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function AuthorCard({ author }) {
  return (
    // Link will wrap the card to make the whole thing clickable
    <Link to={`/authors/${author.id}`} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ duration: 0.2 }}
        style={{ height: '100%' }}
      >
        <Card variant="wood" sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          backgroundColor: 'background.paper',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
        }}>
          <CardMedia 
            component="img"
            sx={{
              width: 140,
              height: 140,
              borderRadius: '50%', // Makes the image circular
              margin: '16px auto 0', // Centers the image and adds space
              objectFit: 'cover',
            }}
            image={author.imageUrl}
            alt={`${author.firstName} ${author.lastName}`}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {author.firstName} {author.lastName}
            </Typography>
            <Typography color="text.secondary">
              {author.designation}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

export default AuthorCard;