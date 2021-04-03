import { DEBUG_CONNECTIONS } from '../../config'
import { MazeSegment } from '../maze-pieces/MazeLibrary'
import { Text } from '@react-three/drei'

export default function MazeConnectionHelper(props: { segment: MazeSegment }) {
  if (!DEBUG_CONNECTIONS) return null
  return (
    <group position={props.segment.position} rotation={props.segment.rotation}>
      { props.segment.connections.map((connection, index) => (
        <group key={index}>
          <arrowHelper args={[connection.forward, connection.position, 1, 0xff0000]}/>
          <Text position={connection.position.clone().setZ(0.25).add(connection.forward.clone().multiplyScalar(-0.5))} rotation={[Math.PI/2, 0, 0]}>
            {index}
          </Text>
        </group>
      ))}
    </group>
  )
}
