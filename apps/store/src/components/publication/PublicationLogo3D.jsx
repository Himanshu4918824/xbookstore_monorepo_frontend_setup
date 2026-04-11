import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
    const { scene } = useGLTF('/models/swords.glb');

    // --- THIS IS THE DEFINITIVE FIX ---
    // We go through each part of the loaded 3D model...
    scene.traverse((child) => {
        // ...and if it's a mesh (a visible object)...
        if (child.isMesh) {
            // ...we replace its material with our new black material.
            child.material = new THREE.MeshPhysicalMaterial({
                color: 'rgba(0, 0, 0, 0.67)',
                metalness: 0.7,
                roughness: 0.4,
            });
        }
    });
    // --- END OF FIX ---

    return <primitive object={scene} scale={0.15} />;
}

function PublicationLogo3D() {
    return (
        <Box sx={{ width: '100%', maxWidth: '500px', height: '500px', mx: 'auto', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
            <Canvas camera={{ position: [0, 25, 6], fov: 50, near: 0.01, far: 1000 }} >
                <Suspense fallback={null}>
                    <Stage environment="studio" intensity={0.8} shadows={false}>
                        <Model />
                    </Stage>
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </Box>
    );
}

useGLTF.preload('/models/swords.glb');

export default PublicationLogo3D;