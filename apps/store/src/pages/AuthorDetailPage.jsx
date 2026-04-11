import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Import our new slide components and navigation
import { AuthorProfileSlide } from './author-detail-slides/AuthorProfileSlide';
import { AuthorBioSlide } from './author-detail-slides/AuthorBioSlide';
import { AuthorWorksSlide } from './author-detail-slides/AuthorWorksSlide';
import { AuthorHistorySlide } from './author-detail-slides/AuthorHistorySlide';
import { AuthorCertsSlide } from './author-detail-slides/AuthorCertsSlide';
import AuthorTabNavigation from '../components/ui/AuthorTabNavigation';

// --- MOCK DATA ---
const mockAuthors = [
  { 
     id: 1, 
    authorId: 'AUTH2025ELRO001',
    firstName: 'Elena', 
    lastName: 'Rodriguez', 
    designation: 'Lead Novelist', // This is the CURRENT designation
    organization: 'Starlight Press', 
    totalWorks: 12, 
    recentAuthoredBook: { id: 1, title: 'The Silent Observer' },
    recentEditedBook: { id: 8, title: 'The Gilded Cage' },
    recentContributedBook: null,
    imageUrl: 'https://placehold.co/250/FFC300/808080?text=E.R', 
    // This is the new history array
    history: [
    { id: 101, designation: 'Lead Novelist', department: 'Fiction Division', organization: 'Starlight Press', startDate: '2020-01-15', endDate: null },
    { id: 102, designation: 'Senior Writer', department: 'Sci-Fi Department', organization: 'Quantum Books', startDate: '2015-06-01', endDate: '2019-12-31' },
    { id: 103, designation: 'Junior Editor', department: 'Editorial Board', organization: 'Heritage Publishing', startDate: '2012-08-20', endDate: '2015-05-30' },
    { id: 104, designation: 'Junior Editor', department: 'Editorial Board', organization: 'Heritage Publishing', startDate: '2012-08-20', endDate: '2015-05-30' },
    { id: 105, designation: 'Junior Editor', department: 'Editorial Board', organization: 'Heritage Publishing', startDate: '2012-08-20', endDate: '2015-05-30' },
    { id: 106, designation: 'Junior Editor', department: 'Editorial Board', organization: 'Heritage Publishing', startDate: '2012-08-20', endDate: '2015-05-30' },
    ],
    bio: '...' 
  },
  { 
    id: 2, 
    authorId: 'AUTH2024MACO002',
    firstName: 'Marcus', 
    lastName: 'Cole', 
    designation: 'Sci-Fi Architect', 
    organization: 'Quantum Books University', 
    totalWorks: 5, 
    recentAuthoredBook: { id: 2, title: 'Echoes of Eternity' },
    recentEditedBook: null, // Example for an author who hasn't edited
    recentContributedBook: { id: 4, title: 'City of Shifting Sands' },
    imageUrl: 'https://placehold.co/250/C70039/FFFFFF?text=M.C', 
    bio: '...' 
  },
];
const mockBooks = [
  { id: 1, title: 'The Silent Observer', authorId: 1, imageUrl: 'https://placehold.co/300x400.png?text=By+E.R' },
  { id: 4, title: 'City of Shifting Sands', authorId: 1, imageUrl: 'https://placehold.co/300x400.png?text=By+E.R' },
  { id: 5, title: 'City of Shifting Sands', authorId: 1, imageUrl: 'https://placehold.co/300x400.png?text=By+E.R' },
  { id: 6, title: 'City of Shifting Sands', authorId: 1, imageUrl: 'https://placehold.co/300x400.png?text=By+E.R' },
  { id: 7, title: 'City of Shifting Sands', authorId: 1, imageUrl: 'https://placehold.co/300x400.png?text=By+E.R' },
  { id: 8, title: 'City of Shifting Sands', authorId: 1, imageUrl: 'https://placehold.co/300x400.png?text=By+E.R' },
  
  { id: 2, title: 'Echoes of Eternity', authorId: 2, imageUrl: 'https://placehold.co/300x400.png?text=By+M.C' },
  { id: 3, title: 'Whispers in the Void', authorId: 2, imageUrl: 'https://placehold.co/300x400.png?text=By+M.C' },
];
// --- END MOCK DATA ---

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100vw' : '-100vw', opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100vw' : '-100vw', opacity: 0 }),
};

function AuthorDetailPage() {
  const { authorId } = useParams();
  const author = mockAuthors.find(a => a.id == authorId);
  const authorBooks = mockBooks.filter(book => book.authorId == authorId);
  
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!author) {
    return <Typography variant="h4" align="center">Author not found!</Typography>;
  }

  const slides = [
    <AuthorProfileSlide key="profile" author={author} />,
    <AuthorBioSlide key="bio" author={author} />,
    <AuthorWorksSlide key="works" author={author} books={authorBooks} />,
    <AuthorHistorySlide key="history" author={author} />,
    <AuthorCertsSlide key="certs" author={author} />,
  ];

  const setSlide = (newSlide) => {
    const newDirection = newSlide > activeSlide ? 1 : -1;
    setDirection(newDirection);
    setActiveSlide(newSlide);
  };

  return (
    <>
      <AuthorTabNavigation activeSlide={activeSlide} setActiveSlide={setSlide} />
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            style={{
              position: 'absolute',
              width: '100%',
              padding: '0 5%',
            }}
          >
            {slides[activeSlide]}
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  );
}

export default AuthorDetailPage;