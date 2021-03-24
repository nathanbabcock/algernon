/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Euler, Vector2, Vector3 } from 'three';
import MazeCorner from './maze-pieces/MazeCorner';
import MazeDeadEnd from './maze-pieces/MazeDeadEnd';
import MazeStraight from './maze-pieces/MazeStraight';

export type MazeSegment = {
  id: number,
  type: typeof MazeStraight | typeof MazeCorner | typeof MazeDeadEnd,
  rotation: Euler,
  position: Vector3,
  isVisible: boolean,
  hasBeenSeen: boolean,
  openDirections: string,
};

export const MAZEPIECE_HALFWIDTH = 2

export const getConnections = (segment?: MazeSegment) => {
  if (!segment) return [];

  let connections;
  if (segment.type === MazeStraight) {
    connections = [
      new Vector2(0, 1),
      new Vector2(0, -1),
    ]
  } else if (segment.type === MazeCorner) {
    connections = [
      new Vector2(0, 1),
      new Vector2(1, 0),
    ]
  } else {
    throw new Error(`unknown segment type ${segment.type}`)
  }

  connections.forEach(vector => {
    vector.rotateAround(new Vector2(0, 0), segment.rotation.z).roundToZero()
  })

  return connections
}

/**
 * @param segment the segment to attach the new one to
 * @param prevSegment the segment that connects the first param to the rest of the maze
 * @returns the added segment, or null if not possible
 */
export const addMazeSegmentOld = (segment: MazeSegment, prevSegment?: MazeSegment): MazeSegment | null => {
  const segmentConnectionPoints = getConnections(segment)
  const previousConnectionPoints = getConnections(prevSegment)
  const openConnectionPoints = segmentConnectionPoints.filter(connection => 
    !previousConnectionPoints.find(prevConnection => prevConnection.equals(connection.clone().multiply(new Vector2(1, -1)))
      || prevConnection.equals(connection.clone().multiply(new Vector2(-1, 1))))
  )
  console.log(openConnectionPoints)
  return null
}

export type Direction = 'n' | 's' | 'e' | 'w'
export const addMazeSegment = (segment: MazeSegment, direction: Direction) => {
  
}

export default function Infinite1DMaze(props: any) {
  const [maze, setMaze] = useState([
    {
      type: MazeStraight,
      rotation: new Euler(0, 0, Math.PI / 2),
      position: new Vector3(0, 0, 0),
      isVisible: false,
      hasBeenSeen: false,
      openDirections: 'ns'
    },
    // {
    //   type: MazeStraightPiece,
    //   rotation: new Euler(0, 0, 0),
    //   position: new Vector3(0, 4, 0),
    //   isVisible: false,
    //   hasBeenSeen: false,
    // },
    // {
    //   type: MazeCornerPiece,
    //   rotation: new Euler(0, 0, -Math.PI / 2),
    //   position: new Vector3(0, 8, 0),
    //   isVisible: false,
    //   hasBeenSeen: false,
    // }
  ] as MazeSegment[]);

  console.log(addMazeSegment(maze[0], 'n'))

  const { camera } = useThree()

  useFrame(() => {
    // Recombobulate the maze
    const getCurrentSegment = () => {
      let currentMazeSegment = null
      maze.forEach(segment => {
        if ( camera.position.x <= segment.position.x + MAZEPIECE_HALFWIDTH
          && camera.position.x >= segment.position.x - MAZEPIECE_HALFWIDTH
          && camera.position.y <= segment.position.y + MAZEPIECE_HALFWIDTH
          && camera.position.y >= segment.position.y - MAZEPIECE_HALFWIDTH
        ) {
          currentMazeSegment = segment
        }
      })
      return currentMazeSegment
    }
  })

  return (
    <group {...props}>
      {maze.map(segment => {
        const MazePiece = segment.type
        return <MazePiece position={segment.position} rotation={segment.rotation} segment={segment}/>
      })}
    </group>  
  )
};
