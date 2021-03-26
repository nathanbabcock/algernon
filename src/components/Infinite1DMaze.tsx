/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Euler, Vector3 } from 'three';
import { MAZEPIECE_HALFWIDTH, MazeSegment } from './maze-pieces/MazeLibrary';
import MazeStraight from './maze-pieces/MazeStraight';

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
