import React from 'react';
import MazeDeadEnd from '../maze-pieces/MazeDeadEnd';
import { Text } from '@react-three/drei'

export default function NoPast(props: any) {
  return <group>
    <MazeDeadEnd segment={props.segment} rotation={props.rotation} position={props.position}/>
    <group position={props.position} rotation={props.rotation}>
      <Text
        color="black"
        position={[0, 0.999, 1]}
        rotation={[Math.PI/2, 0, 0]}
        font="fonts/empires.otf"
        fontSize={0.5}
      >
        {`No\nPast`}
      </Text>
    </group>
  </group>
};


