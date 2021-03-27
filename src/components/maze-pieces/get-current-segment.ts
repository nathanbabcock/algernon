import { Camera } from 'three'
import { MazeSegment } from './MazeLibrary'

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
    if (segment.containsPoint(camera.position))
      currentMazeSegment = segment
  })
  return currentMazeSegment
};
