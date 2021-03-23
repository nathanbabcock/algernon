import { useEffect } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Clock, Object3D, Vector3 } from 'three'
import { Capsule } from 'three/examples/jsm/math/Capsule'
import { Octree } from 'three/examples/jsm/math/Octree'

export default function FPSControls(props: { collisionObjects?: Object3D }) {
  const GRAVITY = 10
  const MOUSE_SENSITIVITY = 1000
  const clock = new Clock()
  const worldOctree = new Octree()
  
  const { camera, scene } = useThree()
  setTimeout(() => worldOctree.fromGraphNode(scene), 100)

  const playerCollider = new Capsule(new Vector3(0, 0.35, 0), new Vector3(0, 1, 0), 0.35)
  const playerVelocity = new Vector3()
  const playerDirection = new Vector3()

  let playerOnFloor = false
  const keyStates: any = {}

  useEffect(() => {
    document.addEventListener('keydown', (event: KeyboardEvent) => keyStates[ event.code ] = true)
    document.addEventListener('keyup', (event: KeyboardEvent) => keyStates[ event.code ] = false)
    document.addEventListener('mousedown', () => document.body.requestPointerLock())
    document.body.addEventListener('mousemove', (event: MouseEvent) => {
      if (document.pointerLockElement !== document.body) return
      camera.rotation.z -= event.movementX / MOUSE_SENSITIVITY
      camera.rotation.x -= event.movementY / MOUSE_SENSITIVITY
    })
  })

  const playerCollisions = () => {
    const result = worldOctree.capsuleIntersect(playerCollider)
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
    const speed = 25
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
        playerVelocity.z = 15
    }
  }  

  useFrame(() => {
    const deltaTime = Math.min(0.1, clock.getDelta())
    controls(deltaTime)
    updatePlayer(deltaTime)
  })

  return null
}