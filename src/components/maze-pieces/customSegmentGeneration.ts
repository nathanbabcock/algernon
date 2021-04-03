import { FlowerRoomSegment } from '../early-game/FlowerRoom'
import Infinite1DMazeSegment, { CustomSegmentGenerationFunction } from '../infinite-1d-maze/Infinite1DMazeSegment'
import { MazeNoFutureNoPastSegment } from '../no-future-no-past/NoFutureNoPastSegment'
import FountainRoomSegment from '../rooms/FountainRoomSegment'
import { MazeConnection, MazeSegment, getPossibleSegments } from './MazeLibrary'

export const spawnNoFutureNoPast: CustomSegmentGenerationFunction = (
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

export const spawnFlower: CustomSegmentGenerationFunction = (
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

export const spawnFountain: CustomSegmentGenerationFunction = (
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