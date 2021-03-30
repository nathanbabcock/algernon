import { useCylinder } from '@react-three/cannon'
import { useEffect, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Object3D, Vector3 } from 'three'

type FPSControlsProps = {
  setPaused: any
}

const PLAYER_HEIGHT = 1
const PLAYER_CROUCH_HEIGHT = 0.5
const PLAYER_RADIUS = 0.35

const MOUSE_SENSITIVITY = 1000

export default function FPSControls(props: FPSControlsProps) {
  const cylinderArgs: [number, number, number, number] = [PLAYER_RADIUS, PLAYER_RADIUS, PLAYER_HEIGHT, 32]
  const [playerCylinder, cylinderBody] = useCylinder(() => ({ mass: 1, angularDamping: 1, args: cylinderArgs, rotation: [Math.PI/2, 0, 0] }))

  const { camera } = useThree()

  const [keyStates] = useState<any>({})

  const [pitchObject] = useState(new Object3D())

  const [yawObject] = useState(new Object3D())
  yawObject.position.z = PLAYER_HEIGHT
  yawObject.add(pitchObject)

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => keyStates[ event.code ] = true
    const onKeyup = (event: KeyboardEvent) => keyStates[ event.code ] = false
    const onMouseup = () => document.body.requestPointerLock()
    const onMousemove = (event: MouseEvent) => {
      if (document.pointerLockElement !== document.body) return
      camera.rotation.z += event.movementX / MOUSE_SENSITIVITY
      camera.rotation.x -= event.movementY / MOUSE_SENSITIVITY
    }
    const onPointerLockChange = () => {
      const paused = document.pointerLockElement !== document.body
      props.setPaused(paused)
    }

    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('keydown', onKeydown)
    document.addEventListener('keyup', onKeyup)
    document.addEventListener('mousedown', onMouseup)
    document.addEventListener('pointerlockchange', onPointerLockChange)

    return () => {
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('keyup', onKeyup)
      document.removeEventListener('mousedown', onMouseup)
      document.addEventListener('pointerlockchange', onPointerLockChange)
    }
  })

  const getForwardVector = () => {
    const playerDirection = new Vector3()
    camera.getWorldDirection(playerDirection)
    playerDirection.z = 0
    playerDirection.normalize()
    return playerDirection
  }

  const getSideVector = () => {
    const playerDirection = new Vector3()
    camera.getWorldDirection(playerDirection)
    playerDirection.z = 0
    playerDirection.normalize()
    playerDirection.cross( camera.up )
    return playerDirection
  }

  useFrame(() => {
    const inputVelocity = new Vector3()
    const MOVESPEED = 10

    if (keyStates['KeyW'])
      inputVelocity.add(getForwardVector().multiplyScalar(MOVESPEED))
    if (keyStates['KeyS'])
      inputVelocity.sub(getForwardVector().multiplyScalar(MOVESPEED))
    if (keyStates['KeyA'])
      inputVelocity.add(getSideVector().multiplyScalar(MOVESPEED))
    if (keyStates['KeyD'])
      inputVelocity.sub(getSideVector().multiplyScalar(MOVESPEED))

    const cylinderPos = playerCylinder!.current!.position
    camera.position.set(cylinderPos.x, cylinderPos.y, cylinderPos.z)

    if (inputVelocity.x === 0 && inputVelocity.y === 0 && inputVelocity.z === 0)
      return
    
    // inputVelocity.applyEuler(camera.rotation)
    cylinderBody.velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z)
    // console.log(inputVelocity.x, inputVelocity.y, inputVelocity.z)
  })

  return (
    <mesh ref={playerCylinder} receiveShadow>
      <cylinderBufferGeometry args={cylinderArgs}/>
      <meshBasicMaterial color="green" wireframe/>
    </mesh>
  )
}