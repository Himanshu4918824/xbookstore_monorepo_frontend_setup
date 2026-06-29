import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

function BookModel({ images, spineThickness }) {

  // useMemo ka use karke URLs ke peeche unique timestamp lagayein
  // Isse browser cache bypass ho jayega aur directly S3 se CORS header load hoga
  const [frontImageUrl, backImageUrl] = useMemo(() => {
    const front = images?.[0]?.image || 'https://placehold.co/400x600';
    const back = images?.[1]?.image || 'https://placehold.co/400x600';

    // Agar placeholder nahi hai (yaani S3 URL hai), toh hi timestamp jodein
    const finalFront = front.includes('placeholder') || front.includes('placehold.co')
      ? front
      : `${front}?cb=${Date.now()}`;

    const finalBack = back.includes('placeholder') || back.includes('placehold.co')
      ? back
      : `${back}?cb=${Date.now()}`;

    return [finalFront, finalBack];
  }, [images]);

  // useLoader me crossOrigin set rakhein
  const [frontTexture, backTexture] = useLoader(
    THREE.TextureLoader,
    [frontImageUrl, backImageUrl],
    (loader) => {
      loader.setCrossOrigin('anonymous');
    }
  );

  const bookWidth = 2;
  const bookHeight = 3;

  return (
    <mesh>
      <boxGeometry args={[bookWidth, bookHeight, spineThickness]} />
      <meshStandardMaterial attach="material-0" color="white" />
      <meshStandardMaterial attach="material-1" color="#cccccc" />
      <meshStandardMaterial attach="material-2" color="white" />
      <meshStandardMaterial attach="material-3" color="white" />
      <meshStandardMaterial attach="material-4" map={frontTexture} />
      <meshStandardMaterial attach="material-5" map={backTexture} />
    </mesh>
  );
}

export default BookModel;