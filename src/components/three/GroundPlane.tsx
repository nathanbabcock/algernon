import { usePlane } from '@react-three/cannon'
import { Plane } from '@react-three/drei'
import { GROUND_COLOR } from '../../theme'

export default function GroundPlane(props: any) {
  usePlane(() => ({ type: 'Static' }))

  return <Plane args={[1000, 1000, 1000, 1000]} receiveShadow>
      <meshPhongMaterial attach="material" color={GROUND_COLOR}/>
    </Plane>
}