import { useBox } from '@react-three/cannon'
import { BufferGeometry, Euler, Material, Vector3 } from 'three'

export type MeshColliderProps = {
  material: Material,
  geometry: BufferGeometry,
  parentPosition: Vector3,
  parentRotation: Euler,
}

export default function MeshCollider(props: any) {
  const geometry: BufferGeometry = props.geometry
  const box = geometry.boundingBox!
  const dims = box.max.clone().sub(box.min)
  const pos = box.min.clone().add(dims.clone().multiplyScalar(0.5))
  pos.add(props.parentPosition.clone()).applyEuler(props.parentRotation)

  const [ref] = useBox(() => ({
    type: 'Static',
    args: [dims.x, dims.y, dims.z],
    position: [pos.x, pos.y, pos.z],
    rotation: [props.parentRotation.x, props.parentRotation.y, props.parentRotation.z],
  }))

  return <group position={pos.clone().negate()}>
    <mesh ref={ref} material={props.material} geometry={props.geometry}/>
  </group>
};
