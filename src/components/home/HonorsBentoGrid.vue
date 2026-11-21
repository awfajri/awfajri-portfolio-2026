<script setup lang="ts">
import { motion } from 'motion-v'
import { HugeiconsIcon } from '@hugeicons/vue'
import { Award01Icon, Layers01Icon, CodeIcon, SparklesIcon } from '@hugeicons/core-free-icons'
import { usePortfolioStore } from '@/stores/portfolioStore'

const portfolioStore = usePortfolioStore()

const experiences = [
  {
    role: 'PDD Division Coordinator',
    org: 'Dies Natalis HIMTIKA VIII (Kabinet Sinergis)',
    period: '2025',
    detail: 'Led event branding, mascot, and Instagram campaigns reaching 10,000+ accounts.',
  },
  {
    role: 'Accounting Intern',
    org: 'PT. Advic Manufacturing Indonesia',
    period: '2023',
    detail: 'Recorded cash payment journals and structured audit documentation.',
  },
  {
    role: 'Sales & Digital Marketing Intern',
    org: 'PT. Wahana Internet Nusantara',
    period: '2023',
    detail: 'Generated 30+ customer leads and produced 20+ educational social assets.',
  },
]

const capabilities = [
  {
    title: 'Product & UX Design',
    icon: SparklesIcon,
    items: [
      'User Research & Usability Testing',
      'Token-Based Design Systems',
      'Figma Prototyping & Microcopy',
    ],
  },
  {
    title: 'Front-End & Systems',
    icon: CodeIcon,
    items: [
      'Vue 3, TypeScript & Tailwind CSS',
      'Laravel, MySQL & REST APIs',
      'Firebase, Supabase & Linux',
    ],
  },
  {
    title: 'Product Leadership',
    icon: Layers01Icon,
    items: [
      'PR Review & GitFlow Discipline',
      'Stakeholder & B2G Alignment',
      'Competition Strategy & Pitching',
    ],
  },
]
</script>

<template>
  <section id="honors" class="w-full bg-white px-6 py-20 sm:px-8 sm:py-28">
    <div class="mx-auto max-w-5xl">
      <!-- Section Header -->
      <div class="pb-10 border-b border-slate-200/80">
        <p class="text-xs sm:text-sm font-medium tracking-wide text-[#2454E8]">
          Honors & Experience
        </p>
        <h2 class="mt-2 text-3xl sm:text-4xl font-medium tracking-tight text-[#090E1E]">
          Recognized work,
          <span class="font-serif italic font-normal text-[#2454E8]"> proven in the field. </span>
        </h2>
      </div>

      <!-- Asymmetric Bento Grid -->
      <div class="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Bento Card 1: National UI/UX Honors (7 cols) -->
        <motion.div
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.15 }"
          :transition="{ duration: 0.4 }"
          class="lg:col-span-7 rounded-[1.75rem] border border-slate-200/85 bg-[#FAFBFD] p-6 sm:p-8 flex flex-col justify-between"
        >
          <div class="flex items-center justify-between gap-4 pb-5 border-b border-slate-200/75">
            <div>
              <h3 class="text-lg sm:text-xl font-medium text-[#090E1E]">National Competitions</h3>
              <p class="mt-0.5 text-xs sm:text-sm text-slate-500">
                4x National UI/UX Finalist across Indonesian universities.
              </p>
            </div>
            <span
              class="inline-flex size-10 items-center justify-center rounded-full bg-[#EEF3FF] text-[#2454E8] shrink-0"
            >
              <HugeiconsIcon :icon="Award01Icon" class="size-5" />
            </span>
          </div>

          <ul class="mt-5 divide-y divide-slate-200/70">
            <li
              v-for="honor in portfolioStore.honors"
              :key="honor.id"
              class="py-4 first:pt-1 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-sm sm:text-base font-medium text-[#090E1E]">
                    {{ honor.title }}
                  </span>
                  <span
                    class="rounded-full bg-white border border-blue-100 px-2.5 py-0.5 text-[11px] font-medium text-[#2454E8]"
                  >
                    {{ honor.highlightBadge }}
                  </span>
                </div>
                <p class="mt-0.5 text-xs sm:text-sm text-slate-500">
                  {{ honor.organizer }}
                </p>
              </div>

              <span class="text-xs font-medium text-slate-400 tabular-nums shrink-0">
                {{ honor.year }}
              </span>
            </li>
          </ul>
        </motion.div>

        <!-- Bento Card 2: Leadership & Internships (5 cols) -->
        <motion.div
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.15 }"
          :transition="{ duration: 0.4, delay: 0.08 }"
          class="lg:col-span-5 rounded-[1.75rem] border border-slate-200/85 bg-[#FAFBFD] p-6 sm:p-8 flex flex-col justify-between"
        >
          <div>
            <div class="pb-5 border-b border-slate-200/75">
              <h3 class="text-lg sm:text-xl font-medium text-[#090E1E]">Experience & Roles</h3>
              <p class="mt-0.5 text-xs sm:text-sm text-slate-500">
                Organization leadership and industry internships.
              </p>
            </div>

            <div class="mt-5 space-y-5">
              <div
                v-for="exp in experiences"
                :key="exp.role"
                class="relative pl-4 border-l-2 border-slate-200"
              >
                <div class="flex items-center justify-between gap-2">
                  <h4 class="text-sm font-medium text-[#090E1E]">
                    {{ exp.role }}
                  </h4>
                  <span class="text-[11px] font-medium text-slate-400 tabular-nums">
                    {{ exp.period }}
                  </span>
                </div>
                <p class="text-xs font-medium text-[#2454E8] mt-0.5">
                  {{ exp.org }}
                </p>
                <p class="mt-1 text-xs text-slate-500 leading-relaxed">
                  {{ exp.detail }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="mt-6 pt-4 border-t border-slate-200/75 flex items-center justify-between text-xs"
          >
            <span class="text-slate-500">Certification</span>
            <span class="font-medium text-[#090E1E]">Google Cloud Computing Foundations</span>
          </div>
        </motion.div>

        <!-- Bento Card 3: Core Capabilities (Full 12 cols) -->
        <motion.div
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.15 }"
          :transition="{ duration: 0.4, delay: 0.12 }"
          class="lg:col-span-12 rounded-[1.75rem] border border-slate-200/85 bg-[#FAFBFD] p-6 sm:p-8"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div v-for="cap in capabilities" :key="cap.title" class="flex flex-col">
              <div class="flex items-center gap-2.5 mb-3">
                <span
                  class="inline-flex size-8 items-center justify-center rounded-full bg-white border border-slate-200/80 text-[#2454E8]"
                >
                  <HugeiconsIcon :icon="cap.icon" class="size-4" />
                </span>
                <h3 class="text-base font-medium text-[#090E1E]">
                  {{ cap.title }}
                </h3>
              </div>

              <ul class="space-y-1.5 text-sm text-slate-600">
                <li v-for="point in cap.items" :key="point">
                  {{ point }}
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
</template>
