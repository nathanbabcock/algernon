/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useFrame } from 'react-three-fiber';
import { Euler, Vector3 } from 'three';
import getSegmentComponent from './maze-pieces/get-segment-component';
import { getConnections, getPossibleSegments, MazeSegment } from './maze-pieces/MazeLibrary';

export default function Infinite1DMaze(props: any) {

  const straight = {
    type: 'straight',
    rotation: new Euler(0, 0, Math.PI / 2),
    position: new Vector3(0, 0, 0),
  } as MazeSegment

  const connections = getConnections(straight)
  const segment = getPossibleSegments(connections[0])[1]
  const segment2 = getPossibleSegments(connections[1])[0]

  const [maze, setMaze] = useState([
    straight,
    segment,
    segment2,
  ] as MazeSegment[]);

  useFrame(() => {})

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
