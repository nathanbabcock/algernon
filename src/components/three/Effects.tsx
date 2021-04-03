import React, { useRef, useEffect } from 'react'
import { extend, useThree, useFrame } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'
import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'

extend({ EffectComposer, ShaderPass, RenderPass, UnrealBloomPass, FilmPass, SSAOPass, SMAAPass, BokehPass, GlitchPass, AdaptiveToneMappingPass, BloomPass })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      unrealBloomPass: any,
      bloomPass: any,
      sSAOPass: any,
      sMAAPass: any,
      bokehPass: any,
      glitchPass: any,
      filmPass: any,
      adaptiveToneMappingPass: any,
    }
  }
}

export default function Effects() {
  const composer = useRef<EffectComposer>()
  const { scene, gl, size, camera } = useThree()
  useEffect(() => void composer.current!.setSize(size.width, size.height), [size])
  useFrame(() => composer.current!.render(), 2)
  
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      {/* <unrealBloomPass attachArray="passes" args={[undefined, 0.2, 0.5, 0]} /> */}
      {/* <sSAOPass attachArray="passes" args={[scene, camera, size.width, size.height]} /> */}
      {/* <sMAAPass attachArray="passes" args={[size.width, size.height]} /> */}
      {/* <bokehPass attachArray="passes" args={[scene, camera, { maxblur: 0.01, focus: 2 }]} /> */}
    </effectComposer>
  )
}
