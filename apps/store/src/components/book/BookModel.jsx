import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// This component represents our 3D book in the scene.
function BookModel({ images, spineThickness }) {
  // useLoader is a helper to load textures (our images).
  const [frontTexture, backTexture] = useLoader(THREE.TextureLoader, [
    images[0]?.image || 'https://placehold.co/400x600',
    images[1]?.image || 'https://placehold.co/400x600',
  ]);

  // We define the dimensions of our book.
  const bookWidth = 2;
  const bookHeight = 3;

  return (
    // A 'mesh' is a 3D object. It has a shape (geometry) and a surface (material).
    // We will create a box shape for our book.
    <mesh>
      {/* This is the 3D box shape. Its dimensions are width, height, and depth (our spine thickness). */}
      <boxGeometry args={[bookWidth, bookHeight, spineThickness]} />

      {/* These are the materials (the textures/colors) for each of the 6 faces of the box. */}
      <meshStandardMaterial attach="material-0" color="white" /> {/* Right side (pages) */}
      <meshStandardMaterial attach="material-1" color="#cccccc" /> {/* Left side (spine) */}
      <meshStandardMaterial attach="material-2" color="white" /> {/* Top side */}
      <meshStandardMaterial attach="material-3" color="white" /> {/* Bottom side */}
      <meshStandardMaterial attach="material-4" map={frontTexture} /> {/* Front Cover */}
      <meshStandardMaterial attach="material-5" map={backTexture} /> {/* Back Cover */}
    </mesh>
  );
}

export default BookModel;