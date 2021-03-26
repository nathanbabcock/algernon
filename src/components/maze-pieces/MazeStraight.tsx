import { Box } from '@react-three/drei';
import React, { useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Frustum, Group } from 'three';
import { MAZEPIECE_HEIGHT, MazeSegment } from './MazeLibrary';

export default function MazeStraight(props: any) {
  const { camera } = useThree()
  const ref = useRef<Group>()

  useFrame(() => {
    const segment = props.segment as MazeSegment
    if (!ref.current || !segment) return;

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
    segment.isVisible = visibleNow
    if (segment.isVisible) segment.hasBeenSeen = true
  })

  return (
    <group {...props} ref={ref}>
      <Box position={[-1.5, 0, MAZEPIECE_HEIGHT / 2]} args={[1, 4, MAZEPIECE_HEIGHT]} castShadow receiveShadow>
        <meshPhongMaterial attach="material" color="white"/>
      </Box>

      <Box position={[1.5, 0, MAZEPIECE_HEIGHT / 2]} args={[1, 4, MAZEPIECE_HEIGHT]} castShadow receiveShadow>
        <meshPhongMaterial attach="material" color="white"/>
      </Box>
    </group>
  )
};
