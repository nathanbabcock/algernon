import { Box, Plane } from '@react-three/drei'
import React, { useRef } from 'react'
import { Canvas } from 'react-three-fiber'
import { Euler, Group, Vector3 } from 'three'
import NoFutureNoPast from './components/no-future-no-past/NoFutureNoPast'
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
        rotation: new Euler(0, 0, 0, 'YZX'),
        up: new Vector3(0, 0, 1),
      }}
    >
      <FPSControls collisionObjects={collisionObjects.current}/>
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={0.6}
        position={[30, 45, 50]}
        angle={0.2}
        penumbra={1}
        castShadow
        shadow-mapSize-height={16384}
        shadow-mapSize-width={16384}
      />
      
      <group ref={collisionObjects}>
        <Plane position={[0, 0, 0]} args={[1000, 1000]} receiveShadow>
          <meshPhongMaterial attach="material" color="grey"/>
        </Plane>

        <Box position={[0, 0, -0.9]} args={[2, 2, 2]} castShadow receiveShadow>
          <meshPhongMaterial attach="material" color="red"/>
        </Box>

        <NoFutureNoPast/>
      </group>
    </Canvas>
  )
}
