import { usePlane } from '@react-three/cannon'

export default function GroundPlane(props: any) {
  const [plane] = usePlane(() => ({ type: 'Static' }))

  return <mesh ref={plane} receiveShadow>
    <planeBufferGeometry args={[1000, 1000]}>
      <meshPhongMaterial attach="material" color="grey"/>
    </planeBufferGeometry>
  </mesh>
}