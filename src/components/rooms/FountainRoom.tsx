import { useBox } from '@react-three/cannon'
import React from 'react'
import { Euler, Vector3 } from 'three'
import { WALL_COLOR } from '../../theme'
import { MAZEPIECE_HEIGHT } from '../maze-pieces/MazeLibrary'
import Fountain from './Fountain'

export default function FountainRoom(props: any) {
  const parentPos: Vector3 = props.position || new Vector3()
  const parentRot: Euler = props.rotation || new Euler()

  const wallArgs: [number, number, number] = [1, 16, MAZEPIECE_HEIGHT]
  const halfWallArgs: [number, number, number] = [1, 7, MAZEPIECE_HEIGHT]
  const leftWall1Pos = parentPos.clone().add(new Vector3(-15/2, -4.5, MAZEPIECE_HEIGHT / 2).applyEuler(parentRot))
  const [leftWall1] = useBox(() => ({
    type: 'Static',
    args: halfWallArgs,
    position: [leftWall1Pos.x, leftWall1Pos.y, leftWall1Pos.z],
    rotation: [parentRot.x, parentRot.y, parentRot.z],
  }))

  const leftWall2Pos = parentPos.clone().add(new Vector3(-15/2, 4.5, MAZEPIECE_HEIGHT / 2).applyEuler(parentRot))
  const [leftWall2] = useBox(() => ({
    type: 'Static',
    args: halfWallArgs,
    position: [leftWall2Pos.x, leftWall2Pos.y, leftWall2Pos.z],
    rotation: [parentRot.x, parentRot.y, parentRot.z],
  }))

  const rightWallPos = parentPos.clone().add(new Vector3(15/2, 0, MAZEPIECE_HEIGHT / 2).applyEuler(parentRot))
  const [rightWall] = useBox(() => ({
    type: 'Static',
    args: wallArgs,
    position: [rightWallPos.x, rightWallPos.y, rightWallPos.z],
    rotation: [parentRot.x, parentRot.y, parentRot.z],
  }))

  const frontWallPos = parentPos.clone().add(new Vector3(0, 15/2, MAZEPIECE_HEIGHT / 2).applyEuler(parentRot))
  const [frontWall] = useBox(() => ({
    type: 'Static',
    args: wallArgs,
    position: [frontWallPos.x, frontWallPos.y, frontWallPos.z],
    rotation: [parentRot.x, parentRot.y, parentRot.z + Math.PI/2],
  }))

  const backWallPos = parentPos.clone().add(new Vector3(0, -15/2, MAZEPIECE_HEIGHT / 2).applyEuler(parentRot))
  const [backWall] = useBox(() => ({
    type: 'Static',
    args: wallArgs,
    position: [backWallPos.x, backWallPos.y, backWallPos.z],
    rotation: [parentRot.x, parentRot.y, parentRot.z + Math.PI/2],
  }))

  return (
    <group {...props}>
      <Fountain/>

      <mesh ref={leftWall1} castShadow receiveShadow>
        <boxBufferGeometry args={halfWallArgs}/>
        <meshPhongMaterial attach="material" color={WALL_COLOR}/>
      </mesh>

      <mesh ref={leftWall2} castShadow receiveShadow>
        <boxBufferGeometry args={halfWallArgs}/>
        <meshPhongMaterial attach="material" color={WALL_COLOR}/>
      </mesh>

      <mesh ref={rightWall} castShadow receiveShadow>
        <boxBufferGeometry args={wallArgs}/>
        <meshPhongMaterial attach="material" color={WALL_COLOR}/>
      </mesh>

      <mesh ref={frontWall} castShadow receiveShadow>
        <boxBufferGeometry args={wallArgs}/>
        <meshPhongMaterial attach="material" color={WALL_COLOR}/>
      </mesh>

      <mesh ref={backWall} castShadow receiveShadow>
        <boxBufferGeometry args={wallArgs}/>
        <meshPhongMaterial attach="material" color={WALL_COLOR}/>
      </mesh>
  </group>

  )
}
