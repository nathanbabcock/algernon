/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import getCurrentSegment from '../maze-pieces/get-current-segment';
import getSegmentComponent from '../maze-pieces/get-segment-component';
import Infinite1DMazeManager from './Infinite1DMazeManager';

export default function Infinite1DMaze(props: any) {
  const [mazeManager] = useState(new Infinite1DMazeManager())
  const [maze, setMaze] = useState(mazeManager.maze);
  const { camera } = useThree()

  useFrame(() => {
    const currentSegment = getCurrentSegment(mazeManager.maze, camera)
    if (!currentSegment) return
    const update = mazeManager.updateMaze(currentSegment)
    if (update.added > 0 || update.removed > 0) {
      console.log(update)
      setMaze([...mazeManager.maze])
      props.requestCollisionUpdate()
    }
  })

  return (
    <group {...props}>
      {maze.map(segment => {
        if (!segment) return null
        const MazePiece = getSegmentComponent(segment.type)
        return <MazePiece position={segment.position} rotation={segment.rotation} segment={segment} key={segment.id}/>
      })}
    </group>  
  )
};
