<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Cursor,
  CursorContainer,
  CursorFollow,
  CursorProvider,
} from '@animate-ui/vue/primitives/cursor'
import { useUiStore } from '@/stores/uiStore'
import type { TextFormatStyle } from '@/types/portfolio'

const uiStore = useUiStore()
const hasPhotoError = ref(false)

const styleOptions: { value: TextFormatStyle; label: string; short: string }[] = [
  { value: 'normal', label: 'Normal', short: 'N' },
  { value: 'bold', label: 'Bold', short: 'B' },
  { value: 'italic', label: 'Italic', short: 'I' },
]

const bioTypographyClass = computed(() => {
  if (uiStore.aboutTextStyle === 'bold') {
    return 'font-sans font-semibold text-[#090E1E]'
  }
  if (uiStore.aboutTextStyle === 'italic') {
    return 'font-serif italic font-normal text-[#2454E8] text-xl sm:text-2xl leading-relaxed'
  }
  return 'font-sans font-normal text-slate-700'
})

const highlights = [
  { label: 'Focus', value: 'UI/UX, Front-End & PM' },
  { label: 'Education', value: 'Informatics · 3.94 GPA' },
  { label: 'Recognition', value: '4x National UI/UX Finalist' },
  { label: 'Location', value: 'Karawang, Indonesia' },
]
</script>

<template>
  <section id="about" class="w-full bg-white px-6 py-12 sm:px-8 sm:py-20">
    <div class="mx-auto max-w-5xl">
      <div class="relative rounded-[2rem] border border-slate-200/85 bg-[#FAFBFD] overflow-hidden">
        <CursorProvider>
          <CursorContainer class="p-7 sm:p-12 md:p-14">
            <!-- Custom Precision Arrow Cursor -->
            <Cursor>
              <svg
                class="size-5 text-[#2454E8] drop-shadow-sm"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 3.5L19.5 10.5L12.5 13L10 20L4.5 3.5Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
            </Cursor>

            <!-- Trailing Role Pill -->
            <CursorFollow side="bottom" align="end" :side-offset="10" :align-offset="10">
              <span
                class="inline-flex items-center rounded-full bg-[#090E1E] px-3 py-1 text-xs font-medium text-white shadow-md whitespace-nowrap"
              >
                Auf · Designer
              </span>
            </CursorFollow>

            <!-- Top Bar: Section Label + Live Typography ToggleGroup -->
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200/80"
            >
              <div>
                <p class="text-xs sm:text-sm font-medium tracking-wide text-[#2454E8]">About Me</p>
                <h3 class="mt-1 text-2xl sm:text-3xl font-medium tracking-tight text-[#090E1E]">
                  Design rigor,
                  <span class="font-serif italic font-normal text-[#2454E8]">
                    engineering discipline.
                  </span>
                </h3>
              </div>

              <!-- Interactive Text Style Switcher (N / B / I) -->
              <div
                role="group"
                aria-label="Bio typography style"
                class="inline-flex items-center self-start sm:self-auto rounded-full bg-white border border-slate-200/90 p-1 shadow-xs"
              >
                <button
                  v-for="option in styleOptions"
                  :key="option.value"
                  type="button"
                  :aria-pressed="uiStore.aboutTextStyle === option.value"
                  :title="`Switch bio to ${option.label}`"
                  @click="uiStore.setAboutTextStyle(option.value)"
                  :class="[
                    'h-8 min-w-9 px-3 rounded-full text-xs transition-all cursor-pointer',
                    option.value === 'bold' ? 'font-bold' : '',
                    option.value === 'italic' ? 'font-serif italic text-sm' : 'font-medium',
                    uiStore.aboutTextStyle === option.value
                      ? 'bg-[#090E1E] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#2454E8]',
                  ]"
                >
                  {{ option.short }}
                </button>
              </div>
            </div>

            <!-- Main Content Grid: Portrait Photo + Bio & Quick Facts -->
            <div class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <!-- Left Column: Portrait Photo -->
              <div class="lg:col-span-4">
                <div
                  class="relative aspect-[4/5] w-full max-w-[280px] lg:max-w-none mx-auto overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs"
                >
                  <img
                    v-if="!hasPhotoError"
                    src="/images/auf-profile.jpg"
                    alt="Auf Fajri Ramadhani"
                    @error="hasPhotoError = true"
                    class="h-full w-full object-cover object-top"
                  />
                  <div
                    v-else
                    class="flex h-full w-full flex-col items-center justify-center bg-slate-100/80 px-6 text-center text-slate-400"
                  >
                    <span class="text-sm font-medium text-slate-500">Photo Placeholder</span>
                    <span class="mt-1 text-xs">Put file at public/images/auf-profile.jpg</span>
                  </div>
                </div>
              </div>

              <!-- Right Column: Interactive Bio Copy + 2x2 Quick Facts -->
              <div class="lg:col-span-8 flex flex-col justify-between gap-8">
                <div class="space-y-4">
                  <p
                    :class="[
                      'text-base sm:text-lg leading-relaxed transition-all duration-200',
                      bioTypographyClass,
                    ]"
                  >
                    I am Auf Fajri Ramadhani, an Informatics student focused on building digital
                    products that feel intuitive on the surface and dependable underneath.
                  </p>
                  <p
                    :class="[
                      'text-base sm:text-lg leading-relaxed transition-all duration-200',
                      bioTypographyClass,
                    ]"
                  >
                    From conducting usability testing for dementia care and civic safety platforms
                    to shipping Vue, TypeScript, and Laravel web applications, I care deeply about
                    clarity, measurable impact, and clean execution.
                  </p>
                </div>

                <!-- Structured Quick Facts -->
                <dl class="grid grid-cols-2 gap-3.5 sm:gap-4">
                  <div
                    v-for="item in highlights"
                    :key="item.label"
                    class="rounded-2xl bg-white border border-slate-200/75 p-4"
                  >
                    <dt class="text-xs font-normal text-slate-500">
                      {{ item.label }}
                    </dt>
                    <dd class="mt-1 text-sm font-medium text-[#090E1E] leading-snug">
                      {{ item.value }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </CursorContainer>
        </CursorProvider>
      </div>
    </div>
  </section>
</template>
