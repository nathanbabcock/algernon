import { squeak1, squeak2, squeak3, squeak4, squeak5, squeak6 } from './sound'

export const squeaks = [
  squeak1,
  squeak2,
  squeak3,
  squeak4,
  squeak5,
  squeak6,
]

export function playSqueak() {
  const randomSqueak = squeaks[Math.floor(Math.random() * squeaks.length)]
  randomSqueak.currentTime = 0
  randomSqueak.volume = .5
  randomSqueak.play()
}