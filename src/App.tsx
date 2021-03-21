import { OrbitControls } from "@react-three/drei";
import React from "react";
import { Canvas } from 'react-three-fiber';
import { Vector3 } from "three";
import HelloWorldBox from "./HelloWorldBox";

function Ground (props: any) {
  return (
    <mesh {...props}>
      <planeBufferGeometry args={[2000, 2000]}/>
      <meshStandardMaterial color={'slategray'} />
    </mesh>
  )
}

export default function App() {
  return <Canvas
    camera={{
      position: new Vector3(0, -10, 10),
      near: 0.1,
      far: 100000,
    }}
  >
    <OrbitControls/>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <HelloWorldBox position={[-1.2, 0, 1]} />
    <HelloWorldBox position={[1.2, 0, 1]} />
    <Ground/>
  </Canvas>
}