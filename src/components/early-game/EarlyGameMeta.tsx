import React, { useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Euler, Vector3 } from 'three'
import Infinite1DMaze from '../infinite-1d-maze/Infinite1DMaze'
import Infinite1DMazeSegment, { CustomSegmentGenerationFunction } from '../infinite-1d-maze/Infinite1DMazeSegment'
import { getPossibleSegments, MazeConnection, MazeCornerSegment, MazeDeadEndSegment, MazeSegment, MazeStraightSegment } from '../maze-pieces/MazeLibrary'
import { MazeNoFutureNoPastSegment } from '../no-future-no-past/NoFutureNoPastSegment'
import FountainRoomSegment from '../rooms/FountainRoomSegment'
import EarlyGame from './EarlyGame'
import { FlowerRoomSegment } from './FlowerRoom'

function createPetal1(): Infinite1DMazeSegment {
  const petal = new Infinite1DMazeSegment(new Vector3(), new Euler())
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

const spawnNoFutureNoPast: CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment
) => {
  const roll = Math.random()
  if (roll < 0.0333) {
    parentSegment.customSegmentGenerationFunction = spawnFlower
    // Modify the spawning algorithm to spawn the next scripted encounter

    const segments = getPossibleSegments(originConnection, originSegment, [MazeNoFutureNoPastSegment])
    return segments.filter(segment => !segment.connections[1].connectedTo) // Prevent this piece from spawning in backwards
  } else {
    return getPossibleSegments(originConnection, originSegment)
  }
}

const spawnFlower: CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment
) => {
  const roll = Math.random()
  if (roll < 0.0333) {
    parentSegment.customSegmentGenerationFunction = spawnFountain
    return getPossibleSegments(originConnection, originSegment, [FlowerRoomSegment])
  } else {
    return getPossibleSegments(originConnection, originSegment)
  }
}

const spawnFountain: CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment
) => {
  const roll = Math.random()
  if (roll < 0.0333) {
    parentSegment.customSegmentGenerationFunction = undefined
    // Now we enter the default/open world exploration behavior, no more scripting
    return getPossibleSegments(originConnection, originSegment, [FountainRoomSegment])
  } else {
    return getPossibleSegments(originConnection, originSegment)
  }
}

/**
 * Holds the entire scripted early game sequence,
 * plus the 11 possible transition paths towards the Flower Room
 * and into the MiddleGame infinite open world maze
 */
export default function EarlyGameMeta(props: any) {
  const [petals, setPetals] = useState([
    createPetal1(),
  ] as Infinite1DMazeSegment[])
  const [stage3Complete, setStage3Complete] = useState(false)
  const { camera } = useThree()

  useFrame(() => {
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
    { petals.map((segment: Infinite1DMazeSegment, index: number) => <Infinite1DMaze segment={segment} key={index} />) }
  </>
}
