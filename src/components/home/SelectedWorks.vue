<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowUpRight01Icon, Award01Icon, CodeIcon, SparklesIcon } from '@hugeicons/core-free-icons'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useUiStore } from '@/stores/uiStore'
import { useDriveAsset } from '@/composables/useDriveAsset'
import type { ProjectItem, RoleLensMode } from '@/types/portfolio'

const portfolioStore = usePortfolioStore()
const uiStore = useUiStore()
const { getDriveImageUrl } = useDriveAsset()

const lensOptions: { value: RoleLensMode; label: string }[] = [
  { value: 'all', label: 'All Works' },
  { value: 'ux', label: 'Product & UX' },
  { value: 'engineering', label: 'Engineering & PM' },
]

const filteredWorks = computed(() => {
  const list = portfolioStore.featuredProjects
  if (uiStore.roleLens === 'ux') {
    return list.filter(
      (p) =>
        p.category === 'ux' ||
        p.category === 'design' ||
        Boolean(p.uxMetrics.susScore || p.uxMetrics.seqScore),
    )
  }
  if (uiStore.roleLens === 'engineering') {
    return list.filter(
      (p) => p.category === 'dev' || p.category === 'aiot' || p.techStack.length > 0,
    )
  }
  return list
})

function getPrimaryMetric(project: ProjectItem): string | null {
  if (project.uxMetrics.susScore) return `SUS ${project.uxMetrics.susScore}`
  if (project.uxMetrics.seqScore) return `SEQ ${project.uxMetrics.seqScore}`
  if (project.uxMetrics.npsScore) return `NPS ${project.uxMetrics.npsScore}`
  return null
}

function getCategoryLabel(category: ProjectItem['category']): string {
  const map: Record<ProjectItem['category'], string> = {
    ux: 'Product & UX',
    dev: 'Engineering',
    aiot: 'AIoT System',
    design: 'Visual Design',
  }
  return map[category]
}
</script>

