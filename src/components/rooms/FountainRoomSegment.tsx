import { Euler, Vector3 } from 'three'
import { MazeConnection, MazeSegment } from '../maze-pieces/MazeLibrary'

export default class FountainRoomSegment extends MazeSegment {
  public connections: MazeConnection[] = [
    {
      position: new Vector3(-8, 0, 0),
      forward: new Vector3(-1, 0, 0),
    },
  ] as MazeConnection[]

  public containsPoint(point: Vector3): boolean {
    return (
         point.x <= this.position.x + 8
      && point.x >= this.position.x - 8
      && point.y <= this.position.y + 8
      && point.y >= this.position.y - 8
    )
  }

  constructor(position: Vector3, rotation: Euler, id?: number) {
    super('fountain-room', position, rotation, id)
  }
}