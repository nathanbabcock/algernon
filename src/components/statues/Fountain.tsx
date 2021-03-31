/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { useFrame, useThree } from 'react-three-fiber'

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

export default function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  
  const { nodes, materials } = useGLTF('models/fountain.glb') as GLTFResult
  materials['Material.001'].transparent = true
  materials['Material.001'].opacity = 0.3
  
  const scale = 0.005
  
  const mesh = useRef<THREE.Mesh>()
  useEffect(() => void(console.log(mesh.current)))

  const three = useThree()
  console.log(three)

  useFrame((_, delta) => {
    if(!mesh.current) return
    
    const bounce = 501.71 + Math.sin(three.clock.elapsedTime * 25)
    mesh.current!.position.setY(bounce)

    const mat = mesh.current!.material! as THREE.MeshStandardMaterial
    const map: THREE.CanvasTexture = mat.map as THREE.CanvasTexture
    map.offset.setY(map.offset.y - delta/3)
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={[scale, scale, scale]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, -0.1]}>
        <mesh ref={mesh} material={materials['Material.001']} geometry={nodes.f.geometry} position={[0, 501.71, 5.93]} />
        <mesh material={materials['Material.004']} geometry={nodes.h_1.geometry} position={[0, 117.86, -6]} />
        <mesh material={materials['Material.001']} geometry={nodes.f_1.geometry} position={[0, 71.51, 0]} />
        <mesh material={materials['Material.001']} geometry={nodes.f_3.geometry} position={[0, 330.9, 0]} />
        <mesh material={materials['Material.001']} geometry={nodes.f_2.geometry} position={[0, 449.14, 0]} />
        <mesh material={nodes.h.material} geometry={nodes.h.geometry} />
      </group>
    </group>
  )
}

useGLTF.preload('models/fountain.glb')
