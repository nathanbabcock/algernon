import { Sphere } from '@react-three/drei';
import React from 'react';
import { BackSide, Color } from 'three';

const vertexShader = `
varying vec3 vWorldPosition;

void main() {

  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}`

const fragmentShader = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {

  float h = normalize( vWorldPosition + offset ).z;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

}`

const uniforms = {
  "topColor": { value: new Color( 0x0077ff ) },
  "bottomColor": { value: new Color( 0xffffff ) },
  "offset": { value: 33 },
  "exponent": { value: 0.6 },
}

export default function Skydome(props: any) {
  return (
    <Sphere args={[1000]}>
      {/* <meshBasicMaterial attach="material" color={new Color(0x479eff)} side={BackSide}/> */}
      <shaderMaterial
        attach="material"
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        side={BackSide}
      />
    </Sphere>
  )
}