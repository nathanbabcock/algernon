import { useRef, useEffect } from 'react'
import { useThree, useFrame } from 'react-three-fiber'
import { PerspectiveCamera } from 'three'

export default function Camera(props: any) {
  const ref = useRef<PerspectiveCamera>()
  const { setDefaultCamera } = useThree()
  useEffect(() => void setDefaultCamera(ref.current!))
  useFrame(() => ref.current?.updateMatrixWorld())
  return <perspectiveCamera ref={ref} {...props} />
}