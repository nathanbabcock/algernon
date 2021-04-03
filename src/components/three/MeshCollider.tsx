import { useBox } from '@react-three/cannon'
import { BufferGeometry, Euler, Material, Vector3 } from 'three'

export type MeshColliderProps = {
  material: Material,
  geometry: BufferGeometry,
  position?: Vector3,
  rotation?: Euler,
  scale?: Vector3,
}

export default function MeshCollider(props: any) {
  const geometry: BufferGeometry = props.geometry
  const box = geometry.boundingBox!
  const dims = box.max.clone().sub(box.min)
  const pos = box.min.clone().add(dims.clone().multiplyScalar(0.5))
  
  let position = new Vector3()
  let rotation = new Euler()
  let scale = new Vector3(1, 1, 1)
  if (props.position instanceof Array) position.set(...(props.position as [number, number, number]))
  if (props.position instanceof Vector3) position.copy(props.position)
  if (props.rotation instanceof Array) rotation.set(...(props.rotation as [number, number, number]))
  if (props.rotation instanceof Euler) rotation.copy(props.rotation)
  if (props.scale instanceof Array) scale.set(...(props.scale as [number, number, number]))
  if (props.scale instanceof Vector3) scale.copy(props.scale)

  dims.multiply(scale)
  pos.multiply(scale)
  pos.add(position)

  const [ref] = useBox(() => ({
    type: 'Static',
    args: [dims.x, dims.y, dims.z],
    position: [pos.x, pos.y, pos.z],
    rotation: [rotation.x, rotation.y, rotation.z],
    scale: [scale.x, scale.y, scale.z],
  }))

  return <mesh ref={ref} material={props.material} geometry={props.geometry} castShadow receiveShadow scale={scale}/>
};
