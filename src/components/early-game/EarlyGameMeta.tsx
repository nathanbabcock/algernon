import React, { useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Euler, Vector3 } from 'three'
import Infinite1DMaze from '../infinite-1d-maze/Infinite1DMaze'
import Infinite1DMazeSegment from '../infinite-1d-maze/Infinite1DMazeSegment'
import { spawnNoFutureNoPast } from '../maze-pieces/customSegmentGeneration'
import { MazeCornerSegment, MazeDeadEndSegment, MazeStraightSegment } from '../maze-pieces/MazeLibrary'
import EarlyGame from './EarlyGame'

function createPetal1(id: number): Infinite1DMazeSegment {
  const petal = new Infinite1DMazeSegment(new Vector3(), new Euler(), id)
  petal.paused = true
  petal.curIndex = 0 // we will reset the maze and replace it with a pre-chosen seed
  const straight = new MazeStraightSegment(new Vector3(83, 53, 0), new Euler(0, 0, Math.PI/2), petal.curIndex++)
  const corner1 = new MazeCornerSegment(new Vector3(79, 53, 0), new Euler(0, 0, -Math.PI/2), petal.curIndex++)
  const corner2 = new MazeCornerSegment(new Vector3(79, 49, 0), new Euler(0, 0, 0), petal.curIndex++)
  const deadend = new MazeDeadEndSegment(new Vector3(83, 49, 0), new Euler(0, 0, -Math.PI/2), petal.curIndex++)

  straight.connections[0].connectedTo = corner1
  corner1.connections[0].connectedTo = straight

  corner1.connections[1].connectedTo = corner2
  corner2.connections[0].connectedTo = corner1

  corner2.connections[1].connectedTo = deadend
  deadend.connections[0].connectedTo = corner2

  petal.maze = [
    straight,
    corner1,
    corner2,
    deadend,
  ]
  return petal
}

function createPetal2(id: number): Infinite1DMazeSegment {
  const petal = new Infinite1DMazeSegment(new Vector3(), new Euler(), id)
  petal.paused = true
  petal.curIndex = 0 // we will reset the maze and replace it with a pre-chosen seed
  const straight = new MazeStraightSegment(new Vector3(88, 48, 0), new Euler(0, 0, 0), petal.curIndex++)
  const corner = new MazeCornerSegment(new Vector3(88, 44, 0), new Euler(0, 0, Math.PI/2), petal.curIndex++)
  const deadend = new MazeDeadEndSegment(new Vector3(84, 44, 0), new Euler(0, 0, Math.PI/2), petal.curIndex++)

  straight.connections[1].connectedTo = corner
  corner.connections[1].connectedTo = straight

  corner.connections[0].connectedTo = deadend
  deadend.connections[0].connectedTo = corner

  petal.maze = [
    straight,
    corner,
    deadend,
  ]
  return petal
}

function createPetal3(id: number): Infinite1DMazeSegment {
  const petal = new Infinite1DMazeSegment(new Vector3(), new Euler(), id)
  petal.paused = true
  petal.curIndex = 0 // we will reset the maze and replace it with a pre-chosen seed
  const straight1 = new MazeStraightSegment(new Vector3(92, 48, 0), new Euler(0, 0, 0), petal.curIndex++)
  const straight2 = new MazeStraightSegment(new Vector3(92, 44, 0), new Euler(0, 0, 0), petal.curIndex++)
  const straight3 = new MazeStraightSegment(new Vector3(92, 40, 0), new Euler(0, 0, 0), petal.curIndex++)
  const corner1 = new MazeCornerSegment(new Vector3(92, 36, 0), new Euler(0, 0, 0), petal.curIndex++)
  const straight4 = new MazeStraightSegment(new Vector3(96, 36, 0), new Euler(0, 0, Math.PI/2), petal.curIndex++)
  const corner2 = new MazeCornerSegment(new Vector3(100, 36, 0), new Euler(0, 0, Math.PI), petal.curIndex++)
  const deadend = new MazeDeadEndSegment(new Vector3(100, 32, 0), new Euler(0, 0, -Math.PI), petal.curIndex++)

  straight1.connections[1].connectedTo = straight2
  straight2.connections[0].connectedTo = straight1

  straight2.connections[1].connectedTo = straight3
  straight3.connections[0].connectedTo = straight2

  straight3.connections[1].connectedTo = corner1
  corner1.connections[0].connectedTo = straight3

  corner1.connections[1].connectedTo = straight4
  straight4.connections[0].connectedTo = corner1

  straight4.connections[1].connectedTo = corner2
  corner2.connections[1].connectedTo = straight4

  corner2.connections[0].connectedTo = deadend
  deadend.connections[0].connectedTo = corner2

  petal.maze = [
    straight1,
    straight2,
    straight3,
    corner1,
    straight4,
    corner2,
    deadend,
  ]
  return petal
}

