import { Physics } from '@react-three/cannon'
import { Stars } from '@react-three/drei'
import React, { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import EarlyGameMeta from './components/early-game/EarlyGameMeta'
import FlowerRoom from './components/early-game/FlowerRoom'
import Camera from './components/three/Camera'
import Effects from './components/three/Effects'
import FPSControls from './components/three/FPSControls'
import GroundPlane from './components/three/GroundPlane'
import Skydome from './components/three/Skydome'
import { FOG_COLOR } from './theme'

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
      <Effects />
      <fog attach="fog" args={[FOG_COLOR, 1, 40]}/>
      <ambientLight intensity={0.1} />
      <spotLight
        intensity={0.3}
        position={[100, 100, 100]}
        castShadow
        // shadow-mapSize-height={4096}
        // shadow-mapSize-width={4096}
      />
      <Skydome />
      <Stars
        radius={100} // Radius of the inner sphere (default=100)
        depth={50} // Depth of area where stars should fit (default=50)
        count={5000} // Amount of stars (default=5000)
        factor={4} // Size factor (default=4)
        saturation={0} // Saturation 0-1 (default=0)
        fade // Faded dots (default=false)
      />
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const spawn: [number, number, number] = [8, 0, 1]

  return (
    <Suspense fallback={null}>
      <GroundPlane/>
      {/* <FPSControls position={spawn} rotation={[Math.PI/2, 0, -Math.PI/2]} setPaused={setPaused} /> */}
      <FPSControls position={[96, 57, 0]} rotation={[Math.PI/2, 0, -Math.PI/2]} setPaused={setPaused} />
      <EarlyGameMeta />
      {/* <FlowerRoom /> */}
    </Suspense>
  )
}
