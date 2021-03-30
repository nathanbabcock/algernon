import { useBox } from '@react-three/cannon';
import { Box } from '@react-three/drei';
import React, { useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Frustum, Group } from 'three';
import { MAZEPIECE_HEIGHT, MazeSegment } from './MazeLibrary';

export default function MazeStraight(props: any) {
  const { camera } = useThree()
  const ref = useRef<Group>()

  const wallArgs: [number, number, number] = [1, 4, MAZEPIECE_HEIGHT]
  const [leftWall] = useBox(() => ({
    type: 'Static',
    args: wallArgs,
    position: [-1.5, 0, MAZEPIECE_HEIGHT / 2]
  }))
  const [rightWall] = useBox(() => ({
    type: 'Static',
    args: wallArgs,
    position: [1.5, 0, MAZEPIECE_HEIGHT / 2]
  }))

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
      <mesh ref={leftWall} castShadow receiveShadow>
        <boxBufferGeometry args={wallArgs}/>
        <meshPhongMaterial attach="material" color="white"/>
      </mesh>

      <mesh ref={rightWall} castShadow receiveShadow>
        <boxBufferGeometry args={wallArgs}/>
        <meshPhongMaterial attach="material" color="white"/>
      </mesh>
    </group>
  )
};
