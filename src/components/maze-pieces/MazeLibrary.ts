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

  public connections: MazeConnection[] = []

  constructor(type: string, id = 0) {
    this.id = id
    this.type = type
  }

  /**
   * TODO new foundation for getCurrentSegment()
   * Recursive with children, if applicable
   */
  public containsPoint(point: Vector3): boolean {
    return false
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

  constructor(id?: number) {
    super('straight', id)
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

  constructor(id?: number) {
    super('corner', id)
  }
}

export class MazeDeadEndSegment extends MazeSegment {
  public connections: MazeConnection[] = [
    // {
    //   position: new Vector3(0, MAZEPIECE_HALFWIDTH, 0),
    //   forward: new Vector3(0, 1, 0),
    // },
    {
      position: new Vector3(0, -MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, -1, 0),
    },
  ] as MazeConnection[]

  constructor() {
    super('corner')
  }
}

const MazeLibrary = [
  MazeStraightSegment,
  MazeCornerSegment,
  // MazeDeadEndSegment,
]

export function getPossibleSegments(givenConnection: MazeConnection, givenSegment?: MazeSegment): MazeSegment[] {
  // TODO @refactor -- flatten this nested loop with flatMap()
  const possibleSegments: MazeSegment[] = [];

  // Loop over pieces in library
  MazeLibrary.forEach(Segment => {
    // Loop over connections in piece
    new Segment().connections.forEach((connection, index) => {
      const newSegment = new Segment()
      // clone the segment to avoid modifying state on the one we're iterating over
      // (those state changes would be retained across iterations)

      const quaternion = new Quaternion().setFromUnitVectors(
        connection.forward.clone().normalize(),
        givenConnection.forward.clone().multiplyScalar(-1).normalize()
      )

      const rotatedPosition = connection.position.clone().applyQuaternion(quaternion)
      const translatedPosition = givenConnection.position.clone().sub(rotatedPosition)

      newSegment.rotation.setFromQuaternion(quaternion)
      newSegment.position.copy(translatedPosition)
      if (givenSegment) newSegment.connections[index].connectedTo = givenSegment

      if (newSegment.rotation.x < 0) // SUS
        newSegment.rotation.set(0, newSegment.rotation.y, newSegment.rotation.z)

      // Add that transformed segment to the list of possible segments
      possibleSegments.push(newSegment)
    })
  })

  return possibleSegments
}