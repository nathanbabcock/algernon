import { useCylinder } from '@react-three/cannon'
import { useEffect, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Vector3 } from 'three'

const PLAYER_HEIGHT = 1
// const PLAYER_CROUCH_HEIGHT = 0.5
const PLAYER_RADIUS = 0.35
const MOUSE_SENSITIVITY = 1000

type FPSControlsProps = {
  setPaused: any
}

export default function FPSControls(props: FPSControlsProps) {
  const cylinderArgs: [number, number, number, number] = [PLAYER_RADIUS, PLAYER_RADIUS, PLAYER_HEIGHT, 8]
  const [playerCylinder, cylinderBody] = useCylinder(() => ({
    mass: 1,
    angularDamping: 1,
    args: cylinderArgs,
    rotation: [Math.PI/2, 0, 0],
  }))

  const { camera } = useThree()

  const [keyStates] = useState<any>({})

  useEffect(() => {
    camera.rotation.x = Math.PI/2
    camera.rotation.z = 0

    const onKeydown = (event: KeyboardEvent) => keyStates[ event.code ] = true
    const onKeyup = (event: KeyboardEvent) => keyStates[ event.code ] = false
    const onMouseup = () => document.body.requestPointerLock()
    const onMousemove = (event: MouseEvent) => {
      if (document.pointerLockElement !== document.body) return
      camera.rotation.z -= event.movementX / MOUSE_SENSITIVITY
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
      inputVelocity.sub(getSideVector().multiplyScalar(MOVESPEED))
    if (keyStates['KeyD'])
      inputVelocity.add(getSideVector().multiplyScalar(MOVESPEED))

    const cylinderPos = playerCylinder!.current!.position
    camera.position.set(cylinderPos.x, cylinderPos.y, cylinderPos.z + PLAYER_HEIGHT/2)

    if (inputVelocity.x === 0 && inputVelocity.y === 0 && inputVelocity.z === 0)
      return
    
    cylinderBody.velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z)
  })

  return (
    <mesh ref={playerCylinder} receiveShadow visible={false}>
      <cylinderBufferGeometry args={cylinderArgs}/>
      <meshBasicMaterial color="green" wireframe/>
    </mesh>
  )
}