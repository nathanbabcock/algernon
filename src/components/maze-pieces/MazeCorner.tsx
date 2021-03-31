import { useBox } from '@react-three/cannon';
import React, { useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Euler, Frustum, Group, Vector3 } from 'three';
import { WALL_COLOR } from '../../theme';
import { MAZEPIECE_HEIGHT, MazeSegment } from './MazeLibrary';

export default function MazeCorner(props: any) {
  const { camera } = useThree()
  const ref = useRef<Group>()

  const parentPos: Vector3 = props.position || new Vector3()
  const parentRot: Euler = props.rotation || new Euler()

  const sideWallArgs: [number, number, number] = [1, 4, MAZEPIECE_HEIGHT]
  const leftWallPos = parentPos.clone().add(new Vector3(-1.5, 0, MAZEPIECE_HEIGHT / 2).applyEuler(parentRot))
  const [leftWall] = useBox(() => ({
    type: 'Static',
    args: sideWallArgs,
    position: [leftWallPos.x, leftWallPos.y, leftWallPos.z],
    rotation: [parentRot.x, parentRot.y, parentRot.z],
  }))
  const backWallPos = parentPos.clone().add(new Vector3(0, -1.5, MAZEPIECE_HEIGHT/2).applyEuler(parentRot))
  const backWallRot = new Euler().setFromVector3(parentRot.toVector3().add(new Vector3(0, 0, Math.PI / 2)))
  const [backWall] = useBox(() => ({
    type: 'Static',
    args: sideWallArgs,
    position: [backWallPos.x, backWallPos.y, backWallPos.z],
    rotation: [backWallRot.x, backWallRot.y, backWallRot.z],
  }))
  
  const cornerArgs: [number, number, number] = [1, 1, MAZEPIECE_HEIGHT]
  const cornerPos = parentPos.clone().add(new Vector3(1.5, 1.5, MAZEPIECE_HEIGHT/2).applyEuler(parentRot))
  const [cornerPillar] = useBox(() => ({
    type: 'Static',
    args: cornerArgs,
    position: [cornerPos.x, cornerPos.y, cornerPos.z],
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
        <boxBufferGeometry args={sideWallArgs}/>
        <meshPhongMaterial attach="material" color={WALL_COLOR}/>
      </mesh>

      <mesh ref={backWall} castShadow receiveShadow>
        <boxBufferGeometry args={sideWallArgs}/>
        <meshPhongMaterial attach="material" color={WALL_COLOR}/>
      </mesh>

      <mesh ref={cornerPillar} castShadow receiveShadow>
        <boxBufferGeometry args={cornerArgs}/>
        <meshPhongMaterial attach="material" color={WALL_COLOR}/>
      </mesh>
    </group>
  )
};