function createPetal4(id: number): Infinite1DMazeSegment {
  const petal = new Infinite1DMazeSegment(new Vector3(), new Euler(), id)
  petal.paused = true
  petal.curIndex = 0
  const straight = new MazeStraightSegment(new Vector3(96, 48, 0), new Euler(0, 0, 0), petal.curIndex++)
  const corner = new MazeCornerSegment(new Vector3(96, 44, 0), new Euler(0, 0, 0), petal.curIndex++)
  const deadend = new MazeDeadEndSegment(new Vector3(100, 44, 0), new Euler(0, 0, -Math.PI/2), petal.curIndex++)

  straight.connections[1].connectedTo = corner
  corner.connections[0].connectedTo = straight

  corner.connections[1].connectedTo = deadend
  deadend.connections[0].connectedTo = corner

  petal.maze = [
    straight,
    corner,
    deadend,
  ]
  return petal
}

function createPetal5(id: number): Infinite1DMazeSegment {
  const petal = new Infinite1DMazeSegment(new Vector3(), new Euler(), id)
  petal.paused = true
  petal.curIndex = 0 // we will reset the maze and replace it with a pre-chosen seed
  const straight = new MazeStraightSegment(new Vector3(101, 53, 0), new Euler(0, 0, Math.PI/2), petal.curIndex++)
  const corner1 = new MazeCornerSegment(new Vector3(105, 53, 0), new Euler(0, 0, Math.PI), petal.curIndex++)
  const corner2 = new MazeCornerSegment(new Vector3(105, 49, 0), new Euler(0, 0, Math.PI/2), petal.curIndex++)
  const deadend = new MazeDeadEndSegment(new Vector3(101, 49, 0), new Euler(0, 0, Math.PI/2), petal.curIndex++)

  straight.connections[1].connectedTo = corner1
  corner1.connections[1].connectedTo = straight

  corner1.connections[0].connectedTo = corner2
  corner2.connections[1].connectedTo = corner1

  corner2.connections[0].connectedTo = deadend
  deadend.connections[0].connectedTo = corner2

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
  let curIndex = 0
  const [petals, setPetals] = useState([
    createPetal1(curIndex++),
    createPetal2(curIndex++),
    createPetal3(curIndex++),
    createPetal4(curIndex++),
    createPetal5(curIndex++),
  ] as Infinite1DMazeSegment[])
  const [stage3Complete, setStage3Complete] = useState(false)
  const { camera } = useThree()

  useFrame(() => {
    // return
    if (stage3Complete) return

    petals.forEach(petal => {
      if (stage3Complete) return
      if (!petal.paused) return
      const petalSegment = petal.getCurrentSegment(camera.position)
      if (!petalSegment) return
      const petalIndex = petal.maze.indexOf(petalSegment)
      if (petalIndex < petal.maze.length - 2) return
  
      petal.customSegmentGenerationFunction = spawnNoFutureNoPast
      petal.paused = false
      setStage3Complete(true)
      setPetals([petal]) // delete all other paths
      console.log('The world changes around you...')
    })
  })

  return <>
    { !stage3Complete && <EarlyGame /> }
    { petals.map((segment: Infinite1DMazeSegment) => <Infinite1DMaze segment={segment} key={segment.id} />) }
  </>
}
