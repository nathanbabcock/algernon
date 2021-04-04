import { useGLTF } from '@react-three/drei'
import React, { useState } from 'react'
import { useThree, useFrame } from 'react-three-fiber'
import { Vector3, Euler } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { NUM_LOCATIONS } from '../../config'
import MazeDeadEnd from '../maze-pieces/MazeDeadEnd'
import { MazeSegment, MazeConnection, MAZEPIECE_HALFWIDTH } from '../maze-pieces/MazeLibrary'
import showLocationDiscoveredUI from '../ui/locationDiscovered'
import { Text } from '@react-three/drei'

type GLTFResult = GLTF & {
  nodes: {
    tomstonesobj: THREE.Mesh
  }
  materials: {
    wire_086086086: THREE.MeshStandardMaterial
  }
}

export default function TheEnd(props: any) {
  let position = new Vector3()
  let rotation = new Euler()
  if (props.position instanceof Array) position.set(...(props.position as [number, number, number]))
  if (props.rotation instanceof Array) rotation.set(...(props.rotation as [number, number, number]))
  if (props.position instanceof Vector3) position.copy(props.position)
  if (props.rotation instanceof Euler) rotation.copy(props.rotation)

  const [ segment ] = useState<TheEndSegment>(
    props.segment || new TheEndSegment(position, rotation)
  )

  const { camera } = useThree()
  const [ discovered, setDiscovered ] = useState(false)
  const updateDiscovered = () => {
    if (discovered) return
    if (segment.containsPoint(camera.position)) {
      setDiscovered(true)
      showLocationDiscoveredUI(`Algernon's Grave Discovered`, `Location ${NUM_LOCATIONS}/${NUM_LOCATIONS}`)
    }
  }
  useFrame(updateDiscovered)

  const { nodes, materials } = useGLTF('/models/tombstone.glb') as GLTFResult
  return <group>
    <MazeDeadEnd segment={segment} rotation={props.rotation} position={props.position}/>
    <group position={props.position} rotation={props.rotation}>
      <mesh geometry={nodes.tomstonesobj.geometry} material={materials.wire_086086086} scale={[0.17, 0.17, 0.17]} />

      <Text
        color="black"
        position={[0, -.15, 1]}
        rotation={[Math.PI/2, 0, 0]}
        fontSize={0.1}
        fillOpacity={0.3}
        textAlign="center"
      >
        {`RIP\nAlgernon`}
      </Text>

      <Text
        color="white"
        position={[0, -.6, .001]}
        rotation={[0, 0, 0]}
        fontSize={0.15}
        textAlign="center"
      >
        {`Press F\nto place Flowers`}
      </Text>

    </group>
  </group>
};

export class TheEndSegment extends MazeSegment {
  public connections: MazeConnection[] = [
    {
      position: new Vector3(0, -MAZEPIECE_HALFWIDTH, 0),
      forward: new Vector3(0, -1, 0),
    },
  ] as MazeConnection[]

  constructor(position: Vector3, rotation: Euler, id?: number) {
    super('the-end', position, rotation, id)
  }
}