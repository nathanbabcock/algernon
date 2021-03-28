import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import getSegmentComponent from '../maze-pieces/get-segment-component';
import { MazeSegment } from '../maze-pieces/MazeLibrary';
import { MazeNoFutureNoPastSegment } from './NoFutureNoPastSegment';

// export type NoFutureNoPastProps = {
//   segment?: MazeNoFutureNoPastSegment,
//   position: any,
//   rotation: any,
//   requestCollisionUpdate: any,
// }

export default function NoFutureNoPast(props: any) {
  const [ segment ] = useState(props.segment || new MazeNoFutureNoPastSegment())
  const [ maze, setMaze ] = useState(segment.maze)
  const { camera } = useThree()

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
