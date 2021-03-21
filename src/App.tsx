import { Physics, useBox, usePlane } from '@react-three/cannon';
import { PointerLockControls } from '@react-three/drei';
import React, { useEffect, useState } from "react";
import { Canvas } from 'react-three-fiber';

function Plane(props: any) {
  // Register plane as a physics body with zero mass
  const [ref] = usePlane(() => ({
    rotation: [0, 0, 0],
    type: 'Static',
    ...props,
  }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color="#272727" />
    </mesh>
  )
}

function Box(props: any) {
  // Register box as a physics body with mass
  const [ref] = useBox(() => ({ mass: 1, ...props }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial attach="material" />
    </mesh>
  )
}

export default function App() {
  const [showPlane, set] = useState(true)
  // When React removes (unmounts) the upper plane after 5 sec, objects should drop ...
  // This may seem like magic, but as the plane unmounts it removes itself from cannon and that's that
  useEffect(() => void setTimeout(() => set(false), 5000), [])
  useEffect(() => {document.addEventListener('keydown', (event: KeyboardEvent) => {
    switch ( event.code ) {
      case 'ArrowUp':
      case 'KeyW':
        console.log('move forward')
        break;
    }
  })})

  return <Canvas
    camera={{
      position: [0, 0, 15],
      near: 0.1,
      far: 100000,
    }}
  >
    <PointerLockControls />
    <ambientLight intensity={0.5} />
    <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
    <Physics gravity={[0, 0, -25]}>
      <Plane position={[0, 0, -10]} />
      {showPlane && <Plane position={[0, 0, 0]} />}
      <Box position={[1, 0, 1]} />
      <Box position={[2, 1, 5]} />
      <Box position={[0, 0, 6]} />
      <Box position={[-1, 1, 8]} />
      <Box position={[-2, 2, 13]} />
      <Box position={[2, -1, 13]} />
      {!showPlane && <Box position={[0.5, 1.0, 20]} />}
    </Physics>
  </Canvas>
}
