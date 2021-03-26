import '@testing-library/react'
import { Vector3 } from 'three'
import { getPossibleSegments, MazeConnection, MAZEPIECE_HALFWIDTH, MazeStraightSegment } from './MazeLibrary'

describe('MazeLibrary', () => {
  it('has a config for maze connections', () => {
    expect(MazeLibrary).toBeDefined()
  })

  it('creates a maze segment', () => {
    const segment = new MazeStraightSegment()
    expect(segment).toBeDefined()
  })

  it('gets all the connections from a maze segment', () => {
    const segment = new MazeStraightSegment()
    const connections = segment.getTransformedConnections()
    expect(connections).toBeDefined()
  })

  it('rotates the connection direction based on the parent object', () => {
    const segment = new MazeStraightSegment()
    segment.rotation.set(0, 0, -Math.PI/2)
    const connections = segment.getTransformedConnections()
    expect(connections[0].forward.x).toBeCloseTo(1)
    expect(connections[0].forward.y).toBeCloseTo(0)
  })

  it('translates the connection position based on the parent object rotation', () => {
    const segment = new MazeStraightSegment()
    segment.rotation.set(0, 0, -Math.PI/2)
    const connections = segment.getTransformedConnections()
    expect(connections[0].position.x).toBeCloseTo(MAZEPIECE_HALFWIDTH)
    expect(connections[0].position.y).toBeCloseTo(0)
    expect(connections[1].position.x).toBeCloseTo(-MAZEPIECE_HALFWIDTH)
    expect(connections[1].position.y).toBeCloseTo(0)
  })

  it('translates the connection position based on the parent object position', () => {
    const segment = new MazeStraightSegment()
    segment.rotation.set(0, 0, -Math.PI/2)
    segment.position.set(10, 10, 10)
    const connections = segment.getTransformedConnections()
    expect(connections[0].position.x).toBeCloseTo(MAZEPIECE_HALFWIDTH + segment.position.x)
    expect(connections[0].position.y).toBeCloseTo(0 + segment.position.y)
    expect(connections[1].position.x).toBeCloseTo(-MAZEPIECE_HALFWIDTH + segment.position.x)
    expect(connections[1].position.y).toBeCloseTo(0 + segment.position.y)
  })

  it('gets a list of possible segments for a given connection', () => {
    const connection = {
      position: new Vector3(),
      forward: new Vector3(0, 1, 0)
    } as MazeConnection

    const segments = getPossibleSegments(connection)
    expect(segments.length).toBeGreaterThan(0)
  })

  it('rotates segments to connect to a given connection', () => {
    const connection = {
      position: new Vector3(),
      forward: new Vector3(1, 0, 0)
    } as MazeConnection

    const segments = getPossibleSegments(connection)
    expect(Math.abs(segments[0].rotation.z)).not.toBeCloseTo(0)
    expect(Math.abs(segments[0].rotation.z)).not.toBeCloseTo(Math.PI)
    expect(Math.abs(segments[0].rotation.z)).toBeCloseTo(Math.PI/2)
  })

  it('translates segments to line up their connection points', () => {
    const connection = {
      position: new Vector3(),
      forward: new Vector3(1, 0, 0)
    } as MazeConnection

    const segments = getPossibleSegments(connection)
    expect(Math.abs(segments[0].position.x)).toBeCloseTo(MAZEPIECE_HALFWIDTH)
    expect(Math.abs(segments[1].position.x)).toBeCloseTo(MAZEPIECE_HALFWIDTH)
  })

  it('can add a new segment, given an existing segment', () => {
    const segment = new MazeStraightSegment()
    const connection = segment.getTransformedConnections()[0]
    const newSegment = getPossibleSegments(connection)[0]

    expect(newSegment.position.clone().sub(segment.position).length()).toBeCloseTo(MAZEPIECE_HALFWIDTH*2)
  })

  it('can add a new segment on either side', () => {
    const segment = new MazeStraightSegment()
    const connection = segment.getTransformedConnections()[1]
    const newSegment = getPossibleSegments(connection)[1]

    expect(newSegment.position.clone().sub(segment.position).length()).toBeCloseTo(MAZEPIECE_HALFWIDTH*2)
  })

  it('keeps track of connections between segments', () => {
    const segment = new MazeStraightSegment()
    const connection = segment.getTransformedConnections()[1]
    const newSegment = getPossibleSegments(connection, segment)[1]
    segment.addConnectedSegment(1, newSegment)

    expect(segment.connections[1].connectedTo).toBe(newSegment)
    expect(newSegment.connections[0].connectedTo).toBe(segment)
  })
})

function MazeLibrary(MazeLibrary: any) {
  throw new Error('Function not implemented.')
}
