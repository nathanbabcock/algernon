import React from 'react';
import MazeDeadEnd from '../maze-pieces/MazeDeadEnd';
import { Text } from '@react-three/drei'

export default function NoFuture(props: any) {
  return <group {...props}>
    <MazeDeadEnd segment={props.segment}/>
    <Text
      color="black"
      position={[0, 0.999, 1]}
      rotation={[Math.PI/2, 0, 0]}
      font="fonts/empires.otf"
      fontSize={0.5}
    >
      {`No\nFuture`}
    </Text>
  </group>
};


