/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Vector3, Euler } from 'three';
import getSegmentComponent from '../maze-pieces/get-segment-component';
import Infinite1DMazeSegment from './Infinite1DMazeSegment';

export default function Infinite1DMaze(props: any) {
  let position = new Vector3()
  let rotation = new Euler()
  if (props.position instanceof Array) position.set(...(props.position as [number, number, number]))
  if (props.rotation instanceof Array) rotation.set(...(props.rotation as [number, number, number]))
  if (props.position instanceof Vector3) position.copy(props.position)
  if (props.rotation instanceof Euler) rotation.copy(props.rotation)

  const [mazeManager] = useState<Infinite1DMazeSegment>(props.segment || new Infinite1DMazeSegment(position, rotation))
  const [maze, setMaze] = useState(mazeManager.maze);
  const { camera } = useThree()

  useFrame(() => {
    const currentSegment = mazeManager.getCurrentSegment(camera.position)
    if (!currentSegment) return
    const update = mazeManager.updateMaze(currentSegment)
    if (update.added > 0 || update.removed > 0) {
      setMaze([...mazeManager.maze])
    }
  })

  return (
    <group>
      {maze.map(segment => {
        if (!segment) return null
        const MazePiece = getSegmentComponent(segment.type)
        return <MazePiece
          key={segment.id}
          segment={segment}
          position={segment.position}
          rotation={segment.rotation}
        />
      })}
    </group>  
  )
};
