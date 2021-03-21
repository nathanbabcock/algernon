import React, { useRef, useState } from "react";
import { Euler, Mesh, Vector3 } from "three";
import { Canvas, useFrame } from 'react-three-fiber'
import { OrbitControls } from "@react-three/drei";

function Box(props: any) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    mesh.current!.rotation.x = mesh.current!.rotation.y += 0.01
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function Ground (props: any) {
  return (
    <mesh {...props}>
      <planeBufferGeometry args={[2000, 2000]}/>
      <meshStandardMaterial color={'slategray'} />
    </mesh>
  )
}

export default function App() {
  return <Canvas camera={{
    position: new Vector3(0, -10, 10),
    near: 0.1,
    far: 100000,
  }}>
    <OrbitControls/>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Box position={[-1.2, 0, 1]} />
    <Box position={[1.2, 0, 1]} />
    <Ground/>
  </Canvas>
}