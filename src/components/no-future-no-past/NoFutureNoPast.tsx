import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Euler, Vector3 } from 'three';
import { MAZEPIECE_HALFWIDTH, MazeSegment } from '../Infinite1DMaze';
import MazeCorner from '../maze-pieces/MazeCorner';
import MazeStraight from '../maze-pieces/MazeStraight';
import NoFuture from './NoFuture';
import NoPast from './NoPast';

export default function NoFutureNoPast(props: any) {
  const [entrance] = useState({
    id: -2,
    type: MazeStraight,
    position: new Vector3(0, 0, 0),
    rotation: new Euler(0, 0, 0),
  } as MazeSegment)

  const [noFuture] = useState({
    id: 1,
    type: NoFuture,
    position: new Vector3(8, 8, 0),
    rotation: new Euler(0, 0, -Math.PI/2),
  } as MazeSegment)

  const [noPast] = useState({
    id: -1,
    type: NoPast,
    position: new Vector3(0, 0, 0),
    rotation: new Euler(0, 0, -Math.PI),
  } as MazeSegment)

  const [exit] = useState({
    id: 2,
    type: MazeStraight,
    position: new Vector3(8, 8, 0),
    rotation: new Euler(0, 0, -Math.PI/2),
  } as MazeSegment)

  const [maze, setMaze] = useState([
    entrance,
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
    const currentSegment = getCurrentSegment()

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
        const MazePiece = segment.type
        return <MazePiece position={segment.position} rotation={segment.rotation} segment={segment} key={segment.id}/>
      })}
    </group>  
  )
};
