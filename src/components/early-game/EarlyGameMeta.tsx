import React from 'react'
import EarlyGame from './EarlyGame'

/**
 * Holds the entire scripted early game sequence,
 * plus the 11 possible transition paths towards the Flower Room
 * and into the MiddleGame infinite open world maze
 * @param props 
 * @returns 
 */
export default function EarlyGameMeta(props: any) {
  return <>
    <EarlyGame />
  </>
}
