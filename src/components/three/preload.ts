import { useGLTF } from '@react-three/drei'

export default function preloadAssets(): void {
  useGLTF.preload('models/fountain.glb')
}
