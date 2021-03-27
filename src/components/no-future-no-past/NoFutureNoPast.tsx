import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Euler, Vector3 } from 'three';
import getCurrentSegment from '../maze-pieces/get-current-segment';
import getSegmentComponent from '../maze-pieces/get-segment-component';
import { MAZEPIECE_HALFWIDTH, MazeSegment } from '../maze-pieces/MazeLibrary';

export default function NoFutureNoPast(props: any) {
  const [entrance] = useState({
    id: -2,
    type: 'straight',
    position: new Vector3(0, 0, 0),
    rotation: new Euler(0, 0, 0),
  } as MazeSegment)

  const [noFuture] = useState({
    id: 1,
    type: 'no-future',
    position: new Vector3(8, 8, 0),
    rotation: new Euler(0, 0, -Math.PI/2),
  } as MazeSegment)

  const [noPast] = useState({
    id: -1,
    type: 'no-past',
    position: new Vector3(0, 0, 0),
    rotation: new Euler(0, 0, -Math.PI),
  } as MazeSegment)

  const [exit] = useState({
    id: 2,
    type: 'straight',
    position: new Vector3(8, 8, 0),
    rotation: new Euler(0, 0, -Math.PI/2),
  } as MazeSegment)

  const [maze, setMaze] = useState([
    entrance,
    {
      id: 3,
      type: 'straight',
      position: new Vector3(0, 4, 0),
      rotation: new Euler(0, 0, 0),
    },
    {
      id: 4,
      type: 'corner',
      position: new Vector3(0, 8, 0),
      rotation: new Euler(0, 0, -Math.PI/2),
    },
    {
      id: 5,
      type: 'straight',
      position: new Vector3(4, 8, 0),
      rotation: new Euler(0, 0, -Math.PI/2),
    },
    noFuture
  ] as MazeSegment[]);

  const { camera } = useThree()

  useFrame(() => {
    const currentSegment = getCurrentSegment(maze, camera)

    // Recombobulate the maze
    if (noFuture.hasBeenSeen && !entrance.isVisible && !maze.includes(noPast) && currentSegment) {
      setMaze([
        noPast,
        maze[1],
        maze[2],
        maze[3],
        noFuture,
      ])
      noFuture.isVisible = false
      console.log('NO FUTURE')
      props.requestCollisionUpdate()
    }

    if (noPast.hasBeenSeen && !noFuture.isVisible && !maze.includes(exit)) {
      setMaze([
        noPast,
        maze[1],
        maze[2],
        maze[3],
        exit,
      ])
      console.log('NO PAST')
      props.requestCollisionUpdate()
      return
    }

    if (!currentSegment && noPast.hasBeenSeen && !exit.isVisible && !noPast.isVisible && !maze.includes(entrance)) {
      setMaze([
        entrance,
        maze[1],
        maze[2],
        maze[3],
        noFuture,
      ])
      entrance.hasBeenSeen = false
      exit.hasBeenSeen = false
      noFuture.hasBeenSeen = false
      noPast.hasBeenSeen = false
      props.requestCollisionUpdate()
      return
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
