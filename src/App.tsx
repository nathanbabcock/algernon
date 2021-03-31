import { Physics } from '@react-three/cannon'
import React, { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import Infinite1DMaze from './components/infinite-1d-maze/Infinite1DMaze'
import Camera from './components/three/Camera'
import FPSControls from './components/three/FPSControls'
import GroundPlane from './components/three/GroundPlane'
import Skydome from './components/three/Skydome'

export default function App () {
  const contactMaterial = {
    contactEquationStiffness: 1e4,
    friction: 0.001,
  }

  return (
    <Canvas shadowMap>
      <Camera
        position={[0, 0, 15]}
        near={0.1}
        far={100000}
        rotation={[0, 0, 0, 'YZX']}
        up={[0, 0, 1]}
      />
      <fog attach="fog" args={['black', 1, 40]}/>
      <ambientLight intensity={0.25} />
      <directionalLight
        intensity={0.6}
        position={[30, 45, 50]}
        castShadow
        shadow-mapSize-height={16384}
        shadow-mapSize-width={16384}
      />
      <Skydome />
      <Physics gravity={[0, 0, -25]} defaultContactMaterial={contactMaterial}>
        <PhysicsWorld />
      </Physics>
    </Canvas>
  )
}

export function PhysicsWorld() {
  const setPaused = (paused: boolean) => {
    if (paused)
      document.getElementById('pause')!.classList.add('visible')
    else
      document.getElementById('pause')!.classList.remove('visible')
  }
  setPaused(document.pointerLockElement !== document.body)

  return (
    <Suspense fallback={null}>
      <FPSControls setPaused={setPaused}/>
      <GroundPlane/>
      <Infinite1DMaze/>
    </Suspense>
  )
}
