export default function locationDiscovered(mainText: string, subText: string) {
  const discoveredUI = document.getElementById('discovered-ui')
  if (!discoveredUI) return
  console.log(mainText)
  discoveredUI.querySelector('.main-text')!.innerHTML = mainText
  discoveredUI.querySelector('.sub-text')!.innerHTML = subText
  discoveredUI.classList.add('visible')
  new Audio('sounds/location-discovered.wav').play()
  setTimeout(() => discoveredUI.classList.remove('visible'), 5000)
}