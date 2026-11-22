<script setup lang="ts">
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useDriveAsset } from '@/composables/useDriveAsset'
import { getTechIconUrl } from '@/lib/techIcons'

const router = useRouter()
const portfolioStore = usePortfolioStore()
const { getDriveImageUrl } = useDriveAsset()
</script>

<template>
  <section id="works" class="w-full bg-white px-6 py-20 sm:px-8 sm:py-28">
    <div class="mx-auto max-w-5xl">
      <!-- Section Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-10 border-b border-slate-200/80"
      >
        <div>
          <p class="text-xs sm:text-sm font-medium tracking-wide text-[#2454E8]">Selected Works</p>
          <h2 class="mt-2 text-3xl sm:text-4xl font-medium tracking-tight text-[#090E1E]">
            Featured
            <span class="font-serif italic font-normal text-[#2454E8]"> case studies. </span>
          </h2>
        </div>

        <p
          v-if="portfolioStore.featuredProjects.length > 0"
          class="text-xs sm:text-sm text-slate-500 tabular-nums"
        >
          {{ portfolioStore.featuredProjects.length }} curated works
        </p>
      </div>

      <!-- Featured Grid -->
      <div
        v-if="portfolioStore.featuredProjects.length > 0"
        class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.article
          v-for="(project, index) in portfolioStore.featuredProjects"
          :key="project.id"
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.15 }"
          :transition="{ duration: 0.35, delay: index * 0.05 }"
          @click="router.push(`/project/${project.slug}`)"
          class="group flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-slate-200/85 bg-[#FAFBFD] transition-all hover:border-[#2454E8]/40 hover:shadow-md hover:shadow-slate-900/5 cursor-pointer"
        >
          <div>
            <!-- Thumbnail -->
            <div
              class="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-200/70"
            >
              <img
                v-if="project.thumbnailDriveUrl"
                :src="getDriveImageUrl(project.thumbnailDriveUrl)"
                :alt="project.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-[#F4F6FA] text-xs font-medium text-slate-400"
              >
                {{ project.title }}
              </div>

              <div class="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                <span
                  v-if="project.category"
                  class="rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/80 px-2.5 py-0.5 text-[11px] font-medium text-[#2454E8] uppercase"
                >
                  {{ project.category }}
                </span>
                <span
                  v-if="project.year"
                  class="rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 tabular-nums"
                >
                  {{ project.year }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="flex items-start justify-between gap-3">
                <h3
                  class="text-xl font-medium text-[#090E1E] group-hover:text-[#2454E8] transition-colors"
                >
                  {{ project.title }}
                </h3>
                <span
                  class="inline-flex size-8 items-center justify-center rounded-full bg-white border border-slate-200/80 text-slate-400 group-hover:border-[#2454E8] group-hover:text-[#2454E8] shrink-0 transition-colors"
                >
                  <HugeiconsIcon :icon="ArrowUpRight01Icon" class="size-4" />
                </span>
              </div>

              <p class="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
                {{ project.tagline }}
              </p>
            </div>
          </div>

          <!-- Tech Stack with Icons -->
          <div v-if="project.techStack?.length" class="px-6 pb-6 pt-1 flex flex-wrap gap-1.5">
            <span
              v-for="tech in project.techStack.slice(0, 4)"
              :key="tech"
              class="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-700"
            >
              <img
                v-if="getTechIconUrl(tech)"
                :src="getTechIconUrl(tech)!"
                :alt="tech"
                loading="lazy"
                class="size-3.5 object-contain shrink-0"
              />
              <span>{{ tech }}</span>
            </span>
          </div>
        </motion.article>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="mt-10 rounded-[1.75rem] border border-dashed border-slate-200 bg-[#FAFBFD] py-14 text-center"
      >
        <p class="text-sm text-slate-500">No featured projects pinned yet.</p>
      </div>
    </div>
  </section>
</template>
