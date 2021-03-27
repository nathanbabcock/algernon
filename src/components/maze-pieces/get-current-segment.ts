import { Camera } from 'three'
import { MazeSegment, MAZEPIECE_HALFWIDTH } from './MazeLibrary'

/**
 * @important currently disregards local transforms
 * (treats all mazeSegment positions as relative to the world origin)
 * 
 * Also does not yet handle non-default-sized segments
 * (for example, a NoFutureNoPast segment)
 */
export default function getCurrentSegment(maze: MazeSegment[], camera: Camera) {
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
};
