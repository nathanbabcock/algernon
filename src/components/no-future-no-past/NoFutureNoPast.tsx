import React, { useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import getCurrentSegment from '../maze-pieces/get-current-segment';
import getSegmentComponent from '../maze-pieces/get-segment-component';
import { MazeCornerSegment, MazeNoFutureSegment, MazeNoPastSegment, MazeSegment, MazeStraightSegment } from '../maze-pieces/MazeLibrary';
export default function NoFutureNoPast(props: any) {
  const [entrance] = useState(new MazeStraightSegment(-2))

  const [noFuture] = useState(new MazeNoFutureSegment(1))
  noFuture.position.set(8, 8, 0)
  noFuture.rotation.set(0, 0, -Math.PI/2)

  const [noPast] = useState(new MazeNoPastSegment(-1))
  noPast.rotation.set(0, 0, -Math.PI)

  const [exit] = useState(new MazeStraightSegment(2))
  exit.position.set(8, 8, 0)
  exit.rotation.set(0, 0, -Math.PI/2)

  const [straight1] = useState(new MazeStraightSegment(3))
  straight1.position.set(0, 4, 0)

  const [corner] = useState(new MazeCornerSegment(4))
  corner.position.set(0, 8, 0)
  corner.rotation.set(0, 0, -Math.PI/2)

  const [straight2] = useState(new MazeStraightSegment(5))
  straight2.position.set(4, 8, 0)
  straight2.rotation.set(0, 0, -Math.PI/2)

  const [maze, setMaze] = useState([
    entrance,
    straight1,
    corner,
    straight2,
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
