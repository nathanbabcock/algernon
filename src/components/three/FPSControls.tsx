import { useCylinder } from '@react-three/cannon'
import { useEffect, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Vector3 } from 'three'
import { DEBUG_POSITION } from '../../config'

const PLAYER_HEIGHT = 1
// const PLAYER_CROUCH_HEIGHT = 0.5
const PLAYER_RADIUS = 0.35
const MOUSE_SENSITIVITY = 1000

type FPSControlsProps = {
  setPaused: any,
  rotation?: [number, number, number],
  position?: [number, number, number],
}

export default function FPSControls(props: FPSControlsProps) {
  const cylinderArgs: [number, number, number, number] = [PLAYER_RADIUS, PLAYER_RADIUS, PLAYER_HEIGHT, 8]
  const [playerCylinder, cylinderBody] = useCylinder(() => ({
    mass: 1,
    linearDamping: 0.9999,
    fixedRotation: true,
    args: cylinderArgs,
    position: props.position || [0, 0, 0],
  }))

  const { camera } = useThree()

  const [keyStates] = useState<any>({})

  useEffect(() => {
    camera.rotation.x = props.rotation ? props.rotation[0] : 0
    camera.rotation.z = props.rotation ? props.rotation[2] : 0

    const onKeydown = (event: KeyboardEvent) => {
      keyStates[ event.code ] = true
      
      if (event.code === 'Escape' && document.pointerLockElement === document.body) {
        props.setPaused(true)
        document.exitPointerLock()
      }
      else if (event.code === 'KeyR') {
        console.log('Hackermode enabled')
        cylinderBody.position.set(91, 56, 0)
      }
    }
    const onKeyup = (event: KeyboardEvent) =>  keyStates[ event.code ] = false
    const onMousedown = () => document.body.requestPointerLock()
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
    document.addEventListener('mousedown', onMousedown)
    document.addEventListener('pointerlockchange', onPointerLockChange)

    return () => {
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('keyup', onKeyup)
      document.removeEventListener('mousedown', onMousedown)
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
    // Copy position to camera
    const cylinderPos = playerCylinder!.current!.position
    camera.position.set(cylinderPos.x, cylinderPos.y, cylinderPos.z + PLAYER_HEIGHT/2)

    // Debug position
    const debug = document.getElementById('debug')
    if (debug && DEBUG_POSITION) debug.innerHTML = `(${camera.position.x.toFixed(3)}, ${camera.position.y.toFixed(3)}, ${camera.position.z.toFixed(3)})`;

    // Handle keyboard controls
    const inputVelocity = new Vector3()
    let MOVESPEED = 5
    if (keyStates['ShiftLeft']) MOVESPEED *= 2

    if (keyStates['KeyW'])
      inputVelocity.add(getForwardVector())
    if (keyStates['KeyS'])
      inputVelocity.sub(getForwardVector())
    if (keyStates['KeyA'])
      inputVelocity.sub(getSideVector())
    if (keyStates['KeyD'])
      inputVelocity.add(getSideVector())

    if (inputVelocity.x === 0 && inputVelocity.y === 0 && inputVelocity.z === 0)
      return

    // Apply velocity to physics objects
    inputVelocity.normalize().multiplyScalar(MOVESPEED)
    cylinderBody.velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z)
  })

  return (
    <mesh ref={playerCylinder} visible={false}>
      <cylinderBufferGeometry args={cylinderArgs}/>
      <meshBasicMaterial color="green" wireframe/>
    </mesh>
  )
}