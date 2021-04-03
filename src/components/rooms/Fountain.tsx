/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { useFrame, useThree } from 'react-three-fiber'
import { useCylinder } from '@react-three/cannon'

type GLTFResult = GLTF & {
  nodes: {
    f: THREE.Mesh
    h_1: THREE.Mesh
    f_1: THREE.Mesh
    f_3: THREE.Mesh
    f_2: THREE.Mesh
    h: THREE.Mesh
  }
  materials: {
    ['Material.001']: THREE.MeshStandardMaterial
    ['Material.004']: THREE.MeshStandardMaterial
  }
}

export default function Model(props: any) {
  const group = useRef<THREE.Group>()
  const mesh = useRef<THREE.Mesh>()
  
  const parentPos: THREE.Vector3 = props.position || new THREE.Vector3()
  const parentRot: THREE.Euler = props.rotation || new THREE.Euler()

  const { nodes, materials } = useGLTF('models/fountain.glb') as GLTFResult
  materials['Material.001'].transparent = true
  materials['Material.001'].opacity = 0.3
  
  const { clock } = useThree()
  
  useFrame((_, delta) => {
    if (!mesh.current) return
    
    const bounce = 501.71 + Math.sin(clock.elapsedTime * 25)
    mesh.current!.position.setY(bounce)
    
    const mat = mesh.current!.material! as THREE.MeshStandardMaterial
    const map: THREE.CanvasTexture = mat.map as THREE.CanvasTexture
    map.offset.setY(map.offset.y - delta/3)
  })
  
  const hitboxArgs: [number, number, number, number] = [0.75, 5, 6.5, 8]
  const [hitbox] = useCylinder(() => ({
    type: 'Static',
    args: hitboxArgs,
    rotation: [parentRot.x + Math.PI/2, parentRot.y, parentRot.z],
    position: [parentPos.x, parentPos.y, parentPos.z],
  }))

  const scale = 0.005
  return (
    <group ref={group} dispose={null}>
      <mesh ref={hitbox} visible={false}>
        <cylinderBufferGeometry args={hitboxArgs}/>
        <meshBasicMaterial color="green" wireframe/>
      </mesh>

      <group position={parentPos} rotation={parentRot}>
        {/* <pointLight position={[0, 0, 7.5]} intensity={0.2} castShadow/> */}

        <group scale={[scale, scale, scale]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, -0.1]}>
          <mesh ref={mesh} material={materials['Material.001']} geometry={nodes.f.geometry} position={[0, 501.71, 5.93]} castShadow receiveShadow/>
          <mesh material={materials['Material.004']} geometry={nodes.h_1.geometry} position={[0, 117.86, -6]} castShadow receiveShadow/>
          <mesh material={materials['Material.001']} geometry={nodes.f_1.geometry} position={[0, 71.51, 0]} castShadow receiveShadow/>
          <mesh material={materials['Material.001']} geometry={nodes.f_3.geometry} position={[0, 330.9, 0]} castShadow receiveShadow/>
          <mesh material={materials['Material.001']} geometry={nodes.f_2.geometry} position={[0, 449.14, 0]} castShadow receiveShadow/>
          <mesh material={nodes.h.material} geometry={nodes.h.geometry} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('models/fountain.glb')