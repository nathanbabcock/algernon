import React from 'react';
import NoFuture from '../no-future-no-past/NoFuture';
import NoPast from '../no-future-no-past/NoPast';
import MazeCorner from './MazeCorner';
import MazeDeadEnd from './MazeDeadEnd';
import MazeStraight from './MazeStraight';

export default function getSegmentComponent(type: string): React.FC<any> {
  switch (type) {
    case 'straight': default: return MazeStraight
    case 'corner': return MazeCorner
    case 'dead-end': return MazeDeadEnd
    case 'no-future': return NoFuture
    case 'no-past': return NoPast
  }
};
