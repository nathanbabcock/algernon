import { getPossibleSegments, MazeSegment, MazeStraightSegment } from '../maze-pieces/MazeLibrary'

export default class Infinite1DMazeManager {
  public curIndex = 0
  public maze: MazeSegment[] = [] 

  public get endOfChain() {
    return this.maze[this.maze.length - 1]
  }

  public get startOfChain() {
    return this.maze[0]
  }

  constructor() {
    const straight = new MazeStraightSegment()
    straight.id = this.curIndex++
    straight.rotation.set(0, 0, Math.PI / 2)
    this.maze.push(straight)

    for (let i = 1; i < 4; i++)
      this.addSegment()
  }

  public addSegment(toFront = false): MazeSegment {
    const origin = toFront ? this.startOfChain : this.endOfChain
    const connections = origin.getTransformedConnections()
    const openIndex = origin.connections.findIndex(connection => !connection.connectedTo)
    if (openIndex === -1) {
      console.group('Infinite1DMazeManager fatal error')
      console.error('Could not find an open connection to attach to in addSegment()')
      console.info('Maze:', this.maze)
      console.info('End of chain:', origin)
      console.info('Connections:', origin.connections)
      console.groupEnd()
    }
    const segments = getPossibleSegments(connections[openIndex], origin)
    const segment = segments[Math.floor(Math.random() * segments.length)]
    segment.id = this.curIndex++
    origin.addConnectedSegment(openIndex, segment)
    toFront ? this.maze.unshift(segment) : this.maze.push(segment)

    // HACK: Forcibly prevent multiple consecutive corners
    // Under the current (POC) spawning model, you can see straight down diagonals
    // and witness new segments spawning in (an edge case)
    if (origin.type === 'corner' && segment.type === 'corner') {
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
      if (this.maze[i].type !== 'straight') turns++
      if (turns >= 2) break
    }

    // Add turns to end
    while (turns < 2) {
      const newSegment = this.addSegment()
      if (newSegment.type !== 'straight') turns++
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
      if (this.maze[i].type !== 'straight') turns++
      if (turns >= 2) break
    }

    // Add turns to start
    while (turns < 2) {
      const newSegment = this.addSegment(true)
      if (newSegment.type !== 'straight') turns++
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