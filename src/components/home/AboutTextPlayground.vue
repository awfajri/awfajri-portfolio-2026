<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useUiStore } from '@/stores/uiStore'
import { useDriveAsset } from '@/composables/useDriveAsset'
import type { TextFormatStyle } from '@/types/portfolio'

type BioSegment = { type: 'text'; value: string } | { type: 'badge'; src: string; alt: string }

const portfolioStore = usePortfolioStore()
const uiStore = useUiStore()
const { getDriveImageUrl } = useDriveAsset()

const styleButtons: { label: string; value: TextFormatStyle; className: string }[] = [
  { label: 'N', value: 'normal', className: 'font-normal' },
  { label: 'B', value: 'bold', className: 'font-semibold' },
  { label: 'I', value: 'italic', className: 'font-serif italic' },
]

const INLINE_BADGES: Record<string, { src: string; alt: string }> = {
  designer: { src: '/images/badge-designer.svg', alt: 'Designer' },
  animator: { src: '/images/badge-animator.svg', alt: 'Animator' },
  illustrator: { src: '/images/badge-illustrator.svg', alt: 'Illustrator' },
  '3d': { src: '/images/badge-3d-artist.svg', alt: 'Systems & 3D' },
}

function parseBioSegments(text: string): BioSegment[] {
  if (!text) return []
  const regex = /\[(designer|animator|illustrator|3d)\]/gi
  const segments: BioSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }
    const key = (match[1] || '').toLowerCase()
    const badge = INLINE_BADGES[key]
    if (badge) {
      segments.push({ type: 'badge', src: badge.src, alt: badge.alt })
    }
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return segments
}

const bioStyleClass = computed(() => {
  if (uiStore.aboutTextStyle === 'bold') return 'font-semibold text-[#090E1E]'
  if (uiStore.aboutTextStyle === 'italic') return 'font-serif italic text-slate-700'
  return 'font-normal text-slate-600'
})

const profileImageSrc = computed(() => {
  const raw = portfolioStore.siteSettings.profilePhotoDriveUrl?.trim()
  if (!raw) return '/images/auf-profile.jpg'
  return raw.startsWith('http') ? getDriveImageUrl(raw) : raw
})
</script>

<template>
  <section id="about" class="w-full bg-white px-6 py-20 sm:px-8 sm:py-28">
    <div class="mx-auto max-w-5xl">
      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.15 }"
        :transition="{ duration: 0.4 }"
        class="rounded-[2rem] border border-slate-200/85 bg-[#FAFBFD] p-6 sm:p-10"
      >
        <!-- Header & N / B / I Playground Controls -->
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200/75"
        >
          <div>
            <p class="text-xs sm:text-sm font-medium tracking-wide text-[#2454E8]">About Me</p>
            <h2 class="mt-1.5 text-2xl sm:text-3xl font-medium tracking-tight text-[#090E1E]">
              Design rigor,
              <span class="font-serif italic font-normal text-[#2454E8]">
                engineering discipline.
              </span>
            </h2>
          </div>

          <div
            role="group"
            aria-label="Bio typography style"
            class="inline-flex items-center self-start sm:self-auto rounded-full bg-white border border-slate-200/90 p-1"
          >
            <button
              v-for="btn in styleButtons"
              :key="btn.value"
              type="button"
              :aria-pressed="uiStore.aboutTextStyle === btn.value"
              @click="uiStore.setAboutTextStyle(btn.value)"
              :class="[
                'inline-flex size-8 items-center justify-center rounded-full text-xs transition-colors cursor-pointer',
                btn.className,
                uiStore.aboutTextStyle === btn.value
                  ? 'bg-[#090E1E] text-white'
                  : 'text-slate-500 hover:text-[#2454E8]',
              ]"
            >
              {{ btn.label }}
            </button>
          </div>
        </div>

        <!-- Photo & Bio Paragraphs -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div class="md:col-span-4">
            <div
              class="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-slate-100 aspect-[4/5]"
            >
              <img
                :src="profileImageSrc"
                alt="Auf Fajri Ramadhani"
                loading="lazy"
                class="h-full w-full object-cover"
              />
            </div>
          </div>

          <div class="md:col-span-8 flex flex-col justify-between gap-8">
            <div
              :class="[
                'space-y-4 text-base sm:text-lg leading-relaxed transition-all',
                bioStyleClass,
              ]"
            >
              <p v-if="portfolioStore.siteSettings.aboutBioParagraph1">
                <template
                  v-for="(seg, i) in parseBioSegments(
                    portfolioStore.siteSettings.aboutBioParagraph1,
                  )"
                  :key="`p1-${i}`"
                >
                  <img
                    v-if="seg.type === 'badge'"
                    :src="seg.src"
                    :alt="seg.alt"
                    :title="seg.alt"
                    class="inline-block size-5 sm:size-6 align-text-bottom mx-1 object-contain"
                  />
                  <template v-else>{{ seg.value }}</template>
                </template>
              </p>

              <p v-if="portfolioStore.siteSettings.aboutBioParagraph2">
                <template
                  v-for="(seg, i) in parseBioSegments(
                    portfolioStore.siteSettings.aboutBioParagraph2,
                  )"
                  :key="`p2-${i}`"
                >
                  <img
                    v-if="seg.type === 'badge'"
                    :src="seg.src"
                    :alt="seg.alt"
                    :title="seg.alt"
                    class="inline-block size-5 sm:size-6 align-text-bottom mx-1 object-contain"
                  />
                  <template v-else>{{ seg.value }}</template>
                </template>
              </p>
            </div>

            <!-- Quick Facts Cards -->
            <div
              v-if="portfolioStore.siteSettings.aboutHighlights.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-slate-200/75"
            >
              <div
                v-for="(item, idx) in portfolioStore.siteSettings.aboutHighlights"
                :key="idx"
                class="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5"
              >
                <p class="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  {{ item.label }}
                </p>
                <p class="mt-1 text-sm font-medium text-[#090E1E]">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
</template>
