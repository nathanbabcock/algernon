/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { Text, useGLTF } from '@react-three/drei'
import React, { useRef, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { Vector3 } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import Cheese from './Cheese'
import Whiteboard from './Whiteboard'
import Whiteboard2 from './Whiteboard2'
import MeshCollider from '../three/MeshCollider'
import { playSqueak, squeaks } from '../../helpers/squeak'

type GLTFResult = GLTF & {
  nodes: any,
  materials: {
    Material: THREE.MeshPhongMaterial
    Mouse: THREE.MeshPhongMaterial
  }
}

export default function EarlyGame(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('models/early-game.glb') as GLTFResult
  const { camera } = useThree()

  const algernonPos = new Vector3(2, 0, 0)
  const [algergone, setAlgergone] = useState(false)
  const updateAlgernon = () => {
    if (algergone) return
    if (camera.position.clone().sub(algernonPos).length() <= 5) {
      setAlgergone(true)
      squeaks.forEach(squeak => squeak.pause())
    }
  }
  if (!algergone) playSqueak()

  const [stage1Complete, setStage1Complete] = useState(false)
  const whiteboardPos = new Vector3(34.5, 21.5, 0)
  const updateStage1 = () => {
    if (stage1Complete) return
    if (camera.position.clone().sub(whiteboardPos).length() <= 10) {
      setStage1Complete(true)
      new Audio('sounds/applause.wav').play()
      new Audio('sounds/party-horn.wav').play()
    }
  }

  const [cheeseAcquired, setCheeseAcquired] = useState(false)
  const cheesePos = new Vector3(39, 20, 0.5)
  const updateCheese = () => {
    if (cheeseAcquired) return
    if (camera.position.clone().sub(cheesePos).length() <= 0.5) {
      setCheeseAcquired(true)
      new Audio('sounds/munch.wav').play()
    }
  }

  const [stage2Complete, setStage2Complete] = useState(false)
  const whiteboard2Pos = new Vector3(65, 47, 0)
  const updateStage2 = () => {
    if (stage2Complete) return
    if (camera.position.clone().sub(whiteboard2Pos).length() <= 10) {
      setStage2Complete(true)
      new Audio('sounds/applause.wav').play()
      new Audio('sounds/party-horn.wav').play()
    }
  }

  const [cheese2Acquired, setCheese2Acquired] = useState(false)
  const cheese2Pos = new Vector3(64, 51, 0.5)
  const updateCheese2 = () => {
    if (cheese2Acquired) return
    if (camera.position.clone().sub(cheese2Pos).length() <= 0.5) {
      setCheese2Acquired(true)
      new Audio('sounds/munch.wav').play()
    }
  }

  useFrame(() => {
    updateAlgernon()
    updateStage1()
    updateCheese()
    updateStage2()
    updateCheese2()
  })

  return (
    <group ref={group} dispose={null}>
      <group visible={!algergone}>
        <Text
          color="white"
          position={[2.05, 0, 0.45]}
          rotation={[Math.PI/2, Math.PI/2, 0]}
          fontSize={0.1}
          fillOpacity={1}
        >
          (algernon)
        </Text>

        <spotLight
          position={[-2, 0, 0.1]}
          angle={Math.PI/16}
          castShadow
          color="red"
        />
        <mesh material={materials.Mouse} geometry={nodes.Mouse_Mouse_0.geometry} position={[2.05, 0, 0.16]} castShadow receiveShadow/>
      </group>

      <Text
        color="black"
        position={[11.999, 20, 1]}
        rotation={[Math.PI/2, -Math.PI/2, 0]}
        fontSize={.5}
        fillOpacity={.15}
      > {`<  ?  >`} </Text>

      <Text
        color="black"
        position={[30, 26.001, 1]}
        rotation={[Math.PI/2, 0, 0]}
        fontSize={.5}
        fillOpacity={.15}
      > :( </Text>

      {/* <Text
        color="black"
        position={[30.999, 12, 1]}
        rotation={[Math.PI/2, -Math.PI/2, 0]}
        fontSize={.5}
        fillOpacity={.15}
      > :) </Text> */}

      <Whiteboard position={whiteboardPos} rotation={[0, 0, -3 * Math.PI/4]}/>
      <Cheese position={cheesePos} visible={!cheeseAcquired} scale={[0.2, 0.2, 0.2]}/>

      <Text
        color="black"
        position={[39.25, 20, 0.01]}
        rotation={[0, 0, -Math.PI/2]}
        fontSize={.5}
        fillOpacity={.15}
      >onward</Text>

      <Whiteboard2 position={whiteboard2Pos} rotation={[0, 0, Math.PI]}/>
      <Cheese position={cheese2Pos} visible={!cheese2Acquired} scale={[0.2, 0.2, 0.2]}/>

      <Text
        color="black"
        position={[64, 52.25, 0.01]}
        rotation={[0, 0, 0]}
        fontSize={.5}
        fillOpacity={.15}
      >again</Text>

      <MeshCollider geometry={nodes.Cube.geometry} material={materials.Material} position={[0, 1.5, 1]} />
      <MeshCollider geometry={nodes.SpawnRoom.geometry} material={materials.Material} position={[0, -1.5, 1]} />
      <MeshCollider geometry={nodes.Cube001.geometry} material={materials.Material} position={[1.5, 4, 1]} />
      <MeshCollider geometry={nodes.Cube002.geometry} material={materials.Material} position={[1.5, -4, 1]} />
      <MeshCollider geometry={nodes.Cube003.geometry} material={materials.Material} position={[7, 5.5, 1]} />
      <MeshCollider geometry={nodes.Cube004.geometry} material={materials.Material} position={[7, -5.5, 1]} />
      <MeshCollider geometry={nodes.RoomWalls001.geometry} material={materials.Material} position={[12.5, 0, 1]} />
      <MeshCollider geometry={nodes.Cube005.geometry} material={materials.Material} position={[-5.5, 0, 1]} />
      <MeshCollider geometry={nodes.Corner.geometry} material={materials.Material} position={[-4, -1.5, 1]} />
      <MeshCollider geometry={nodes.Cube006.geometry} material={materials.Material} position={[-2.5, 1.5, 1]} />
      <MeshCollider geometry={nodes.Corner001.geometry} material={materials.Material} position={[-4, 21.5, 1]} />
      <MeshCollider geometry={nodes.Cube013.geometry} material={materials.Material} position={[0, 18.5, 1]} />
      <MeshCollider geometry={nodes.Cube012.geometry} material={materials.Material} position={[1.5, 16, 1]} />
      <MeshCollider geometry={nodes.Cube011.geometry} material={materials.Material} position={[1.5, 24, 1]} />
      <MeshCollider geometry={nodes.Cube010.geometry} material={materials.Material} position={[7, 14.5, 1]} />
      <MeshCollider geometry={nodes.Cube009.geometry} material={materials.Material} position={[7, 25.5, 1]} />
      <MeshCollider geometry={nodes.Cube008.geometry} material={materials.Material} position={[-5.5, 20, 1]} />
      <MeshCollider geometry={nodes.Cube007.geometry} material={materials.Material} position={[-2.5, 18.5, 1]} />
      <MeshCollider geometry={nodes.RoomWalls.geometry} material={materials.Material} position={[12.5, 20, 1]} />
      <MeshCollider geometry={nodes.Straight001.geometry} material={materials.Material} position={[0, 21.5, 1]} />
      <MeshCollider geometry={nodes.Cube014.geometry} material={materials.Material} position={[-2.5, 4, 1]} />
      <MeshCollider geometry={nodes.Straight002.geometry} material={materials.Material} position={[-5.5, 4, 1]} />
      <MeshCollider geometry={nodes.Cube015.geometry} material={materials.Material} position={[-2.5, 8, 1]} />
      <MeshCollider geometry={nodes.Straight003.geometry} material={materials.Material} position={[-5.5, 8, 1]} />
      <MeshCollider geometry={nodes.Cube016.geometry} material={materials.Material} position={[-2.5, 12, 1]} />
      <MeshCollider geometry={nodes.Straight004.geometry} material={materials.Material} position={[-5.5, 12, 1]} />
      <MeshCollider geometry={nodes.Cube017.geometry} material={materials.Material} position={[-2.5, 16, 1]} />
      <MeshCollider geometry={nodes.Straight005.geometry} material={materials.Material} position={[-5.5, 16, 1]} />
      <MeshCollider geometry={nodes.Cube018.geometry} material={materials.Material} position={[14, 14.5, 1]} />
      <MeshCollider geometry={nodes.Straight006.geometry} material={materials.Material} position={[14, 17.5, 1]} />
      <MeshCollider geometry={nodes.Cube019.geometry} material={materials.Material} position={[14, 22.5, 1]} />
      <MeshCollider geometry={nodes.Straight007.geometry} material={materials.Material} position={[14, 25.5, 1]} />
      <MeshCollider geometry={nodes.Corner002.geometry} material={materials.Material} position={[19.5, 24, 1]} />
      <MeshCollider geometry={nodes.Cube021.geometry} material={materials.Material} position={[16.5, 25.5, 1]} />
      <MeshCollider geometry={nodes.Cube020.geometry} material={materials.Material} position={[18, 22.5, 1]} />
      <MeshCollider geometry={nodes.Corner003.geometry} material={materials.Material} position={[18, 17.5, 1]} />
      <MeshCollider geometry={nodes.Cube023.geometry} material={materials.Material} position={[19.5, 16, 1]} />
      <MeshCollider geometry={nodes.Cube022.geometry} material={materials.Material} position={[16.5, 14.5, 1]} />
      <MeshCollider geometry={nodes.Corner004.geometry} material={materials.Material} position={[47, 21.5, 1]} />
      <MeshCollider geometry={nodes.Cube024.geometry} material={materials.Material} position={[45.5, 23, 1]} />
      <MeshCollider geometry={nodes.Cube025.geometry} material={materials.Material} position={[48.5, 23, 1]} />
      <MeshCollider geometry={nodes.Corner005.geometry} material={materials.Material} position={[16.5, 28, 1]} />
      <MeshCollider geometry={nodes.Cube027.geometry} material={materials.Material} position={[18, 29.5, 1]} />
      <MeshCollider geometry={nodes.Cube026.geometry} material={materials.Material} position={[19.5, 26.5, 1]} />
      <MeshCollider geometry={nodes.Cube028.geometry} material={materials.Material} position={[22, 10.5, 1]} />
      <MeshCollider geometry={nodes.Straight008.geometry} material={materials.Material} position={[22, 13.5, 1]} />
      <MeshCollider geometry={nodes.Cube029.geometry} material={materials.Material} position={[22, 26.5, 1]} />
      <MeshCollider geometry={nodes.Straight009.geometry} material={materials.Material} position={[22, 29.5, 1]} />
      <MeshCollider geometry={nodes.Cube030.geometry} material={materials.Material} position={[26, 26.5, 1]} />
      <MeshCollider geometry={nodes.Straight010.geometry} material={materials.Material} position={[26, 29.5, 1]} />
      <MeshCollider geometry={nodes.Straight014.geometry} material={materials.Material} position={[28.5, 16, 1]} />
      <MeshCollider geometry={nodes.Straight013.geometry} material={materials.Material} position={[28.5, 20, 1]} />
      <MeshCollider geometry={nodes.Straight012.geometry} material={materials.Material} position={[28.5, 24, 1]} />
      <MeshCollider geometry={nodes.Cube035.geometry} material={materials.Material} position={[26, 10.5, 1]} />
      <MeshCollider geometry={nodes.Straight015.geometry} material={materials.Material} position={[26, 13.5, 1]} />
      <MeshCollider geometry={nodes.Corner006.geometry} material={materials.Material} position={[18, 10.5, 1]} />
      <MeshCollider geometry={nodes.Cube037.geometry} material={materials.Material} position={[19.5, 13.5, 1]} />
      <MeshCollider geometry={nodes.Cube036.geometry} material={materials.Material} position={[16.5, 12, 1]} />
      <MeshCollider geometry={nodes.Corner007.geometry} material={materials.Material} position={[31.5, 12, 1]} />
      <MeshCollider geometry={nodes.Cube039.geometry} material={materials.Material} position={[30, 10.5, 1]} />
      <MeshCollider geometry={nodes.Cube038.geometry} material={materials.Material} position={[28.5, 13.5, 1]} />
      <MeshCollider geometry={nodes.Cube044.geometry} material={materials.Material} position={[35, 25.5, 1]} />
      <MeshCollider geometry={nodes.Cube043.geometry} material={materials.Material} position={[35, 14.5, 1]} />
      <MeshCollider geometry={nodes.Cube042.geometry} material={materials.Material} position={[28.5, 24, 1]} />
      <MeshCollider geometry={nodes.Cube041.geometry} material={materials.Material} position={[28.5, 16, 1]} />
      <MeshCollider geometry={nodes.Cube046.geometry} material={materials.Material} position={[41, 18.5, 1]} />
      <MeshCollider geometry={nodes.Straight017.geometry} material={materials.Material} position={[41, 21.5, 1]} />
      <MeshCollider geometry={nodes.Cube047.geometry} material={materials.Material} position={[39.5, 16, 1]} />
      <MeshCollider geometry={nodes.Cube045.geometry} material={materials.Material} position={[39.5, 24, 1]} />
      <MeshCollider geometry={nodes.Corner008.geometry} material={materials.Material} position={[31.5, 12, 1]} />
      <MeshCollider geometry={nodes.Cube033.geometry} material={materials.Material} position={[28.5, 13.5, 1]} />
      <MeshCollider geometry={nodes.Cube032.geometry} material={materials.Material} position={[30, 10.5, 1]} />
      <MeshCollider geometry={nodes.Corner009.geometry} material={materials.Material} position={[31.5, 28, 1]} />
      <MeshCollider geometry={nodes.Cube034.geometry} material={materials.Material} position={[28.5, 26.5, 1]} />
      <MeshCollider geometry={nodes.Cube031.geometry} material={materials.Material} position={[30, 29.5, 1]} />
      <MeshCollider geometry={nodes.ExitBlocked.geometry} material={materials.Material} position={[30, 25.5, 1]} />
      <MeshCollider geometry={nodes.Cube040.geometry} material={materials.Material} position={[42.5, 23, 1]} />
      <MeshCollider geometry={nodes.Corner010.geometry} material={materials.Material} position={[42.5, 27, 1]} />
      <MeshCollider geometry={nodes.Cube049.geometry} material={materials.Material} position={[44, 28.5, 1]} />
      <MeshCollider geometry={nodes.Cube048.geometry} material={materials.Material} position={[45.5, 25.5, 1]} />
      <MeshCollider geometry={nodes.Corner011.geometry} material={materials.Material} position={[48.5, 27, 1]} />
      <MeshCollider geometry={nodes.Cube051.geometry} material={materials.Material} position={[45.5, 25.5, 1]} />
      <MeshCollider geometry={nodes.Cube050.geometry} material={materials.Material} position={[47, 28.5, 1]} />
      <MeshCollider geometry={nodes.Cube052.geometry} material={materials.Material} position={[45, 18.5, 1]} />
      <MeshCollider geometry={nodes.Cube053.geometry} material={materials.Material} position={[50, 24.5, 1]} />
      <MeshCollider geometry={nodes.Corner012.geometry} material={materials.Material} position={[49, 18.5, 1]} />
      <MeshCollider geometry={nodes.Cube054.geometry} material={materials.Material} position={[51.5, 20, 1]} />
      <MeshCollider geometry={nodes.Corner013.geometry} material={materials.Material} position={[48.5, 29, 1]} />
      <MeshCollider geometry={nodes.Cube055.geometry} material={materials.Material} position={[50, 30.5, 1]} />
      <MeshCollider geometry={nodes.Corner014.geometry} material={materials.Material} position={[51.5, 29, 1]} />
      <MeshCollider geometry={nodes.Corner015.geometry} material={materials.Material} position={[52, 18.5, 1]} />
      <MeshCollider geometry={nodes.Cube056.geometry} material={materials.Material} position={[54.5, 26, 1]} />
      <MeshCollider geometry={nodes.Cube057.geometry} material={materials.Material} position={[53, 27.5, 1]} />
      <MeshCollider geometry={nodes.Cube058.geometry} material={materials.Material} position={[54.5, 23, 1]} />
      <MeshCollider geometry={nodes.Cube059.geometry} material={materials.Material} position={[57.5, 21, 1]} />
      <MeshCollider geometry={nodes.Corner016.geometry} material={materials.Material} position={[56, 18.5, 1]} />
      <MeshCollider geometry={nodes.Cube060.geometry} material={materials.Material} position={[56, 30.5, 1]} />
      <MeshCollider geometry={nodes.Cube061.geometry} material={materials.Material} position={[57.5, 28, 1]} />
      <MeshCollider geometry={nodes.Cube062.geometry} material={materials.Material} position={[57.5, 25, 1]} />
      <MeshCollider geometry={nodes.Cube063.geometry} material={materials.Material} position={[57.5, 33, 1]} />
      <MeshCollider geometry={nodes.Cube064.geometry} material={materials.Material} position={[57.5, 35, 1]} />
      <MeshCollider geometry={nodes.Cube065.geometry} material={materials.Material} position={[53, 33.5, 1]} />
      <MeshCollider geometry={nodes.Cube066.geometry} material={materials.Material} position={[54.5, 35, 1]} />
      <MeshCollider geometry={nodes.Cube067.geometry} material={materials.Material} position={[56, 36.5, 1]} />
      <MeshCollider geometry={nodes.Corner017.geometry} material={materials.Material} position={[48.5, 35, 1]} />
      <MeshCollider geometry={nodes.Cube068.geometry} material={materials.Material} position={[50, 36.5, 1]} />
      <MeshCollider geometry={nodes.Cube069.geometry} material={materials.Material} position={[51.5, 38, 1]} />
      <MeshCollider geometry={nodes.Cube070.geometry} material={materials.Material} position={[53, 39.5, 1]} />
      <MeshCollider geometry={nodes.Cube071.geometry} material={materials.Material} position={[54.5, 38, 1]} />
      <MeshCollider geometry={nodes.Cube072.geometry} material={materials.Material} position={[47, 33.5, 1]} />
      <MeshCollider geometry={nodes.ExitBlocked001.geometry} material={materials.Material} position={[45.5, 32, 1]} />
      <MeshCollider geometry={nodes.Corner018.geometry} material={materials.Material} position={[42.5, 31, 1]} />
      <MeshCollider geometry={nodes.Corner019.geometry} material={materials.Material} position={[42.5, 35, 1]} />
      <MeshCollider geometry={nodes.Cube073.geometry} material={materials.Material} position={[51.5, 41, 1]} />
      <MeshCollider geometry={nodes.Cube074.geometry} material={materials.Material} position={[47, 39.5, 1]} />
      <MeshCollider geometry={nodes.Cube075.geometry} material={materials.Material} position={[50, 42.5, 1]} />
      <MeshCollider geometry={nodes.Cube076.geometry} material={materials.Material} position={[45.5, 41, 1]} />
      <MeshCollider geometry={nodes.Cube077.geometry} material={materials.Material} position={[51.5, 41, 1]} />
      <MeshCollider geometry={nodes.Cube078.geometry} material={materials.Material} position={[47, 42.5, 1]} />
      <MeshCollider geometry={nodes.Corner020.geometry} material={materials.Material} position={[42.5, 39, 1]} />
      <MeshCollider geometry={nodes.Corner021.geometry} material={materials.Material} position={[42.5, 43, 1]} />
      <MeshCollider geometry={nodes.Cube079.geometry} material={materials.Material} position={[45.5, 44, 1]} />
      <MeshCollider geometry={nodes.Corner022.geometry} material={materials.Material} position={[42.5, 46, 1]} />
      <MeshCollider geometry={nodes.Cube080.geometry} material={materials.Material} position={[44, 48.5, 1]} />
      <MeshCollider geometry={nodes.Cube081.geometry} material={materials.Material} position={[48.5, 47, 1]} />
      <MeshCollider geometry={nodes.Cube082.geometry} material={materials.Material} position={[47, 48.5, 1]} />
      <MeshCollider geometry={nodes.Cube083.geometry} material={materials.Material} position={[50, 45.5, 1]} />
      <MeshCollider geometry={nodes.Cube084.geometry} material={materials.Material} position={[50, 48.5, 1]} />
      <MeshCollider geometry={nodes.Cube085.geometry} material={materials.Material} position={[53, 48.5, 1]} />
      <MeshCollider geometry={nodes.Cube086.geometry} material={materials.Material} position={[54.5, 44, 1]} />
      <MeshCollider geometry={nodes.Cube087.geometry} material={materials.Material} position={[54.5, 47, 1]} />
      <MeshCollider geometry={nodes.Cube088.geometry} material={materials.Material} position={[57.5, 39, 1]} />
      <MeshCollider geometry={nodes.Cube089.geometry} material={materials.Material} position={[57.5, 43, 1]} />
      <MeshCollider geometry={nodes.Cube090.geometry} material={materials.Material} position={[57.5, 44, 1]} />
      <MeshCollider geometry={nodes.Cube092.geometry} material={materials.Material} position={[56, 48.5, 1]} />
      <MeshCollider geometry={nodes.Cube093.geometry} material={materials.Material} position={[57.5, 51, 1]} />
      <MeshCollider geometry={nodes.Cube094.geometry} material={materials.Material} position={[57.5, 43, 1]} />
      <MeshCollider geometry={nodes.Cube095.geometry} material={materials.Material} position={[69.5, 47, 1]} />
      <MeshCollider geometry={nodes.Cube096.geometry} material={materials.Material} position={[63, 41.5, 1]} />
      <MeshCollider geometry={nodes.Cube091.geometry} material={materials.Material} position={[68, 52.5, 1]} />
      <MeshCollider geometry={nodes.Cube097.geometry} material={materials.Material} position={[60, 52.5, 1]} />
      <MeshCollider geometry={nodes.Cube098.geometry} material={materials.Material} position={[65.5, 54, 1]} />
      <MeshCollider geometry={nodes.Cube099.geometry} material={materials.Material} position={[62.5, 54, 1]} />
      <MeshCollider geometry={nodes.Cube102.geometry} material={materials.Material} position={[64, 58.5, 1]} />
      <MeshCollider geometry={nodes.Cube103.geometry} material={materials.Material} position={[62.5, 57, 1]} />
      <MeshCollider geometry={nodes.Cube104.geometry} material={materials.Material} position={[79, 58.5, 1]} />
      <MeshCollider geometry={nodes.Cube105.geometry} material={materials.Material} position={[79, 55.5, 1]} />
      <MeshCollider geometry={nodes.Cube100.geometry} material={materials.Material} position={[75, 58.5, 1]} />
      <MeshCollider geometry={nodes.Cube101.geometry} material={materials.Material} position={[75, 55.5, 1]} />
      <MeshCollider geometry={nodes.Cube106.geometry} material={materials.Material} position={[71, 58.5, 1]} />
      <MeshCollider geometry={nodes.Cube107.geometry} material={materials.Material} position={[71, 55.5, 1]} />
      <MeshCollider geometry={nodes.Cube108.geometry} material={materials.Material} position={[67, 58.5, 1]} />
      <MeshCollider geometry={nodes.Cube109.geometry} material={materials.Material} position={[67, 55.5, 1]} />
      <MeshCollider geometry={nodes.Cube110.geometry} material={materials.Material} position={[83, 58.5, 1]} />
      <MeshCollider geometry={nodes.Cube111.geometry} material={materials.Material} position={[83, 55.5, 1]} />
      <MeshCollider geometry={nodes.Cube117.geometry} material={materials.Material} position={[85.5, 49.5, 1]} />
      <MeshCollider geometry={nodes.Cube126.geometry} material={materials.Material} position={[98.5, 49.5, 1]} />
      <MeshCollider geometry={nodes.Cube136.geometry} material={materials.Material} position={[85.5, 64.5, 1]} />
      <MeshCollider geometry={nodes.Cube138.geometry} material={materials.Material} position={[98.5, 64.5, 1]} />
    </group>
  )
}

useGLTF.preload('models/early-game.glb')
