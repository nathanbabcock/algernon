import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import getSegmentComponent from '../maze-pieces/get-segment-component';
import { MazeSegment } from '../maze-pieces/MazeLibrary';
import { MazeNoFutureNoPastSegment } from './NoFutureNoPastSegment';

export default function NoFutureNoPast(props: any) {
  const [ segment ] = useState<MazeNoFutureNoPastSegment>(props.segment || new MazeNoFutureNoPastSegment())
  const [ maze, setMaze ] = useState(segment.maze)
  const { camera } = useThree()

  if (props.segment && props.position instanceof Array) segment.position.set(...(props.position as [number, number, number]))
  if (props.segment && props.rotation instanceof Array) segment.rotation.set(...(props.rotation as [number, number, number]))

  useFrame(() => {
    if (segment.update(camera.position)) {
      setMaze([...segment.maze])
      props.requestCollisionUpdate()
    }
  })

  return (
    <group {...props}>
      {maze.map((segment: MazeSegment) => {
        if (!segment) return null
        const MazePiece = getSegmentComponent(segment.type)
        return <MazePiece position={segment.position} rotation={segment.rotation} segment={segment} key={segment.id}/>
      })}
    </group>  
  )
};
