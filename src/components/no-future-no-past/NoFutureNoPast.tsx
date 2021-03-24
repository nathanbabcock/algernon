import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Euler, Vector3 } from 'three';
import { MazeSegment } from '../Infinite1DMaze';
import MazeCorner from '../maze-pieces/MazeCorner';
import MazeDeadEnd from '../maze-pieces/MazeDeadEnd';
import MazeStraight from '../maze-pieces/MazeStraight';

export default function NoFutureNoPast(props: any) {
  const [noFuture] = useState({
    id: 1,
    type: MazeDeadEnd,
    position: new Vector3(8, 8, 0),
    rotation: new Euler(0, 0, -Math.PI/2),
  } as MazeSegment)

  const [noPast] = useState({
    id: -1,
    type: MazeDeadEnd,
    position: new Vector3(0, 8, 0),
    rotation: new Euler(0, 0, Math.PI/2),
  } as MazeSegment)

  const [exit] = useState({
    id: 0,
    type: MazeStraight,
    position: new Vector3(8, 8, 0),
    rotation: new Euler(0, 0, -Math.PI/2),
  } as MazeSegment)

  const [maze, setMaze] = useState([
    {
      id: 2,
      type: MazeStraight,
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
    },
    {
      id: 3,
      type: MazeStraight,
      position: new Vector3(0, 4, 0),
      rotation: new Euler(0, 0, 0),
    },
    {
      id: 4,
      type: MazeCorner,
      position: new Vector3(0, 8, 0),
      rotation: new Euler(0, 0, -Math.PI/2),
    },
    {
      id: 5,
      type: MazeStraight,
      position: new Vector3(4, 8, 0),
      rotation: new Euler(0, 0, -Math.PI/2),
    },
    noFuture
  ] as MazeSegment[]);

  const { camera } = useThree()

  useFrame(() => {
    // Recombobulate the maze
    if (camera.position.clone().sub(noFuture.position).length() < 3 && noFuture.hasBeenSeen && !maze[2].isVisible) {
      setMaze([
        // maze[0],
        // maze[1],
        noPast,
        maze[3],
        maze[4],
      ])
      noFuture.isVisible = false
      console.log('NO FUTURE')
    }

    if (noPast.hasBeenSeen && !exit.hasBeenSeen && !noFuture.isVisible) {
      setMaze([
        noPast,
        maze[1],
        exit,
      ])
      console.log('NO PAST')
    }
  })

  return (
    <group {...props}>
      {maze.map(segment => {
        if (!segment) return null
        const MazePiece = segment.type
        return <MazePiece position={segment.position} rotation={segment.rotation} segment={segment} key={segment.id}/>
      })}
    </group>  
  )
};