<template>
  <section id="works" class="w-full bg-white px-6 py-20 sm:px-8 sm:py-28">
    <div class="mx-auto max-w-5xl">
      <!-- Section Header + Role Lens Switcher -->
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-200/80"
      >
        <div>
          <p class="text-xs sm:text-sm font-medium tracking-wide text-[#2454E8]">Selected Works</p>
          <h2 class="mt-2 text-3xl sm:text-4xl font-medium tracking-tight text-[#090E1E]">
            Crafted with intent,
            <span class="font-serif italic font-normal text-[#2454E8]"> built to ship. </span>
          </h2>
        </div>

        <!-- Role Lens Segmented Toggle -->
        <div
          role="tablist"
          aria-label="Filter works by role lens"
          class="inline-flex items-center self-start md:self-auto rounded-full bg-[#F4F6FA] border border-slate-200/80 p-1"
        >
          <button
            v-for="lens in lensOptions"
            :key="lens.value"
            type="button"
            role="tab"
            :aria-selected="uiStore.roleLens === lens.value"
            @click="uiStore.setRoleLens(lens.value)"
            :class="[
              'rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap',
              uiStore.roleLens === lens.value
                ? 'bg-[#090E1E] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#2454E8]',
            ]"
          >
            {{ lens.label }}
          </button>
        </div>
      </div>

      <!-- Featured Projects 2-Column Editorial Grid -->
      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <motion.article
          v-for="(project, index) in filteredWorks"
          :key="project.id"
          :initial="{ opacity: 0, y: 18 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.15 }"
          :transition="{ duration: 0.4, delay: index * 0.06 }"
          class="group flex flex-col rounded-[1.75rem] border border-slate-200/85 bg-[#FAFBFD] overflow-hidden transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/[0.04]"
        >
          <!-- Thumbnail / Editorial Cover -->
          <RouterLink
            :to="`/project/${project.slug}`"
            class="relative block aspect-[16/10] w-full overflow-hidden bg-white border-b border-slate-100"
          >
            <img
              v-if="project.thumbnailDriveUrl"
              :src="getDriveImageUrl(project.thumbnailDriveUrl)"
              :alt="project.title"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />

            <!-- Clean Typographic Fallback when Drive Thumbnail is not yet set -->
            <div
              v-else
              class="flex h-full w-full flex-col justify-between p-6 sm:p-7 bg-gradient-to-br from-[#F7F9FF] via-white to-[#EEF3FF]"
            >
              <div class="flex items-center justify-between">
                <span
                  class="rounded-full bg-white border border-blue-100 px-3 py-1 text-[11px] font-medium text-[#2454E8]"
                >
                  {{ getCategoryLabel(project.category) }}
                </span>
                <span class="text-xs font-medium text-slate-400 tabular-nums">
                  {{ project.year }}
                </span>
              </div>

              <div>
                <p class="font-serif italic text-2xl sm:text-3xl text-[#2454E8]/90">
                  {{ project.title }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ project.pmRole || 'Product & Engineering' }}
                </p>
              </div>
            </div>

            <!-- Hover Arrow Indicator -->
            <span
              class="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full bg-white/95 text-[#090E1E] border border-slate-200/80 shadow-xs opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
            >
              <HugeiconsIcon :icon="ArrowUpRight01Icon" class="size-4" />
            </span>
          </RouterLink>

          <!-- Card Body -->
          <div class="flex flex-1 flex-col justify-between p-6 sm:p-7">
            <div>
              <div class="flex items-center justify-between gap-3">
                <h3
                  class="text-xl sm:text-2xl font-medium tracking-tight text-[#090E1E] group-hover:text-[#2454E8] transition-colors"
                >
                  <RouterLink :to="`/project/${project.slug}`">
                    {{ project.title }}
                  </RouterLink>
                </h3>
                <span class="text-xs font-medium text-slate-400 tabular-nums shrink-0">
                  {{ project.year }}
                </span>
              </div>

              <p class="mt-2.5 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                {{ project.tagline }}
              </p>
            </div>

            <!-- Dynamic Role-Lens Metadata Footer -->
            <div class="mt-6 pt-5 border-t border-slate-200/75 space-y-3">
              <!-- UX Lens Emphasis -->
              <div
                v-if="
                  uiStore.roleLens === 'ux' ||
                  (uiStore.roleLens === 'all' && getPrimaryMetric(project))
                "
                class="flex flex-wrap items-center gap-2"
              >
                <span
                  v-if="getPrimaryMetric(project)"
                  class="inline-flex items-center gap-1.5 rounded-full bg-[#EEF3FF] px-3 py-1 text-xs font-medium text-[#2454E8]"
                >
                  <HugeiconsIcon :icon="Award01Icon" class="size-3.5" />
                  <span>{{ getPrimaryMetric(project) }}</span>
                </span>
                <span
                  v-if="uiStore.roleLens === 'ux' && project.uxMetrics.researchMethod"
                  class="text-xs text-slate-500 line-clamp-1"
                >
                  {{ project.uxMetrics.researchMethod }}
                </span>
              </div>

              <!-- Engineering & PM Lens Emphasis -->
              <div
                v-if="uiStore.roleLens === 'engineering' && project.pmRole"
                class="flex items-center gap-1.5 text-xs font-medium text-[#090E1E]"
              >
                <HugeiconsIcon :icon="CodeIcon" class="size-3.5 text-[#2454E8]" />
                <span>{{ project.pmRole }}</span>
              </div>

              <!-- Tech / Skill Pills -->
              <div class="flex flex-wrap items-center gap-1.5">
                <span
                  v-for="tag in project.techStack.slice(0, 4)"
                  :key="tag"
                  class="rounded-full bg-white border border-slate-200/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                >
                  {{ tag }}
                </span>
                <span
                  v-if="project.techStack.length > 4"
                  class="text-[11px] font-medium text-slate-400 pl-1"
                >
                  +{{ project.techStack.length - 4 }}
                </span>
              </div>
            </div>
          </div>
        </motion.article>
      </div>

      <!-- Empty State Fallback -->
      <div
        v-if="filteredWorks.length === 0"
        class="mt-10 rounded-3xl border border-slate-200/80 bg-[#FAFBFD] py-14 px-6 text-center"
      >
        <HugeiconsIcon :icon="SparklesIcon" class="size-6 mx-auto text-[#2454E8] mb-3" />
        <p class="text-sm font-medium text-[#090E1E]">No featured works match this lens yet.</p>
        <button
          type="button"
          @click="uiStore.setRoleLens('all')"
          class="mt-3 text-xs font-medium text-[#2454E8] hover:underline cursor-pointer"
        >
          Show all works
        </button>
      </div>
    </div>
  </section>
</template>
