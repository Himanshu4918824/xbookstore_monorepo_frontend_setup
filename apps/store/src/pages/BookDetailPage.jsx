import React, { useState, useMemo, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Import our separate slide components
import { ProductInfoSlide } from './book-detail-slides/ProductInfoSlide';
import { ParticipantsSlide } from './book-detail-slides/ParticipantsSlide';
import { DetailsSlide } from './book-detail-slides/DetailsSlide';
import { TableOfContentsSlide } from './book-detail-slides/TableOfContentsSlide';
import { CertificatesSlide } from './book-detail-slides/CertificatesSlide';

import StickyTabNavigation from '../components/ui/StickyTabNavigation';
import { getQueryParam } from '../utils/urlHelpers';
import { useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';
import { useLocation, useParams } from 'react-router-dom';

// --- DEFINITIVE MOCK DATA ---
// This data is complete and contains all fields needed by all slides.
const mockBookData = {
  id: 1,
  title: 'The Silent Observer',
  isbn: '978-3-16-148410-0',
  publication_date: '2023-05-15',
  description: 'A thrilling mystery that will keep you on the edge of your seat. Follow Detective Harding as he unravels a conspiracy that goes deeper than he could ever imagine.',
  participants: [
    { role: 'Editor', author: { id: 1, firstName: 'Elena', lastName: 'Rodriguez', designation: 'Lead Editor', imageUrl: 'https://placehold.co/150/FFC300/808080?text=E.R' } },
    { role: 'Editor', author: { id: 2, firstName: 'Marcus', lastName: 'Cole', designation: 'Content Architect', imageUrl: 'https://placehold.co/150/C70039/FFFFFF?text=M.C' } },
  ],
  chapters: [
    { id: 201, title: 'Chapter 1: The First Clue', contributors: [{ author: { id: 3, firstName: 'Aisha', lastName: 'Khan' } }] },
    { id: 202, title: 'Chapter 2: Shadows in the Alley', contributors: [{ author: { id: 4, firstName: 'Samuel', lastName: 'Chen' } }] },
    { id: 203, title: 'Chapter 3: The Unspoken Truth', contributors: [{ author: { id: 5, firstName: 'Olivia', lastName: 'Grant' } }, { author: { id: 6, firstName: 'Ben', lastName: 'Carter' } }] },
    { id: 204, title: 'Chapter 4: The Unspoken Truth', contributors: [{ author: { id: 5, firstName: 'Olivia', lastName: 'Grant' } }, { author: { id: 6, firstName: 'Ben', lastName: 'Carter' } }] },
    { id: 205, title: 'Chapter 5: The Unspoken Truth', contributors: [{ author: { id: 5, firstName: 'Olivia', lastName: 'Grant' } }, { author: { id: 6, firstName: 'Ben', lastName: 'Carter' } }] },
    { id: 206, title: 'Chapter 6: The Unspoken Truth', contributors: [{ author: { id: 5, firstName: 'Olivia', lastName: 'Grant' } }, { author: { id: 6, firstName: 'Ben', lastName: 'Carter' } }] },
  ],
  rating: 4.5,
  reviews: 120,
  images: [
    { id: 1, image: 'https://placehold.co/400x600/162735/BDC1C8?text=Front+Cover' },
    { id: 2, image: 'https://placehold.co/400x600/BDC1C8/162735?text=Back+Cover' },
  ],
  formats: [
    { id: 101, binding_type: 'Paperback', quality: 'Standard', language: 'English', mrp: '599.00', stock: 50, pages: 320, paper_quality: '70GSM', length_mm: 210, width_mm: 148, weight_grams: 350, sale_type: 'percentage', sale_value: '15', affiliate_discount_percentage: '10' },
    { id: 104, binding_type: 'Hardcover', quality: 'Standard', language: 'English', mrp: '999.00', stock: 25, pages: 310, paper_quality: '80GSM Matte', length_mm: 215, width_mm: 152, weight_grams: 550, sale_type: 'flat', sale_value: '200', affiliate_discount_percentage: '10' },
  ],
};
// --- END MOCK DATA ---

// --- SLIDER ANIMATION VARIANTS ---
const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100vw' : '-100vw', opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100vw' : '-100vw', opacity: 0 }),
};

