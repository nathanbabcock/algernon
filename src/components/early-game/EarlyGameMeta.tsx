import React, { useState } from 'react'
import { Euler, Vector3 } from 'three'
import Infinite1DMaze from '../infinite-1d-maze/Infinite1DMaze'
import Infinite1DMazeSegment from '../infinite-1d-maze/Infinite1DMazeSegment'
import { MazeCornerSegment, MazeDeadEndSegment, MazeStraightSegment } from '../maze-pieces/MazeLibrary'
import EarlyGame from './EarlyGame'

function createPetal1(): Infinite1DMazeSegment {
  const petal = new Infinite1DMazeSegment(new Vector3(), new Euler())
  petal.paused = true
  const straight = new MazeStraightSegment(new Vector3(83, 53, 0), new Euler(0, 0, Math.PI/2))
  const corner1 = new MazeCornerSegment(new Vector3(79, 53, 0), new Euler(0, 0, -Math.PI/2))
  const corner2 = new MazeCornerSegment(new Vector3(79, 49, 0), new Euler(0, 0, 0))
  const deadend = new MazeDeadEndSegment(new Vector3(83, 49, 0), new Euler(0, 0, -Math.PI/2))
  petal.maze = [
    straight,
    corner1,
    corner2,
    deadend,
  ]
  return petal
}

/**
 * Holds the entire scripted early game sequence,
 * plus the 11 possible transition paths towards the Flower Room
 * and into the MiddleGame infinite open world maze
 */
export default function EarlyGameMeta(props: any) {
  const [petals] = useState([
    createPetal1(),
  ] as Infinite1DMazeSegment[])

  return <>
    <EarlyGame />
    { petals.map((segment: Infinite1DMazeSegment, index: number) => <Infinite1DMaze segment={segment} key={index} />) }
  </>
}
