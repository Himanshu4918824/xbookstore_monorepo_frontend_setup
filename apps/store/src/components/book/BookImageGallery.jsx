import React, { useMemo, Suspense } from 'react';
import { Box, Paper } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import BookModel from './BookModel';

function BookImageGallery({ images, formatDetails }) {
  // --- DYNAMIC SPINE CALCULATION ---
  // This logic is the same, but we scale it down for the 3D scene.
  const paperThicknessPerPageMM = 0.1;
  const hardcoverBoardThicknessMM = 0.5;
  const spineThickness = useMemo(() => {
    if (!formatDetails || !formatDetails.pages) return 0.2;
    const totalPaperThickness = formatDetails.pages * paperThicknessPerPageMM;
    const totalCoverThickness = formatDetails.binding_type === 'Hardcover' ? hardcoverBoardThicknessMM * 2 : 0;
    const calculatedThickness = totalPaperThickness + totalCoverThickness;
    // We scale the thickness value to fit our 3D world's dimensions.
    return Math.min(Math.max(calculatedThickness, 15), 50) / 100;
  }, [formatDetails]);

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: 2,
          backgroundColor: 'transparent',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        {/* 
          The Canvas component creates a 3D world for us. 
          Suspense is a React feature that allows us to show a fallback
          while our 3D models and textures are loading.
        */}
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={null}>
            {/* This provides realistic, soft ambient lighting for our scene. */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            {/* This is our 3D book model. We pass it the images and calculated thickness. */}
            <BookModel images={images} spineThickness={spineThickness} />

            {/* 
              This is the magic component from the 'drei' library.
              It automatically handles all the logic for drag-to-rotate,
              zooming with the scroll wheel, and panning. It is extremely
              powerful and reliable.
            */}
            <OrbitControls enableZoom={false} enablePan={false} />

            {/* This provides a professional studio lighting environment. */}
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </Paper>
      {/* We no longer need the gallery buttons as the user can freely rotate the model */}
    </Box>
  );
}

export default BookImageGallery;