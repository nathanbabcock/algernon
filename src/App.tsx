import { Physics, useBox, usePlane } from '@react-three/cannon';
import { PointerLockControls } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';

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
      <boxGeometry attach="geometry"/>
      <meshStandardMaterial attach="material" />
    </mesh>
  )
}

function Wall(props: any) {
  // Register box as a physics body with mass
  const [ref] = useBox(() => ({ type: 'Static', args: [4, 4, 4], ...props }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[4, 4, 4]}/>
      <meshStandardMaterial attach="material" />
    </mesh>
  )
}

function SpecialBox(props: any) {
  // Register box as a physics body with mass
  const [ref, body] = useBox(() => ({ mass: 1, angularDamping: 1, ...props }))
  const { camera } = useThree()

  useFrame(() => {
    const MOVESPEED = 10;
    const inputVelocity = {x: 0, y: 0, z: 0};

    if (props.controls.forward)
      inputVelocity.y += MOVESPEED
    if (props.controls.back)
      inputVelocity.y -= MOVESPEED
    if (props.controls.left)
      inputVelocity.x -= MOVESPEED
    if (props.controls.right)
      inputVelocity.x += MOVESPEED

    const refPos = ref.current!.position
    // const refRot = ref.current!.rotation
    camera.position.set(refPos.x, refPos.y, refPos.z)
    // camera.rotation.set(refRot.x, refRot.y, refRot.z)

    if (inputVelocity.x === 0 && inputVelocity.y === 0 && inputVelocity.z === 0)
      return;

    body.velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z)
  })

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry attach="geometry" />
      <meshStandardMaterial attach="material" />
    </mesh>
  )
}

export default function App() {
  const [showPlane, set] = useState(true)
  // When React removes (unmounts) the upper plane after 5 sec, objects should drop ...
  // This may seem like magic, but as the plane unmounts it removes itself from cannon and that's that
  useEffect(() => void setTimeout(() => set(false), 5000), [])

  const controls = {
    forward: false,
    back: false,
    left: false,
    right: false,
    jump: false,
  };

  useEffect(() => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW':
          controls.forward = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          controls.back = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          controls.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          controls.right = true;
          break;
      }
    });

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW':
          controls.forward = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          controls.back = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          controls.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          controls.right = false;
          break;
      }
    });
  })

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
    <Physics gravity={[0, 0, -25]}>
      <Plane position={[0, 0, -10]} />
      {showPlane && <Plane position={[0, 0, 0]} />}
      <Box position={[1, 0, 1]} />
      <Box position={[2, 1, 5]} />
      <Box position={[0, 0, 6]} />
      <Box position={[-1, 1, 8]} />
      <Box position={[-2, 2, 13]} />
      <Box position={[2, -1, 13]} />

      <Wall position={[-3, -3, -8]} />

      <SpecialBox position={[0.5, 1.0, 20]} controls={controls}/>
    </Physics>
  </Canvas>
}
