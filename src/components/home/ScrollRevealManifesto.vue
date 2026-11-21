<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface WordToken {
  text: string
  isAccent?: boolean
}

const manifestoWords: WordToken[] = [
  { text: 'Good' },
  { text: 'products' },
  { text: 'start' },
  { text: 'with' },
  { text: 'clear' },
  { text: 'research,', isAccent: true },
  { text: 'not' },
  { text: 'guesswork.' },
  { text: 'I' },
  { text: 'bridge' },
  { text: 'interface' },
  { text: 'craft', isAccent: true },
  { text: 'and' },
  { text: 'front-end' },
  { text: 'engineering', isAccent: true },
  { text: 'so' },
  { text: 'every' },
  { text: 'design' },
  { text: 'decision' },
  { text: 'ships' },
  { text: 'cleanly' },
  { text: 'to' },
  { text: 'real' },
  { text: 'users.' },
]

const sectionRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)

function updateProgress() {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  const start = viewportHeight * 0.82
  const end = viewportHeight * 0.25
  const raw = (start - rect.top) / (start - end)
  scrollProgress.value = Math.min(1, Math.max(0, raw))
}

function getWordOpacity(index: number): number {
  const total = manifestoWords.length
  const wordStart = index / total
  const wordEnd = (index + 1) / total
  const localProgress = (scrollProgress.value - wordStart) / (wordEnd - wordStart)
  const clamped = Math.min(1, Math.max(0, localProgress))
  return 0.16 + clamped * 0.84
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})
</script>

<template>
  <section id="manifesto" ref="sectionRef" class="w-full bg-white px-6 py-24 sm:px-8 sm:py-32">
    <div class="mx-auto max-w-4xl">
      <p class="text-xs sm:text-sm font-medium tracking-wide text-[#2454E8] mb-6">
        Design Philosophy
      </p>

      <h2
        class="text-3xl sm:text-4xl md:text-[46px] font-medium tracking-tight leading-[1.22] text-[#090E1E] flex flex-wrap gap-x-[0.28em] gap-y-1.5"
      >
        <span
          v-for="(word, index) in manifestoWords"
          :key="index"
          :style="{ opacity: getWordOpacity(index) }"
          :class="[
            'transition-opacity duration-150 will-change-[opacity]',
            word.isAccent
              ? 'font-serif italic font-normal text-[#2454E8]'
              : 'font-sans font-medium text-[#090E1E]',
          ]"
        >
          {{ word.text }}
        </span>
      </h2>
    </div>
  </section>
</template>
