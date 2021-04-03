import { Euler, Vector3 } from 'three'
import { getPossibleSegments, MazeConnection, MazeSegment, MazeStraightSegment } from '../maze-pieces/MazeLibrary'

const MAZE_BUFFER_SIZE = 2

export type CustomSegmentGenerationFunction = (
  originConnection: MazeConnection,
  originSegment: MazeSegment,
  parentSegment: Infinite1DMazeSegment,
) => MazeSegment[]

export default class Infinite1DMazeSegment extends MazeSegment  {
  public curIndex = 0
  public maze: MazeSegment[] = []

  /**
   * If the segment is paused, it will remain static
   * and not add or remove and pieces from the maze,
   * even while a player moves through it
   */
  public paused = false

  public customSegmentGenerationFunction?: CustomSegmentGenerationFunction

  public get endOfChain() {
    return this.maze[this.maze.length - 1]
  }

  public get startOfChain() {
    return this.maze[0]
  }

  constructor(position: Vector3, rotation: Euler, id?: number) {
    super('infinite-1d', position, rotation)

    const straight = new MazeStraightSegment(
      position.clone(),
      new Euler(rotation.x, rotation.y, rotation.z + Math.PI / 2),
      this.curIndex++
    )
    this.maze.push(straight)

    for (let i = 1; i < 4; i++)
      this.addSegment()
  }

  public addSegment(toFront = false): MazeSegment | null {
    const origin = toFront ? this.startOfChain : this.endOfChain
    const connections = origin.getTransformedConnections()
    const openIndex = origin.connections.findIndex(connection => !connection.connectedTo)

    if (openIndex === -1)
      return null

    let segments
    if (this.customSegmentGenerationFunction) {
      segments = this.customSegmentGenerationFunction(connections[openIndex], origin, this)
    } else {
      segments = getPossibleSegments(connections[openIndex], origin)
    }
    const segment = segments[Math.floor(Math.random() * segments.length)]
    segment.id = this.curIndex++
    origin.addConnectedSegment(openIndex, segment)
    toFront ? this.maze.unshift(segment) : this.maze.push(segment)

    // HACK: Forcibly prevent multiple consecutive corners
    // Under the current (POC) spawning model, you can see straight down diagonals
    // and witness new segments spawning in (an edge case)
    if ( (origin.type === 'corner' && segment.type === 'corner')
      // || (origin.type === 'no-future-no-past' && segment.type === 'no-future-no-past')
    ) {
      this.removeSegment(toFront ? 0 : this.maze.length-1)
      return this.addSegment(toFront)
    }
    // It could be slightly ameliorated by increasing the number of corner segments spawned
    // to 3 or more (making diagonals less likely), but they could still occur,
    // and above 2 there is an additional risk of self-collision (maze looping back over itself)

    // The proper solution requires a modified spawning algorithm.

    return segment
  }

  // Spaghetti code warning
  public removeSegment(index: number) {
    const toRemove = this.maze[index]
    if (!toRemove) {
      console.warn('Can\'t remove segment with index', index)
      return
    }
    const connectedTo = toRemove.connections.find(connection => connection.connectedTo)?.connectedTo
    if (connectedTo)
      connectedTo.connections.find(connection => connection.connectedTo === toRemove)!.connectedTo = undefined
    this.maze.splice(index, 1)
  }

  /**
   * Updates the maze based on current position within the maze,
   * ensuring that there are always two turns ahead of and behind the player
   * (breaking line of sight)
   */
  public updateMaze(currentSegment: MazeSegment): { added: number, removed: number } {
    if (this.paused) return { added: 0, removed: 0 }

    const forward = this.updateMazeForward(currentSegment)
    const reverse = this.updateMazeReverse(currentSegment)

    return {
      added: forward.added + reverse.added,
      removed: forward.removed + forward.added,
    }
  }

  public updateMazeForward(currentSegment: MazeSegment): { added: number, removed: number } {
    if (!currentSegment) return { added: 0, removed: 0}
    const currentIndex = this.maze.indexOf(currentSegment)
    let i
    let turns = 0
    let added = 0
    let removed = 0

    for (i = currentIndex + 1; i < this.maze.length; i++) {
      if (!['straight', 'no-future-no-past'].includes(this.maze[i].type)) turns++
      if (turns >= MAZE_BUFFER_SIZE) break
    }

    // Add turns to end
    while (turns < MAZE_BUFFER_SIZE) {
      const newSegment = this.addSegment()
      if (!newSegment) break
      if (!['straight', 'no-future-no-past'].includes(newSegment.type)) turns++
      added++
    }

    // Remove turns from end
    if (added === 0 && i < this.maze.length) {
      for (let j = this.maze.length - 1; j > i; j--) {
        this.removeSegment(j)
        removed++
      }
    }

    return { added, removed }
  }

  public updateMazeReverse(currentSegment: MazeSegment): { added: number, removed: number } {
    if (!currentSegment) return { added: 0, removed: 0}
    const currentIndex = this.maze.indexOf(currentSegment)
    let i
    let turns = 0
    let added = 0
    let removed = 0

    for (i = currentIndex; i >= 0; i--) {
      if (!['straight', 'no-future-no-past'].includes(this.maze[i].type)) turns++
      if (turns >= MAZE_BUFFER_SIZE) break
    }

    // Add turns to start
    while (turns < MAZE_BUFFER_SIZE) {
      const newSegment = this.addSegment(true)
      if (!newSegment) break
      if (!['straight', 'no-future-no-past'].includes(newSegment.type)) turns++
      added++
    }

    // Remove turns from beginning
    if (added === 0 && i > 0) {
      for (i; i > 0; i--) {
        this.removeSegment(0)
        removed++
        // Removing from the front of array means everything shifts up 1 index
        // Actually this loop brings i down to j=0, rather than moving j up to i as it appears
      }
    }

    return { added, removed }
  }
}