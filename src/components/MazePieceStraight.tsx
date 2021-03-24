import { Box } from '@react-three/drei';
import React, { useRef, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Frustum, Matrix4, Mesh } from 'three/src/Three';

export default function MazePieceStraight(props: any) {
  const [seen, setSeen] = useState(false)
  const [visible, setVisible] = useState(false)
  const { camera } = useThree()
  const ref = useRef<Mesh>()

  useFrame(() => {
    if (!ref.current) return;

    const frustum = new Frustum()
    camera.updateMatrixWorld()
    const cameraViewProjectionMatrix = camera.matrixWorldInverse.clone().invert()
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix)

    let visibleNow = false;
    ref.current!.children.forEach(child => {
      if (!(child as any).geometry) return;
      if (frustum.intersectsObject(child)) visibleNow = true;
    })
    // console.log('visible?', visibleNow)
  })

  return (
    <group {...props} ref={ref}>
      <Box position={[-1.5, 0, 1]} args={[1, 2, 2]} castShadow receiveShadow>
        <meshPhongMaterial attach="material" color="white"/>
      </Box>

      <Box position={[1.5, 0, 1]} args={[1, 2, 2]} castShadow receiveShadow>
        <meshPhongMaterial attach="material" color="white"/>
      </Box>
    </group>
  )
};
