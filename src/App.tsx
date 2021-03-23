import { Box, Plane } from '@react-three/drei'
import React, { useRef } from 'react'
import { Canvas } from 'react-three-fiber'
import { Group } from 'three'
import FPSControls from './FPSControls'

export default function App() {
  const collisionObjects = useRef<Group>()

  return (
    <Canvas
      shadowMap
      camera={{
        position: [0, 0, 15],
        near: 0.1,
        far: 100000,
      }}
    >
      {/* <OrbitControls/> */}
      <FPSControls collisionObjects={collisionObjects.current}/>
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
      
      <group ref={collisionObjects}>
        <Plane position={[0, 0, -100]} args={[100, 100]} receiveShadow/>

        <Box position={[2, 2, -100]} args={[2, 2, 2]} castShadow receiveShadow>
          <meshLambertMaterial color="red"/>
        </Box>
      </group>
    </Canvas>
  )
}
