import { locationDiscovered } from '../../helpers/sound'

export default function showLocationDiscoveredUI(mainText: string, subText: string) {
  const discoveredUI = document.getElementById('discovered-ui')
  if (!discoveredUI) return
  console.log(mainText)
  discoveredUI.querySelector('.main-text')!.innerHTML = mainText
  discoveredUI.querySelector('.sub-text')!.innerHTML = subText
  discoveredUI.classList.add('visible')
  locationDiscovered.play()
  setTimeout(() => discoveredUI.classList.remove('visible'), 5000)
}