import { Euler, Quaternion, Vector3 } from 'three';

export const MAZEPIECE_HALFWIDTH = 2
export const MAZEPIECE_HEIGHT = 2

export type MazeConnection = {
  position: Vector3,
  forward: Vector3,
  connectedTo?: MazeSegment,
}

export abstract class MazeSegment {
  public id: number
  public type: string
  public rotation = new Euler()
  public position = new Vector3()
  public isVisible = false
  public hasBeenSeen = false
  public maze?: MazeSegment[]

  public connections: MazeConnection[] = []

  constructor(type: string, position: Vector3, rotation: Euler, id = 0) {
    this.id = id
    this.type = type
    this.position = position
    this.rotation = rotation
  }

  /**
   * If this segment has a submaze, gets the current segment within that submaze
   * @param point world position within the maze, typically three.camera.position
   * @returns current segemnt within this.maze or null if point is not within this.maze
   */
  public getCurrentSegment(point: Vector3): MazeSegment | null {
    if (!this.maze || this.maze.length === 0) return null
    let currentMazeSegment = null
    this.maze.forEach(segment => {
      if (segment.containsPoint(point))
        currentMazeSegment = segment
    })
    return currentMazeSegment
  }

  public containsPoint(point: Vector3, parentSegment?: MazeSegment): boolean {
    const pos = this.position.clone()
    // if (parentSegment) // Apply parent transform
    //   pos.applyEuler(parentSegment.rotation).add(parentSegment.position)

    return (
         point.x <= pos.x + MAZEPIECE_HALFWIDTH
      && point.x >= pos.x - MAZEPIECE_HALFWIDTH
      && point.y <= pos.y + MAZEPIECE_HALFWIDTH
      && point.y >= pos.y - MAZEPIECE_HALFWIDTH
    )
  }

  public getTransformedConnections(): MazeConnection[] {
    let connections
    connections = this.connections.map(connection => {
      return {
        forward: connection.forward.clone().applyEuler(this.rotation),
        position: connection.position.clone().applyEuler(this.rotation).add(this.position),
        connectedTo: connection.connectedTo,
      } as MazeConnection
    })
  
    return connections;
  }

  public addConnectedSegment(connectionIndex: number, segment: MazeSegment, otherConnectionIndex?: number) {
    this.connections[connectionIndex].connectedTo = segment
    if (otherConnectionIndex) segment.connections[otherConnectionIndex].connectedTo = this
  }

  public removeConnectedSegment(connectionIndex: number, segment: MazeSegment, otherConnectionIndex: number) {
    this.connections[connectionIndex].connectedTo = undefined
    segment.connections[otherConnectionIndex].connectedTo = undefined
  }
}

export class MazeStraightSegment extends MazeSegment {
  public connections: MazeConnection[] = [
    {
      position: new Vector3(0, MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, 1, 0),
    },
    {
      position: new Vector3(0, -MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, -1, 0),
    },
  ] as MazeConnection[]

  constructor(position: Vector3, rotation: Euler, id?: number) {
    super('straight', position, rotation, id)
  }
}

export class MazeCornerSegment extends MazeSegment {
  public connections: MazeConnection[] = [
    {
      position: new Vector3(0, MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, 1, 0),
    },
    {
      position: new Vector3(MAZEPIECE_HALFWIDTH, 0, 0),
      forward: new Vector3(1, 0, 0),
    },
  ] as MazeConnection[]

  constructor(position: Vector3, rotation: Euler, id?: number) {
    super('corner', position, rotation, id)
  }
}

export class MazeDeadEndSegment extends MazeSegment {
  public connections: MazeConnection[] = [
    {
      position: new Vector3(0, -MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, -1, 0),
    },
  ] as MazeConnection[]

  constructor(position: Vector3, rotation: Euler, id?: number) {
    super('dead-end', position, rotation, id)
  }
}

export class MazeNoFutureSegment extends MazeSegment {
  public connections: MazeConnection[] = [
    {
      position: new Vector3(0, -MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, -1, 0),
    },
  ] as MazeConnection[]

  constructor(position: Vector3, rotation: Euler, id?: number) {
    super('no-future', position, rotation, id)
  }
}

export class MazeNoPastSegment extends MazeSegment {
  public connections: MazeConnection[] = [
    {
      position: new Vector3(0, -MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, -1, 0),
    },
  ] as MazeConnection[]

  constructor(position: Vector3, rotation: Euler, id?: number) {
    super('no-past', position, rotation, id)
  }
}

export const MazeLibrary = [
  MazeStraightSegment,
  MazeCornerSegment,
  // MazeDeadEndSegment,
]

/**
 * @param givenConnection How to connect this segment to the rest of the maze
 * @param givenSegment The segment which the givenConnection is attached to
 * @param library (optionally) a list of types to create segments from
 * @returns A list of all the segments which could be created at this spot.
 * This includes all rotations and pairings of connections on the created segment
 */
export function getPossibleSegments(
  givenConnection: MazeConnection,
  givenSegment: MazeSegment,
  library?: any,
): MazeSegment[] {
  if (!library) library = MazeLibrary

  const possibleSegments: MazeSegment[] = [];

  // Loop over pieces in library
  library.forEach((Segment: any) => {
    // Loop over connections in piece
    new Segment(givenSegment.position, givenSegment.rotation).connections.forEach((connection: MazeConnection, index: number) => {
      const quaternion = new Quaternion().setFromUnitVectors(
        connection.forward.clone().normalize(),
        givenConnection.forward.clone().multiplyScalar(-1).normalize()
      )

      const rotatedPosition = connection.position.clone().applyQuaternion(quaternion)
      const translatedPosition = givenConnection.position.clone().sub(rotatedPosition)

      let rotation = new Euler().setFromQuaternion(quaternion)
      if (rotation.x < 0) // SUS
        rotation.set(0, rotation.y, rotation.z)
      
      // clone the segment to avoid modifying state on the one we're iterating over
      // (those state changes would be retained across iterations)
      const newSegment = new Segment(translatedPosition, rotation)
      if (givenSegment) newSegment.connections[index].connectedTo = givenSegment

      // Add that transformed segment to the list of possible segments
      possibleSegments.push(newSegment)
    })
  })

  return possibleSegments
}