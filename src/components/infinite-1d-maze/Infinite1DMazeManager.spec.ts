import '@testing-library/react'
import { MazeCornerSegment, MazeSegment, MazeStraightSegment } from '../maze-pieces/MazeLibrary'
import Infinite1DMazeSegment from './Infinite1DMazeManager'

const getTurnsAhead = (maze: MazeSegment[], curSegment: MazeSegment) => {
  const curIndex = maze.indexOf(curSegment)
  return maze
    .slice(curIndex + 1)
    .filter(segment => segment.type !== 'straight')
    .length
}

describe('Infinite 1D Maze Manager', () => {
  it('exists', () => {
    expect(new Infinite1DMazeSegment()).toBeDefined()
  })

  it('populates an initial maze', () => {
    const mazeManager = new Infinite1DMazeSegment()
    expect(mazeManager.maze.length).toBeGreaterThan(0)
  })

  it('adds turns to the end of the maze if needed', () => {
    const mazeManager = new Infinite1DMazeSegment()
    mazeManager.maze = [ new MazeStraightSegment(0) ]
    mazeManager.curIndex = 1
    const curSegment = mazeManager.maze[0]
    let turnsAhead = getTurnsAhead(mazeManager.maze, curSegment)
    expect(turnsAhead).toBe(0)
    mazeManager.updateMaze(curSegment)

    turnsAhead = getTurnsAhead(mazeManager.maze, curSegment)
    expect(turnsAhead).toBeGreaterThanOrEqual(2)
  })

  it('removes turns from the end of the maze if needed', () => {
    const mazeManager = new Infinite1DMazeSegment()
    mazeManager.maze = [
      new MazeCornerSegment(0),
      new MazeCornerSegment(1),
      new MazeCornerSegment(2),
      new MazeCornerSegment(3),
    ]
    mazeManager.curIndex = 4
    const curSegment = mazeManager.maze[0]
    let turnsAhead = getTurnsAhead(mazeManager.maze, curSegment)
    expect(turnsAhead).toBeGreaterThan(2)
    mazeManager.updateMaze(curSegment)

    turnsAhead = getTurnsAhead(mazeManager.maze, curSegment)
    expect(turnsAhead).toBe(2)
  })

  it('stabilizes after a single update', () => {
    const mazeManager = new Infinite1DMazeSegment()
    mazeManager.maze = [
      new MazeCornerSegment(0),
      new MazeCornerSegment(1),
      new MazeCornerSegment(2),
      new MazeStraightSegment(3),
      new MazeStraightSegment(4),
      new MazeStraightSegment(5),
      new MazeCornerSegment(6),
    ]
    mazeManager.curIndex = 7
    const curSegment = mazeManager.maze[0]
    let turnsAhead = getTurnsAhead(mazeManager.maze, curSegment)
    expect(turnsAhead).toBeGreaterThan(2)
    const update1 = mazeManager.updateMaze(curSegment)
    expect(update1.removed).toBeGreaterThan(0)
    
    const update2 = mazeManager.updateMaze(curSegment)
    expect(update2.added).toBe(0)
    expect(update2.removed).toBe(0)
  })
})