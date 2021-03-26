import { Euler, Quaternion, Vector3 } from 'three';

export const MAZEPIECE_HALFWIDTH = 2
export const MAZEPIECE_HEIGHT = 2

export type MazeSegment = {
  id: number,
  type: string,
  rotation: Euler,
  position: Vector3,
  isVisible: boolean,
  hasBeenSeen: boolean,
  openDirections: string,
};

export type MazeConnection = {
  position: Vector3,
  forward: Vector3,
}

export const MazeConnectionConfig = {
  'straight': [
    {
      position: new Vector3(0, MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, 1, 0),
    },
    {
      position: new Vector3(0, -MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, -1, 0),
    },
  ] as MazeConnection[]
}

export function getConnections(segment: MazeSegment): MazeConnection[] {
  let connections = MazeConnectionConfig[segment.type as keyof typeof MazeConnectionConfig]
  connections = connections.map(connection => {
    return {
      forward: connection.forward.clone().applyEuler(segment.rotation),
      position: connection.position.clone().applyEuler(segment.rotation).add(segment.position),
    } as MazeConnection
  })

  return connections;
}

export function getPossibleSegments(givenConnection: MazeConnection): MazeSegment[] {
  // TODO @refactor -- flatten this nested loop with flatMap()
  const possibleSegments: MazeSegment[] = [];

  // Loop over pieces in library
  for (const type in MazeConnectionConfig) {
    
    // Loop over connections in piece
    MazeConnectionConfig[type as keyof typeof MazeConnectionConfig].forEach(connection => {
      const quaternion = new Quaternion().setFromUnitVectors(
        connection.forward.clone().normalize(),
        givenConnection.forward.clone().normalize()
      )
      
      const rotatedPosition = connection.position.clone().applyQuaternion(quaternion)
      const translatedPosition = givenConnection.position.clone().add(rotatedPosition)

      const segment = {
        type,
        rotation: new Euler().setFromQuaternion(quaternion),
        position: translatedPosition,
      } as MazeSegment

      // Add that transformed segment to the list of possible segments
      possibleSegments.push(segment)
    })
  }

  return possibleSegments
}