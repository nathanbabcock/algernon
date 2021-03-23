import { useSphere } from '@react-three/cannon';
import { useEffect, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Euler, Object3D, Quaternion, Vector3 } from 'three';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
export default function PointerLockControls() {
  const args = 1

  const { camera } = useThree()
  const [ref, cannonBody] = useSphere(() => ({ mass: 1, args }))

  const eyeZPos = 2; // eyes are 2 meters above the ground
  const velocityFactor = 0.2;
  // const jumpVelocity = 20;

  const pitchObject = new Object3D();
  pitchObject.add(camera);

  const yawObject = new Object3D();
  yawObject.position.z = eyeZPos;
  yawObject.add(pitchObject);

  const quat = new Quaternion();

  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const [canJump, setCanJump] = useState(false);

  // cannonBody.addEventListener('collide', () => setCanJump(true))

  var velocity = cannonBody.velocity;
  var PI_2 = Math.PI / 2;

  var onMouseMove = (event: MouseEvent) => {
    if (!enabled) return;

    var movementX = event.movementX || 0;
    var movementY = event.movementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2, pitchObject.rotation.x));
  };

  var onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        setMoveForward(true);
        break;

      case 37: // left
      case 65: // a
        setMoveLeft(true);
        break;

      case 40: // down
      case 83: // s
        setMoveBackward(true);
        break;

      case 39: // right
      case 68: // d
        setMoveRight(true);
        break;

      case 32: // space
        if (canJump) console.log('could jump but won\'t')//velocity.y = jumpVelocity;
        setCanJump(false);
        break;
    }

  };

  var onKeyUp = (event: KeyboardEvent) => {
    switch (event.keyCode) {

      case 38: // up
      case 87: // w
        setMoveForward(false);
        break;

      case 37: // left
      case 65: // a
        setMoveLeft(false);
        break;

      case 40: // down
      case 83: // a
        setMoveBackward(false);
        break;

      case 39: // right
      case 68: // d
        setMoveRight(false);
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
  })

  const [enabled] = useState(false)

  // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
  useFrame((_, delta) => {
    var inputVelocity = new Vector3();
    if (!enabled) return;

    delta *= 0.1;
    inputVelocity.set(0, 0, 0);

    if (moveForward)
      inputVelocity.z = -velocityFactor * delta;
    if (moveBackward)
      inputVelocity.z = velocityFactor * delta;

    if (moveLeft)
      inputVelocity.x = -velocityFactor * delta;
    if (moveRight)
      inputVelocity.x = velocityFactor * delta;

    // Convert velocity to world coordinates
    quat.setFromEuler(new Euler(pitchObject.rotation.x, yawObject.rotation.y, 0));
    quat.multiplyVector3(inputVelocity);

    // Add to the object
    velocity.set(inputVelocity.x,inputVelocity.y, inputVelocity.z)

    cannonBody.position.set(yawObject.position.x, yawObject.position.y, yawObject.position.z);
  })

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry attach="geometry" args={[args]}/>
      <meshStandardMaterial attach="material" />
    </mesh>
  )
};