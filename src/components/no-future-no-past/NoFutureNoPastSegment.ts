import { Euler, Vector3 } from 'three'
import { MazeConnection, MazeCornerSegment, MazeNoFutureSegment, MazeNoPastSegment, MAZEPIECE_HALFWIDTH, MazeSegment, MazeStraightSegment } from '../maze-pieces/MazeLibrary'

export class MazeNoFutureNoPastSegment extends MazeSegment {
  public maze: MazeSegment[] = []
  public entrance: MazeSegment
  public noFuture: MazeSegment
  public noPast: MazeSegment
  public exit: MazeSegment
  public straight1: MazeSegment
  public corner: MazeSegment
  public straight2: MazeSegment

  public connections: MazeConnection[] = [
    {
      position: new Vector3(0, -MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, -1, 0),
    },
    {
      position: new Vector3(MAZEPIECE_HALFWIDTH * 5, MAZEPIECE_HALFWIDTH * 4, 0),
      forward: new Vector3(1, 0, 0),
    },
  ] as MazeConnection[]

  constructor(position: Vector3, rotation: Euler, id?: number) {
    super('no-future-no-past', position, rotation, id)

    this.entrance = new MazeStraightSegment(position.clone(), rotation.clone(), -2)

    this.noFuture = new MazeNoFutureSegment(
      new Vector3(8, 8, 0).applyEuler(rotation).add(position),
      new Euler(rotation.x, rotation.y, rotation.z - Math.PI/2),
      1,
    )
  
    this.noPast = new MazeNoPastSegment(
      position.clone(),
      new Euler(rotation.x, rotation.y, rotation.z - Math.PI),
      -1,
    )
  
    this.exit = new MazeStraightSegment(
      new Vector3(8, 8, 0).applyEuler(rotation).add(position),
      new Euler(rotation.x, rotation.y, rotation.z - Math.PI/2),
      2,
    )
  
    this.straight1 = new MazeStraightSegment(
      new Vector3(0, 4, 0).applyEuler(rotation).add(position),
      rotation.clone(),
      3,
    )
  
    this.corner = new MazeCornerSegment(
      new Vector3(0, 8, 0).applyEuler(rotation).add(position),
      new Euler(rotation.x, rotation.y, rotation.z - Math.PI/2),
      4,
    )
  
    this.straight2 = new MazeStraightSegment(
      new Vector3(4, 8, 0).applyEuler(rotation).add(position),
      new Euler(rotation.x, rotation.y, rotation.z - Math.PI/2),
      5,
    )
  
    this.maze = [
      this.entrance,
      this.straight1,
      this.corner,
      this.straight2,
      this.noFuture
    ]
  }

  public containsPoint(point: Vector3): boolean {
    return !!this.maze.find(segment => segment.containsPoint(point, this))

    // return (
    //      point.x <= this.position.x + MAZEPIECE_HALFWIDTH * 5
    //   && point.x >= this.position.x - MAZEPIECE_HALFWIDTH
    //   && point.y <= this.position.y + MAZEPIECE_HALFWIDTH * 5
    //   && point.y >= this.position.y - MAZEPIECE_HALFWIDTH
    // )
  }

  public getCurrentSegment(point: Vector3): MazeSegment | null {
    if (!this.maze || this.maze.length === 0) return null
    let currentMazeSegment = null
    this.maze.forEach(segment => {
      if (segment.containsPoint(point, this))
        currentMazeSegment = segment
    })
    return currentMazeSegment
  }

  public update(point: Vector3) {
    // Recombobulate the maze
    const currentSegment = this.getCurrentSegment(point)
    const noFuture = this.noFutureUpdate(currentSegment)
    const noPast = this.noPastUpdate(currentSegment)
    const reset = this.resetUpdate(currentSegment)
    return noFuture || noPast || reset
  }

  public noFutureUpdate(currentSegment: MazeSegment | null): boolean {
    if (!this.noFuture.hasBeenSeen || this.entrance.isVisible || this.maze.includes(this.noPast) || !currentSegment)
      return false

    this.maze = [
      this.noPast,
      this.maze[1],
      this.maze[2],
      this.maze[3],
      this.noFuture,
    ]
    this.noFuture.isVisible = false
    console.log('NO FUTURE')
    return true
  }

  public noPastUpdate(currentSegment: MazeSegment | null) {
    if (!this.noPast.hasBeenSeen || this.noFuture.isVisible || this.maze.includes(this.exit))
      return false
    
    this.maze = [
      this.noPast,
      this.maze[1],
      this.maze[2],
      this.maze[3],
      this.exit,
    ]
    console.log('NO PAST')
    return true
  }

  public resetUpdate(currentSegment: MazeSegment | null) {
    if (currentSegment
      || !this.noPast.hasBeenSeen
      || this.exit.isVisible
      || this.noPast.isVisible
      || this.maze.includes(this.entrance)
    ) return false
    this.maze = [
      this.entrance,
      this.maze[1],
      this.maze[2],
      this.maze[3],
      this.noFuture,
    ]
    this.entrance.hasBeenSeen = false
    this.exit.hasBeenSeen = false
    this.noFuture.hasBeenSeen = false
    this.noPast.hasBeenSeen = false
    return true
  }
}