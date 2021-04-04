export const squeaks = [
  new Audio('sounds/squeak-1.mp3'),
  new Audio('sounds/squeak-2.mp3'),
  new Audio('sounds/squeak-3.mp3'),
  new Audio('sounds/squeak-4.mp3'),
  new Audio('sounds/squeak-5.mp3'),
  new Audio('sounds/squeak-6.mp3'),
]

export function playSqueak() {
  const randomSqueak = squeaks[Math.floor(Math.random() * squeaks.length)]
  randomSqueak.currentTime = 0
  randomSqueak.volume = .5
  randomSqueak.play()
}