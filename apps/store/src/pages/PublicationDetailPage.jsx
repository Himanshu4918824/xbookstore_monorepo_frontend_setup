import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Import all our new slide components
import { PublicationProfileSlide } from './publication-detail-slides/PublicationProfileSlide';
import { PublicationContactSlide } from './publication-detail-slides/PublicationContactSlide';
import { DirectorDetailsSlide } from './publication-detail-slides/DirectorDetailsSlide';
import { PublicationWorksSlide } from './publication-detail-slides/PublicationWorksSlide';
import { PublicationAuthorsSlide } from './publication-detail-slides/PublicationAuthorsSlide';
import { PublicationContactFormSlide } from './publication-detail-slides/PublicationContactFormSlide';
import PublicationTabNavigation from '../components/ui/PublicationTabNavigation';

// --- DEFINITIVE MOCK DATA ---
const mockPublicationData = {
    id: 1,
    name: 'Xoffencer International Book Publication House',
    nature: 'International Publisher',
    about: 'Xoffencer International is a leading publisher dedicated to bringing new and established voices to a global audience, focusing on academic, technical, and literary works.',
    website: 'www.xoffencerpublication.in',
    email: 'contact@xoffencerpublication.in',
    director: { 
        name: 'Mr. Xoffencer', 
        designation: 'Director',
        organization: 'Xoffencer International Book Publication House',
        profilePic: 'https://placehold.co/300/162735/FFFFFF?text=Director',
        contact: '+91 987 654 3210',
        email: 'director@xoffencerpublication.in',
        address: 'New Delhi, India'
    },
    contact: {
        indiaAddress: '123 Publishing Lane, New Delhi, India 110001',
        internationalAddress: '456 Global Avenue, London, UK SW1A 0AA',
        phone: '+91 123 456 7890'
    },
    books: [
        { id: 1, title: 'The Silent Observer', imageUrl: 'https://placehold.co/300x400.png?text=Book+1' },
        { id: 8, title: 'The Gilded Cage', imageUrl: 'https://placehold.co/300x400.png?text=Book+2' },
        { id: 2, title: 'Echoes of Eternity', imageUrl: 'https://placehold.co/300x400.png?text=Book+3' },
    ],
    authors: [ // This should be a list of participant objects
        { role: 'Author', author: { id: 1, firstName: 'Elena', lastName: 'Rodriguez', designation: 'Novelist', imageUrl: 'https://placehold.co/150/FFC300/808080?Text=E.R' } },
        { role: 'Author', author: { id: 2, firstName: 'Marcus', lastName: 'Cole', designation: 'Professor', imageUrl: 'https://placehold.co/150/C70039/FFFFFF?text=M.C' } },
    ]
};
// --- END MOCK DATA ---

const slideVariants = { enter: (direction) => ({ x: direction > 0 ? '100vw' : '-100vw', opacity: 0 }), center: { zIndex: 1, x: 0, opacity: 1 }, exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100vw' : '-100vw', opacity: 0 }), };

function PublicationDetailPage() {
    const { publicationId } = useParams(); // In a real app, you'd fetch data based on this ID
    const publication = mockPublicationData;
    const [activeSlide, setActiveSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    if (!publication) { return <Typography variant="h4" align="center">Publication not found!</Typography>; }

    const slides = [
        <PublicationProfileSlide key="profile" publication={publication} />,
        <PublicationContactSlide key="contact" publication={publication} />,
        <DirectorDetailsSlide key="director" director={publication.director} />,
        <PublicationWorksSlide key="works" publication={publication} books={publication.books} />,
        <PublicationAuthorsSlide key="authors" authors={publication.authors} />,
        <PublicationContactFormSlide key="form" publication={publication} />,
    ];

    const setSlide = (newSlide) => {
        const newDirection = newSlide > activeSlide ? 1 : -1;
        setDirection(newDirection);
        setActiveSlide(newSlide);
    };

    return (
        <>
            <PublicationTabNavigation activeSlide={activeSlide} setActiveSlide={setSlide} />
            <Container maxWidth={false} disableGutters sx={{ height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={activeSlide}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        style={{ position: 'absolute', width: '100%', padding: '0 5%' }}
                    >
                        {slides[activeSlide]}
                    </motion.div>
                </AnimatePresence>
            </Container>
        </>
    );
}

export default PublicationDetailPage;