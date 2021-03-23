import { Plane, PointerLockControls } from '@react-three/drei';
import React from 'react';
import { Canvas } from 'react-three-fiber';

export default function App() {
  return <Canvas
    shadowMap
    camera={{
      position: [0, 0, 15],
      near: 0.1,
      far: 100000,
    }}
  >
    
    {/* <OrbitControls/> */}
    <PointerLockControls/>
    <ambientLight intensity={0.5} />
    <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
    
    <Plane position={[0, 0, 0]} args={[100, 100]}/>
  </Canvas>
}
