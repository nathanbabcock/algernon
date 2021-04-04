import React from 'react'
import FlowerRoom from '../early-game/FlowerRoom'
import TheEnd from '../end-game/TheEnd'
import NoFuture from '../no-future-no-past/NoFuture'
import NoFutureNoPast from '../no-future-no-past/NoFutureNoPast'
import NoPast from '../no-future-no-past/NoPast'
import FountainRoom from '../rooms/FountainRoom'
import MazeCorner from './MazeCorner'
import MazeDeadEnd from './MazeDeadEnd'
import MazeStraight from './MazeStraight'

// TODO this function may indicate that MazeX and MazeXSegment need to be unified
export default function getSegmentComponent(type: string): React.FC<any> {
  switch (type) {
    case 'straight': return MazeStraight
    case 'corner': return MazeCorner
    case 'dead-end': return MazeDeadEnd
    case 'no-future': return NoFuture
    case 'no-past': return NoPast
    case 'no-future-no-past': return NoFutureNoPast
    case 'fountain-room': return FountainRoom
    case 'flower-room': return FlowerRoom
    case 'the-end': return TheEnd
    default: throw new Error(`Unknown segment type ${type}`)
  }
}
