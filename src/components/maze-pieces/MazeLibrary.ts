import React from 'react';
import { Euler, Quaternion, Vector3 } from 'three';

export const MAZEPIECE_HALFWIDTH = 2
export const MAZEPIECE_HEIGHT = 2

// export type MazeSegment = {
//   id: number,
//   type: string,
//   rotation: Euler,
//   position: Vector3,
//   isVisible: boolean,
//   hasBeenSeen: boolean,
//   openDirections: string,
// };

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

  constructor() {
    super('straight')
  }
}

// export const MazeConnectionConfig = {
//   'straight': [
//     {
//       position: new Vector3(0, MAZEPIECE_HALFWIDTH, 0),
//       forward: new Vector3(0, 1, 0),
//     },
//     {
//       position: new Vector3(0, -MAZEPIECE_HALFWIDTH, 0),
//       forward: new Vector3(0, -1, 0),
//     },
//   ] as MazeConnection[]
// }

// export function getConnections(segment: MazeSegment): MazeConnection[] {
//   let connections = MazeConnectionConfig[segment.type as keyof typeof MazeConnectionConfig]
//   connections = connections.map(connection => {
//     return {
//       forward: connection.forward.clone().applyEuler(segment.rotation),
//       position: connection.position.clone().applyEuler(segment.rotation).add(segment.position),
//     } as MazeConnection
//   })

//   return connections;
// }

const MazeLibrary = [
  MazeStraightSegment,
]

export function getPossibleSegments(givenConnection: MazeConnection, givenSegment?: MazeSegment): MazeSegment[] {
  // TODO @refactor -- flatten this nested loop with flatMap()
  const possibleSegments: MazeSegment[] = [];

  // Loop over pieces in library
  MazeLibrary.forEach(Segment => {
    const segment = new Segment()
    
    // Loop over connections in piece
    segment.connections.forEach(connection => {
      const quaternion = new Quaternion().setFromUnitVectors(
        connection.forward.clone().normalize(),
        givenConnection.forward.clone().normalize()
      )

      const rotatedPosition = connection.position.clone().applyQuaternion(quaternion)
      const translatedPosition = givenConnection.position.clone().add(rotatedPosition)

      segment.rotation.setFromQuaternion(quaternion)
      segment.position.copy(translatedPosition)
      if (givenSegment) connection.connectedTo = givenSegment

      // Add that transformed segment to the list of possible segments
      possibleSegments.push(segment)
    })
  })

  return possibleSegments
}