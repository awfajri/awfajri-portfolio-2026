<script setup lang="ts">
import { motion } from 'motion-v'
import { HugeiconsIcon } from '@hugeicons/vue'
import { Award01Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { usePortfolioStore } from '@/stores/portfolioStore'

const portfolioStore = usePortfolioStore()

const defaultCapabilityBadges = [
  '/images/badge-designer.svg',
  '/images/badge-3d-artist.svg',
  '/images/badge-illustrator.svg',
  '/images/badge-animator.svg',
]
</script>

<template>
  <section id="honors" class="w-full bg-white px-6 py-20 sm:px-8 sm:py-28">
    <div class="mx-auto max-w-5xl">
      <div class="pb-10 border-b border-slate-200/80">
        <p class="text-xs sm:text-sm font-medium tracking-wide text-[#2454E8]">
          Honors & Certifications
        </p>
        <h2 class="mt-2 text-3xl sm:text-4xl font-medium tracking-tight text-[#090E1E]">
          Recognized work,
          <span class="font-serif italic font-normal text-[#2454E8]"> verified credentials. </span>
        </h2>
      </div>

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
                National UI/UX recognitions across Indonesian universities.
              </p>
            </div>
            <span
              class="inline-flex size-10 items-center justify-center rounded-full bg-[#EEF3FF] text-[#2454E8] shrink-0"
            >
              <HugeiconsIcon :icon="Award01Icon" class="size-5" />
            </span>
          </div>

          <ul v-if="portfolioStore.honors.length > 0" class="mt-5 divide-y divide-slate-200/70">
            <li
              v-for="honor in portfolioStore.honors"
              :key="honor.id"
              class="py-4 first:pt-1 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div class="flex items-start gap-3">
                <img
                  v-if="honor.medalSvg"
                  :src="honor.medalSvg"
                  :alt="honor.highlightBadge"
                  class="size-8 object-contain shrink-0 mt-0.5"
                />
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
              </div>

              <span class="text-xs font-medium text-slate-400 tabular-nums shrink-0">
                {{ honor.year }}
              </span>
            </li>
          </ul>

          <p v-else class="mt-6 text-xs text-slate-500">No honors added yet.</p>
        </motion.div>

        <!-- Bento Card 2: Dynamic Certifications (5 cols) -->
        <motion.div
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.15 }"
          :transition="{ duration: 0.4, delay: 0.08 }"
          class="lg:col-span-5 rounded-[1.75rem] border border-slate-200/85 bg-[#FAFBFD] p-6 sm:p-8 flex flex-col"
        >
          <div class="pb-5 border-b border-slate-200/75">
            <h3 class="text-lg sm:text-xl font-medium text-[#090E1E]">Certifications</h3>
            <p class="mt-0.5 text-xs sm:text-sm text-slate-500">
              Verified credentials and technical foundations.
            </p>
          </div>

          <ul
            v-if="portfolioStore.certificates.length > 0"
            class="mt-5 divide-y divide-slate-200/70"
          >
            <li
              v-for="cert in portfolioStore.certificates"
              :key="cert.id"
              class="py-4 first:pt-1 last:pb-0"
            >
              <a
                v-if="cert.credentialUrl"
                :href="cert.credentialUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-start justify-between gap-3"
              >
                <div class="min-w-0">
                  <p
                    class="text-sm font-medium text-[#090E1E] group-hover:text-[#2454E8] transition-colors"
                  >
                    {{ cert.title }}
                  </p>
                  <p class="mt-0.5 text-xs text-slate-500">{{ cert.issuer }} · {{ cert.year }}</p>
                </div>
                <HugeiconsIcon
                  :icon="ArrowUpRight01Icon"
                  class="size-4 text-slate-400 group-hover:text-[#2454E8] shrink-0 mt-0.5 transition-colors"
                />
              </a>

              <div v-else class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-sm font-medium text-[#090E1E]">
                    {{ cert.title }}
                  </p>
                  <p class="mt-0.5 text-xs text-slate-500">{{ cert.issuer }} · {{ cert.year }}</p>
                </div>
              </div>
            </li>
          </ul>

          <p v-else class="mt-6 text-xs text-slate-500">No certifications added yet.</p>
        </motion.div>

        <!-- Bento Card 3: Core Capabilities with SVG Badges -->
        <motion.div
          v-if="portfolioStore.siteSettings.capabilities.length > 0"
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.15 }"
          :transition="{ duration: 0.4, delay: 0.12 }"
          class="lg:col-span-12 rounded-[1.75rem] border border-slate-200/85 bg-[#FAFBFD] p-6 sm:p-8"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div
              v-for="(cap, idx) in portfolioStore.siteSettings.capabilities"
              :key="idx"
              class="flex flex-col"
            >
              <div class="flex items-center gap-3 mb-3">
                <img
                  :src="
                    cap.badgeSvg || defaultCapabilityBadges[idx % defaultCapabilityBadges.length]
                  "
                  :alt="cap.title"
                  class="size-7 object-contain shrink-0"
                />
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
