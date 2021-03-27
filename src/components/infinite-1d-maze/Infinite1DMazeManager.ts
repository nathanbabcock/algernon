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

  public addSegment(): MazeSegment {
    const connections = this.endOfChain.getTransformedConnections()
    const openIndex = this.endOfChain.connections.findIndex(connection => !connection.connectedTo)
    if (openIndex === -1) {
      console.group('Infinite1DMazeManager fatal error')
      console.error('Could not find an open connection to attach to in addSegment()')
      console.info('Maze:', this.maze)
      console.info('End of chain:', this.endOfChain)
      console.info('Connections:', this.endOfChain.connections)
      console.groupEnd()
    }
    const segments = getPossibleSegments(connections[openIndex], this.endOfChain)
    const segment = segments[Math.floor(Math.random() * segments.length)];
    segment.id = this.curIndex++
    this.endOfChain.addConnectedSegment(openIndex, segment)
    this.maze.push(segment)
    return segment
  }

  // Spaghetti code warning
  public removeSegment(index: number) {
    const toRemove = this.maze[index]
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
      // removed = this.maze.length - i - 1
      // this.maze = this.maze.slice(0, i + 1)
    }

    return { added, removed }
  }
}