import { FlowerRoomSegment } from '../early-game/FlowerRoom'
import { TheEndSegment } from '../end-game/TheEnd'
import Infinite1DMazeSegment, { CustomSegmentGenerationFunction } from '../infinite-1d-maze/Infinite1DMazeSegment'
import { MazeNoFutureNoPastSegment } from '../no-future-no-past/NoFutureNoPastSegment'
import { DeerRoomSegment } from '../mid-game/DeerRoom'
import { FountainRoomSegment } from '../mid-game/FountainRoom'
import { OrbRoomSegment } from '../mid-game/OrbRoom'
import { getPossibleSegments, MazeConnection, MazeDeadEndSegment, MazeSegment } from './MazeLibrary'

const spawnChance = 0.0333
// const spawnChance = 0.1

export const spawnNoFutureNoPast: CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment
) => {
  const roll = Math.random()
  if (roll < spawnChance) {
    parentSegment.customSegmentGenerationFunction = spawnFlower
    // Modify the spawning algorithm to spawn the next scripted encounter

    const segments = getPossibleSegments(originConnection, originSegment, [MazeNoFutureNoPastSegment])
    return segments.filter(segment => !segment.connections[1].connectedTo) // Prevent this piece from spawning in backwards
  } else {
    return getPossibleSegments(originConnection, originSegment)
  }
}

export const spawnFlower: CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment
) => {
  const roll = Math.random()
  if (roll < spawnChance) {
    parentSegment.customSegmentGenerationFunction = spawnFountain
    return getPossibleSegments(originConnection, originSegment, [FlowerRoomSegment])
  } else {
    return getPossibleSegments(originConnection, originSegment)
  }
}

export const spawnFountain: CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment
) => {
  const roll = Math.random()
  if (roll < spawnChance) {
    parentSegment.customSegmentGenerationFunction = spawnDeer
    // Now we enter the default/open world exploration behavior, no more scripting
    return getPossibleSegments(originConnection, originSegment, [FountainRoomSegment])
  } else {
    return getPossibleSegments(originConnection, originSegment)
  }
}

export const spawnDeer: CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment
) => {
  const roll = Math.random()
  if (roll < spawnChance) {
    parentSegment.customSegmentGenerationFunction = spawnOrb
    // Now we enter the default/open world exploration behavior, no more scripting
    return getPossibleSegments(originConnection, originSegment, [DeerRoomSegment])
  } else {
    return getPossibleSegments(originConnection, originSegment)
  }
}

export const spawnOrb: CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment
) => {
  const roll = Math.random()
  if (roll < spawnChance) {
    parentSegment.customSegmentGenerationFunction = spawnTheEnd
    // Now we enter the default/open world exploration behavior, no more scripting
    return getPossibleSegments(originConnection, originSegment, [OrbRoomSegment])
  } else {
    return getPossibleSegments(originConnection, originSegment)
  }
}

export const spawnTheEnd: CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment
) => {
  const roll = Math.random()
  if (roll < spawnChance) {
    parentSegment.customSegmentGenerationFunction = spawnDeadEndsOnly
    // Now we enter the default/open world exploration behavior, no more scripting
    return getPossibleSegments(originConnection, originSegment, [TheEndSegment])
  } else {
    return getPossibleSegments(originConnection, originSegment)
  }
}

export const spawnDeadEndsOnly: CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment
) => getPossibleSegments(originConnection, originSegment, [MazeDeadEndSegment])