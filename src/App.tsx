import { Physics, usePlane } from '@react-three/cannon'
import React, { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import { Euler, Vector3 } from 'three'
import NoFutureNoPast from './components/no-future-no-past/NoFutureNoPast'
import FPSControls from './FPSControls'

export default function App () {
  const contactMaterial = {
    contactEquationStiffness: 1e4,
    friction: 0.001,
  }

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

      <Physics gravity={[0, 0, -25]} defaultContactMaterial={contactMaterial}>
        <PhysicsWorld/>
      </Physics>
    </Canvas>
  )
}

function GroundPlane() {
  const [plane] = usePlane(() => ({ type: 'Static' }))

  return <mesh ref={plane} receiveShadow>
    <planeBufferGeometry args={[1000, 1000]}>
      <meshPhongMaterial attach="material" color="grey"/>
    </planeBufferGeometry>
  </mesh>
}

export function PhysicsWorld() {
  const setPaused = (paused: boolean) => {
    if (paused)
      document.getElementById('pause')!.classList.add('visible')
    else
      document.getElementById('pause')!.classList.remove('visible')
  }
  setPaused(document.pointerLockElement !== document.body)

  return (<Suspense fallback={null}>

    <FPSControls setPaused={setPaused}/>

    <GroundPlane/>

    <NoFutureNoPast/>

    {/* <Infinite1DMaze requestCollisionUpdate={requestCollisionUpdate}/> */}
  </Suspense>)
}
