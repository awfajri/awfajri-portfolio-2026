<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  ArrowLeft01Icon,
  ArrowUpRight01Icon,
  Award01Icon,
  CodeIcon,
} from '@hugeicons/core-free-icons'
import FloatingNavbar from '@/components/layout/FloatingNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MotionButton from '@/components/ui/MotionButton.vue'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useDriveAsset } from '@/composables/useDriveAsset'

const route = useRoute()
const router = useRouter()
const portfolioStore = usePortfolioStore()
const { getDriveImageUrl } = useDriveAsset()

const project = computed(() =>
  portfolioStore.projects.find((p) => p.slug === String(route.params.slug)),
)

const galleryUrls = computed(() =>
  (project.value?.galleryDriveUrls || []).map((url) => getDriveImageUrl(url)).filter(Boolean),
)

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'instant' })
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <FloatingNavbar />

    <main class="px-6 pt-32 pb-20 sm:px-8 sm:pt-36">
      <div v-if="project" class="mx-auto max-w-4xl">
        <button
          type="button"
          @click="router.push('/')"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-[#2454E8] transition-colors cursor-pointer mb-8"
        >
          <HugeiconsIcon :icon="ArrowLeft01Icon" class="size-4" />
          <span>Back to Portfolio</span>
        </button>

        <header class="pb-10 border-b border-slate-200/80">
          <div class="flex flex-wrap items-center gap-2.5 mb-4">
            <span
              class="rounded-full bg-[#EEF3FF] px-3 py-1 text-xs font-medium text-[#2454E8] uppercase tracking-wide"
            >
              {{ project.category }}
            </span>
            <span class="text-xs font-medium text-slate-400 tabular-nums">
              {{ project.year }}
            </span>
          </div>

          <h1 class="text-4xl sm:text-5xl font-medium tracking-tight text-[#090E1E] leading-[1.1]">
            {{ project.title }}
          </h1>

          <p class="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            {{ project.tagline }}
          </p>

          <div class="mt-7 flex flex-wrap items-center gap-3">
            <MotionButton
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              :tap-scale="0.97"
              class="bg-[#090E1E] hover:bg-[#2454E8] text-white h-10 px-5 text-xs sm:text-sm"
            >
              <span>Live Product</span>
              <HugeiconsIcon :icon="ArrowUpRight01Icon" class="size-4" />
            </MotionButton>

            <MotionButton
              v-if="project.figmaUrl"
              :href="project.figmaUrl"
              target="_blank"
              rel="noopener noreferrer"
              :tap-scale="0.97"
              class="bg-white hover:bg-slate-50 text-[#090E1E] border border-slate-200 h-10 px-5 text-xs sm:text-sm"
            >
              <span>Figma Prototype</span>
              <HugeiconsIcon :icon="ArrowUpRight01Icon" class="size-4 text-[#2454E8]" />
            </MotionButton>

            <MotionButton
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              :tap-scale="0.97"
              class="bg-white hover:bg-slate-50 text-[#090E1E] border border-slate-200 h-10 px-5 text-xs sm:text-sm"
            >
              <span>GitHub Repo</span>
              <HugeiconsIcon :icon="ArrowUpRight01Icon" class="size-4 text-[#2454E8]" />
            </MotionButton>
          </div>
        </header>

        <div
          v-if="project.thumbnailDriveUrl"
          class="mt-10 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-[#FAFBFD]"
        >
          <img
            :src="getDriveImageUrl(project.thumbnailDriveUrl)"
            :alt="project.title"
            class="w-full h-auto object-cover"
          />
        </div>

        <section class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-5">
            <p class="text-xs text-slate-500">Role & Ownership</p>
            <p class="mt-1.5 text-sm font-medium text-[#090E1E]">
              {{ project.pmRole || 'Product Designer & Developer' }}
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-5">
            <p class="text-xs text-slate-500 flex items-center gap-1.5">
              <HugeiconsIcon :icon="Award01Icon" class="size-3.5 text-[#2454E8]" />
              <span>Validation & Metrics</span>
            </p>
            <p class="mt-1.5 text-sm font-medium text-[#090E1E]">
              <template v-if="project.uxMetrics.susScore"
                >SUS {{ project.uxMetrics.susScore }}</template
              >
              <template v-else-if="project.uxMetrics.seqScore"
                >SEQ {{ project.uxMetrics.seqScore }}</template
              >
              <template v-else-if="project.uxMetrics.npsScore"
                >NPS {{ project.uxMetrics.npsScore }}</template
              >
              <template v-else>Qualitative Testing</template>
            </p>
            <p v-if="project.uxMetrics.researchMethod" class="mt-1 text-xs text-slate-500">
              {{ project.uxMetrics.researchMethod }}
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-5">
            <p class="text-xs text-slate-500 flex items-center gap-1.5">
              <HugeiconsIcon :icon="CodeIcon" class="size-3.5 text-[#2454E8]" />
              <span>Stack & Tools</span>
            </p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <span
                v-for="tech in project.techStack"
                :key="tech"
                class="rounded-full bg-white border border-slate-200/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </section>

        <section class="mt-12 space-y-8">
          <div
            v-if="project.fieldNotes"
            class="rounded-[1.75rem] border border-blue-100 bg-[#F7F9FF] p-6 sm:p-8"
          >
            <p class="text-xs font-medium uppercase tracking-wider text-[#2454E8]">
              Behind the Build · Field Notes
            </p>
            <p class="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {{ project.fieldNotes }}
            </p>
          </div>

          <div v-if="galleryUrls.length > 0" class="space-y-4 pt-4">
            <h2 class="text-xl sm:text-2xl font-medium text-[#090E1E]">
              Visual
              <span class="font-serif italic font-normal text-[#2454E8]">Artifacts</span>
            </h2>
            <div class="grid grid-cols-1 gap-5">
              <div
                v-for="(imgUrl, idx) in galleryUrls"
                :key="idx"
                class="overflow-hidden rounded-2xl border border-slate-200/80 bg-[#FAFBFD]"
              >
                <img
                  :src="imgUrl"
                  :alt="`${project.title} visual ${idx + 1}`"
                  loading="lazy"
                  class="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="mx-auto max-w-xl py-24 text-center">
        <p class="text-xs font-medium text-[#2454E8]">404 · Case Study Not Found</p>
        <h1 class="mt-2 text-3xl font-medium text-[#090E1E]">This project could not be found.</h1>
        <p class="mt-3 text-sm text-slate-500">
          The link may be outdated or the project has been moved to another slug.
        </p>
        <div class="mt-7">
          <MotionButton
            @click="router.push('/')"
            :tap-scale="0.97"
            class="bg-[#090E1E] text-white h-11 px-6 text-sm"
          >
            Return Home
          </MotionButton>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