// --- MAIN PAGE COMPONENT ---
function BookDetailPage() {
  const { bookId } = useParams()

  const { fetchBookbyID, bookData } = useContext(ApiContext)

  useEffect(() => {
    fetchBookbyID(bookId)
  }, [bookId])

  const book = bookData || mockBookData;
  // This check prevents any crashes. The component will not render until the data is ready.
  console.log(bookData)
  if (!book) {
    return <Typography>Loading...</Typography>;
  }
  // --- ALL STATE AND LOGIC LIVES IN THE PARENT COMPONENT ---
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const [selectedBinding, setSelectedBinding] = useState(book.formats[0].binding_type);
  const [selectedQuality, setSelectedQuality] = useState(book.formats[0].quality || 'Standard');
  const [selectedLanguage, setSelectedLanguage] = useState(book?.formats[0]?.language);
  const [isAffiliateLink, setIsAffiliateLink] = useState(false);

  useEffect(() => { const refCode = getQueryParam('ref'); if (refCode) setIsAffiliateLink(true); }, []);

  const availableBindings = useMemo(() => [...new Set(book.formats.map(f => f.binding_type))], [book.formats]);
  const availableQualities = useMemo(() => { const qualities = book.formats.filter(f => f.binding_type === selectedBinding).map(f => f.quality); return [...new Set(qualities)]; }, [book.formats, selectedBinding]);
  const availableLanguages = useMemo(() => { const languages = book.formats.filter(f => f.binding_type === selectedBinding && f.quality === selectedQuality).map(f => f.language); return [...new Set(languages)]; }, [book.formats, selectedBinding, selectedQuality]);

  const selectedFormat = useMemo(() => {
    return book.formats.find(f => f.binding_type === selectedBinding && f.quality === selectedQuality && f.language === selectedLanguage) || null;
  }, [book.formats, selectedBinding, selectedQuality, selectedLanguage]);

  const priceDetails = useMemo(() => { if (!selectedFormat) return { displayPrice: 'N/A', originalPrice: null, discount: null, isSale: false }; const mrp = parseFloat(selectedFormat.mrp); let finalPrice = mrp; let discountText = null; let salePrice = mrp; if (selectedFormat.sale_type && selectedFormat.sale_value) { if (selectedFormat.sale_type === 'percentage') { salePrice = mrp * (1 - parseFloat(selectedFormat.sale_value) / 100); discountText = `${selectedFormat.sale_value}% off`; } else if (selectedFormat.sale_type === 'flat') { salePrice = mrp - parseFloat(selectedFormat.sale_value); const percentOff = Math.round(((mrp - salePrice) / mrp) * 100); discountText = `${percentOff}% off`; } } finalPrice = salePrice; if (isAffiliateLink && selectedFormat.affiliate_discount_percentage) { finalPrice = salePrice * (1 - parseFloat(selectedFormat.affiliate_discount_percentage) / 100); } return { displayPrice: `₹${Math.round(finalPrice)}`, originalPrice: `₹${Math.round(mrp)}`, discount: discountText, isSale: finalPrice < mrp, }; }, [selectedFormat, isAffiliateLink]);

  const handleBindingChange = (event, newBinding) => { if (newBinding) { setSelectedBinding(newBinding); const firstAvailableQuality = book.formats.find(f => f.binding_type === newBinding)?.quality || 'Standard'; setSelectedQuality(firstAvailableQuality); const firstAvailableLanguage = book.formats.find(f => f.binding_type === newBinding && f.quality === firstAvailableQuality)?.language; setSelectedLanguage(firstAvailableLanguage); } };
  const handleQualityChange = (event, newQuality) => { if (newQuality) { setSelectedQuality(newQuality); const firstAvailableLang = book.formats.find(f => f.binding_type === selectedBinding && f.quality === newQuality)?.language; setSelectedLanguage(firstAvailableLang); } };
  const handleLanguageChange = (event, newLanguage) => { if (newLanguage) setSelectedLanguage(newLanguage); };

  // We now pass all the necessary state and handlers down to the child slides as props
  const slides = [
    <ProductInfoSlide
      key="product-info"
      book={book}
      selectedFormat={selectedFormat}
      priceDetails={priceDetails}
      availableBindings={availableBindings}
      selectedBinding={selectedBinding}
      handleBindingChange={handleBindingChange}
      availableQualities={availableQualities}
      selectedQuality={selectedQuality}
      handleQualityChange={handleQualityChange}
      availableLanguages={availableLanguages}
      selectedLanguage={selectedLanguage}
      handleLanguageChange={handleLanguageChange}
      isAffiliateLink={isAffiliateLink}
    />,
    <ParticipantsSlide key="participants" participants={book.participants} />,
    <DetailsSlide key="details" book={book} selectedFormat={selectedFormat} />,
    <TableOfContentsSlide key="toc" book={book} />,
    <CertificatesSlide key="certs" />,
  ];

  const setSlide = (newSlide) => {
    const newDirection = newSlide > activeSlide ? 1 : -1;
    setDirection(newDirection);
    setActiveSlide(newSlide);
  };

  return (
    <>
      <StickyTabNavigation activeSlide={activeSlide} setActiveSlide={setSlide} />
      <Container
        maxWidth={false}
        disableGutters
        sx={{ height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
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
            style={{ position: 'absolute', width: '100%', padding: '0 5%' }}
          >
            {slides[activeSlide]}
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  );
}

export default BookDetailPage;