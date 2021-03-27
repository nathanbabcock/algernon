import { Camera } from 'three'
import { MazeSegment, MAZEPIECE_HALFWIDTH } from './MazeLibrary'

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
