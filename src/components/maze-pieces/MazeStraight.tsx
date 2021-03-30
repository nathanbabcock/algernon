import { useBox } from '@react-three/cannon';
import React, { useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Euler, Frustum, Group, Vector3 } from 'three';
import { MAZEPIECE_HEIGHT, MazeSegment } from './MazeLibrary';

export default function MazeStraight(props: any) {
  const { camera } = useThree()
  const ref = useRef<Group>()

  const parentPos: Vector3 = props.position || new Vector3()
  const parentRot: Euler = props.rotation || new Euler()

  const wallArgs: [number, number, number] = [1, 4, MAZEPIECE_HEIGHT]
  const leftWallPos = parentPos.clone().add(new Vector3(-1.5, 0, MAZEPIECE_HEIGHT / 2).applyEuler(parentRot))
  const [leftWall] = useBox(() => ({
    type: 'Static',
    args: wallArgs,
    position: [leftWallPos.x, leftWallPos.y, leftWallPos.z],
    rotation: [parentRot.x, parentRot.y, parentRot.z],
  }))
  const rightWallPos = parentPos.clone().add(new Vector3(1.5, 0, MAZEPIECE_HEIGHT / 2).applyEuler(parentRot))
  const [rightWall] = useBox(() => ({
    type: 'Static',
    args: wallArgs,
    position: [rightWallPos.x, rightWallPos.y, rightWallPos.z],
    rotation: [parentRot.x, parentRot.y, parentRot.z],
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
    <group ref={ref}>
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
