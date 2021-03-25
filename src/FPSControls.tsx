import { useEffect } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Clock, Group, Vector3 } from 'three'
import { Capsule } from 'three/examples/jsm/math/Capsule'
import { Octree } from 'three/examples/jsm/math/Octree'

type FPSControlsProps = {
  octree: React.MutableRefObject<Octree>,
  requestCollisionUpdate: any,
  setPaused: any
}

export default function FPSControls(props: FPSControlsProps) {
  const GRAVITY = 15
  const MOUSE_SENSITIVITY = 1000
  const clock = new Clock()
  
  const { camera } = useThree()
  useEffect(() => void(setTimeout(() => props.requestCollisionUpdate()), 100))

  const playerCollider = new Capsule(new Vector3(0, 0, 0), new Vector3(0, 0, 1), 0.35)
  const playerVelocity = new Vector3()
  const playerDirection = new Vector3()

  let playerOnFloor = false
  const keyStates: any = {}

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => keyStates[ event.code ] = true
    const onKeyup = (event: KeyboardEvent) => keyStates[ event.code ] = false
    const onMouseup = () => document.body.requestPointerLock()
    const onMousemove = (event: MouseEvent) => {
      if (document.pointerLockElement !== document.body) return
      camera.rotation.z -= event.movementX / MOUSE_SENSITIVITY
      camera.rotation.x -= event.movementY / MOUSE_SENSITIVITY
    }
    const onPointerLockChange = () => {
      props.setPaused(document.pointerLockElement !== document.body)
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

  const playerCollisions = () => {
    const result = props.octree.current.capsuleIntersect(playerCollider)
    playerOnFloor = false
    if (!result) return
    playerOnFloor = result.normal.z > 0
    if (!playerOnFloor)
      playerVelocity.addScaledVector(result.normal, - result.normal.dot(playerVelocity))
    playerCollider.translate(result.normal.multiplyScalar(result.depth))
  }

  const updatePlayer = (deltaTime: number) => {
    if (playerOnFloor) {
      const damping = Math.exp(- 3 * deltaTime) - 1
      playerVelocity.addScaledVector(playerVelocity, damping)
    } else {
      playerVelocity.z -= GRAVITY * deltaTime
    }

    const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime )
    playerCollider.translate(deltaPosition)
    playerCollisions()
    camera.position.copy(playerCollider.end)
  }

  const getForwardVector = () => {
    camera.getWorldDirection(playerDirection)
    playerDirection.z = 0
    playerDirection.normalize()
    return playerDirection
  }

  const getSideVector = () => {
    camera.getWorldDirection(playerDirection)
    playerDirection.z = 0
    playerDirection.normalize()
    playerDirection.cross( camera.up )
    return playerDirection
  }

  const controls = (deltaTime: number) => {
    const speed = 15
    if (playerOnFloor) {
      if (keyStates['KeyW'])
        playerVelocity.add( getForwardVector().multiplyScalar(speed * deltaTime))
      if (keyStates['KeyS'])
        playerVelocity.add( getForwardVector().multiplyScalar(-speed * deltaTime))
      if (keyStates['KeyA'])
        playerVelocity.add( getSideVector().multiplyScalar(-speed * deltaTime))
      if (keyStates['KeyD'])
        playerVelocity.add(getSideVector().multiplyScalar(speed * deltaTime))
      if (keyStates['Space']) 
        playerVelocity.z = 7.5
    }
  }  

  useFrame(() => {
    const deltaTime = Math.min(0.1, clock.getDelta())
    controls(deltaTime)
    updatePlayer(deltaTime)
  })

  return null
}