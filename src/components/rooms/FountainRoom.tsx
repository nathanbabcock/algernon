import { useBox } from '@react-three/cannon'
import React, { useState } from 'react'
import { Euler, Vector3 } from 'three'
import { WALL_COLOR } from '../../theme'
import { MAZEPIECE_HEIGHT } from '../maze-pieces/MazeLibrary'
import Fountain from './Fountain'
import FountainRoomSegment from './FountainRoomSegment'

export default function FountainRoom(props: any) {
  let position = new Vector3()
  let rotation = new Euler()
  if (props.position instanceof Array) position.set(...(props.position as [number, number, number]))
  if (props.rotation instanceof Array) rotation.set(...(props.rotation as [number, number, number]))
  if (props.position instanceof Vector3) position.copy(props.position)
  if (props.rotation instanceof Euler) rotation.copy(props.rotation)

  const [ segment ] = useState<FountainRoomSegment>(
    props.segment || new FountainRoomSegment(position, rotation)
  )

  const wallArgs: [number, number, number] = [1, 16, MAZEPIECE_HEIGHT]
  const halfWallArgs: [number, number, number] = [1, 7, MAZEPIECE_HEIGHT]
  const leftWall1Pos = segment.position.clone().add(new Vector3(-15/2, -4.5, MAZEPIECE_HEIGHT / 2).applyEuler(segment.rotation))
  const [leftWall1] = useBox(() => ({
    type: 'Static',
    args: halfWallArgs,
    position: [leftWall1Pos.x, leftWall1Pos.y, leftWall1Pos.z],
    rotation: [segment.rotation.x, segment.rotation.y, segment.rotation.z],
  }))

  const leftWall2Pos = segment.position.clone().add(new Vector3(-15/2, 4.5, MAZEPIECE_HEIGHT / 2).applyEuler(segment.rotation))
  const [leftWall2] = useBox(() => ({
    type: 'Static',
    args: halfWallArgs,
    position: [leftWall2Pos.x, leftWall2Pos.y, leftWall2Pos.z],
    rotation: [segment.rotation.x, segment.rotation.y, segment.rotation.z],
  }))

  const rightWallPos = segment.position.clone().add(new Vector3(15/2, 0, MAZEPIECE_HEIGHT / 2).applyEuler(segment.rotation))
  const [rightWall] = useBox(() => ({
    type: 'Static',
    args: wallArgs,
    position: [rightWallPos.x, rightWallPos.y, rightWallPos.z],
    rotation: [segment.rotation.x, segment.rotation.y, segment.rotation.z],
  }))

  const frontWallPos = segment.position.clone().add(new Vector3(0, 15/2, MAZEPIECE_HEIGHT / 2).applyEuler(segment.rotation))
  const [frontWall] = useBox(() => ({
    type: 'Static',
    args: wallArgs,
    position: [frontWallPos.x, frontWallPos.y, frontWallPos.z],
    rotation: [segment.rotation.x, segment.rotation.y, segment.rotation.z + Math.PI/2],
  }))

  const backWallPos = segment.position.clone().add(new Vector3(0, -15/2, MAZEPIECE_HEIGHT / 2).applyEuler(segment.rotation))
  const [backWall] = useBox(() => ({
    type: 'Static',
    args: wallArgs,
    position: [backWallPos.x, backWallPos.y, backWallPos.z],
    rotation: [segment.rotation.x, segment.rotation.y, segment.rotation.z + Math.PI/2],
  }))

  return (
    <group>

      <group position={segment.position} rotation={segment.rotation}>
        <Fountain rotation={[0, 0, Math.PI/4]}/>

        { segment.connections.map((connection, index) => (
          <arrowHelper args={[connection.forward, connection.position, 1, 0xff0000]} key={index}/>
        ))}
      </group>

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
