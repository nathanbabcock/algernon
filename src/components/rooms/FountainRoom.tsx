import { useBox } from '@react-three/cannon'
import React, { useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Euler, Vector3 } from 'three'
import { NUM_LOCATIONS, DEBUG_CONNECTIONS } from '../../config'
import { WALL_COLOR } from '../../theme'
import { MazeConnection, MAZEPIECE_HEIGHT, MazeSegment } from '../maze-pieces/MazeLibrary'
import showLocationDiscoveredUI from '../ui/locationDiscovered'
import Fountain from './Fountain'

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

  const { camera } = useThree()
  const [ discovered, setDiscovered ] = useState(false)
  const updateDiscovered = () => {
    if (discovered) return
    if (segment.containsPoint(camera.position)) {
      setDiscovered(true)
      showLocationDiscoveredUI('Fountain Discovered', `Location 2/${NUM_LOCATIONS}`)
    }
  }
  useFrame(updateDiscovered)

  return (
    <group>
      <Fountain position={segment.position} rotation={segment.rotation}/>

      <group position={segment.position} rotation={segment.rotation} visible={DEBUG_CONNECTIONS}>
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

export class FountainRoomSegment extends MazeSegment {
  public connections: MazeConnection[] = [
    {
      position: new Vector3(-8, 0, 0),
      forward: new Vector3(-1, 0, 0),
    },
  ] as MazeConnection[]

  public containsPoint(point: Vector3): boolean {
    return (
         point.x <= this.position.x + 8
      && point.x >= this.position.x - 8
      && point.y <= this.position.y + 8
      && point.y >= this.position.y - 8
    )
  }

  constructor(position: Vector3, rotation: Euler, id?: number) {
    super('fountain-room', position, rotation, id)
  }
}