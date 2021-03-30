import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Vector3, Euler } from 'three';
import getSegmentComponent from '../maze-pieces/get-segment-component';
import { MazeSegment } from '../maze-pieces/MazeLibrary';
import { MazeNoFutureNoPastSegment } from './NoFutureNoPastSegment';

export default function NoFutureNoPast(props: any) {
  let position = new Vector3()
  let rotation = new Euler()
  if (props.position instanceof Array) position.set(...(props.position as [number, number, number]))
  if (props.rotation instanceof Array) rotation.set(...(props.rotation as [number, number, number]))
  if (props.position instanceof Vector3) position.copy(props.position)
  if (props.rotation instanceof Euler) rotation.copy(props.rotation)

  const [ segment ] = useState<MazeNoFutureNoPastSegment>(props.segment || new MazeNoFutureNoPastSegment(position, rotation))
  const { camera } = useThree()
  const [ maze, setMaze ] = useState(segment.maze)

  useFrame(() => {
    if (segment.update(camera.position)) {
      setMaze([...segment.maze])
    }
  })

  return (
    <group>
      {maze.map((segment: MazeSegment) => {
        if (!segment) return null
        const MazePiece = getSegmentComponent(segment.type)
        return <MazePiece position={segment.position} rotation={segment.rotation} segment={segment} key={segment.id}/>
      })}
    </group>  
  )
};
