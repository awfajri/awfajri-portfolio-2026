import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RoleLensMode, TextFormatStyle } from '@/types/portfolio'

export const useUiStore = defineStore('ui', () => {
  const roleLens = ref<RoleLensMode>('all')
  const isXRayActive = ref<boolean>(false)
  const isCommandOpen = ref<boolean>(false)
  const animationTempo = ref<number>(0.9)
  const aboutTextStyle = ref<TextFormatStyle>('normal')

  function setRoleLens(mode: RoleLensMode) {
    roleLens.value = mode
  }

  function toggleXRay() {
    isXRayActive.value = !isXRayActive.value
  }

  function setCommandOpen(open: boolean) {
    isCommandOpen.value = open
  }

  function setAnimationTempo(tempo: number) {
    animationTempo.value = tempo
  }

  function setAboutTextStyle(style: TextFormatStyle) {
    aboutTextStyle.value = style
  }

  return {
    roleLens,
    isXRayActive,
    isCommandOpen,
    animationTempo,
    aboutTextStyle,
    setRoleLens,
    toggleXRay,
    setCommandOpen,
    setAnimationTempo,
    setAboutTextStyle,
  }
})
