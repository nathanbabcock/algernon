import '@testing-library/react'
import { Euler, Vector3 } from 'three'
import {  addSegment, getConnections, getPossibleSegments, MazeConnection, MazeConnectionConfig, MAZEPIECE_HALFWIDTH, MazeSegment } from './MazeLibrary'

describe('MazeLibrary', () => {
  it('has a config for maze connections', () => {
    expect(MazeConnectionConfig).toBeDefined()
  })

  it('creates a maze segment', () => {
    const segment = {
      type: 'straight',
      rotation: new Euler(),
      position: new Vector3(),
    } as MazeSegment
    expect(segment).toBeDefined()
  })

  it('gets all the connections from a maze segment', () => {
    const segment = {
      type: 'straight',
      rotation: new Euler(),
      position: new Vector3(),
    } as MazeSegment
    const connections = getConnections(segment)
    expect(connections).toBeDefined()
  })

  it('rotates the connection direction based on the parent object', () => {
    const segment = {
      type: 'straight',
      rotation: new Euler(0, 0, -Math.PI/2),
      position: new Vector3(),
    } as MazeSegment
    const connections = getConnections(segment)
    expect(connections[0].forward.x).toBeCloseTo(1)
    expect(connections[0].forward.y).toBeCloseTo(0)
  })

  it('translates the connection position based on the parent object rotation', () => {
    const segment = {
      type: 'straight',
      rotation: new Euler(0, 0, -Math.PI/2),
      position: new Vector3()
    } as MazeSegment
    const connections = getConnections(segment)
    expect(connections[0].position.x).toBeCloseTo(MAZEPIECE_HALFWIDTH)
    expect(connections[0].position.y).toBeCloseTo(0)
    expect(connections[1].position.x).toBeCloseTo(-MAZEPIECE_HALFWIDTH)
    expect(connections[1].position.y).toBeCloseTo(0)
  })

  it('translates the connection position based on the parent object position', () => {
    const segment = {
      type: 'straight',
      rotation: new Euler(0, 0, -Math.PI/2),
      position: new Vector3(10, 10, 10),
    } as MazeSegment
    const connections = getConnections(segment)
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
})