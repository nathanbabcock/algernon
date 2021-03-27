/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useFrame } from 'react-three-fiber';
import getSegmentComponent from './maze-pieces/get-segment-component';
import { getPossibleSegments, MazeSegment, MazeStraightSegment } from './maze-pieces/MazeLibrary';

export default function Infinite1DMaze(props: any) {

  const straight = new MazeStraightSegment()
  straight.rotation.set(0, 0, Math.PI / 2)

  const connections = straight.getTransformedConnections()
  const segment = getPossibleSegments(connections[0])[0]
  const segment2 = getPossibleSegments(connections[1])[0]

  straight.addConnectedSegment(0, segment)
  straight.addConnectedSegment(1, segment2)

  const openIndex = segment.connections.findIndex(connection => !connection.connectedTo)
  const dynamicSegment = getPossibleSegments(segment.getTransformedConnections()[openIndex])[0]
  segment.addConnectedSegment(openIndex, dynamicSegment)

  const openIndex2 = segment2.connections.findIndex(connection => !connection.connectedTo)
  const dynamicSegment2 = getPossibleSegments(segment2.getTransformedConnections()[openIndex2])[0]
  segment.addConnectedSegment(openIndex2, dynamicSegment2)

  const openIndex3 = dynamicSegment.connections.findIndex(connection => !connection.connectedTo)
  const dynamicSegment3 = getPossibleSegments(dynamicSegment.getTransformedConnections()[openIndex3])[0]
  segment.addConnectedSegment(openIndex3, dynamicSegment)

  straight.id = 0
  segment.id = 1
  segment2.id = 2
  dynamicSegment.id = 3
  dynamicSegment2.id = 4
  dynamicSegment3.id = 5

  const [maze, setMaze] = useState([
    straight,
    segment, 
    segment2,
    dynamicSegment,
    dynamicSegment2,
    dynamicSegment3,
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
