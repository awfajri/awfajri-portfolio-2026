<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { motion, AnimatePresence } from 'motion-v'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Search01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  Copy01Icon,
  Tick01Icon,
  Download01Icon,
  Layers01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { useUiStore } from '@/stores/uiStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useDriveAsset } from '@/composables/useDriveAsset'

const router = useRouter()
const uiStore = useUiStore()
const portfolioStore = usePortfolioStore()
const { getDriveDownloadUrl } = useDriveAsset()

const searchQuery = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const isEmailCopied = ref(false)

const filteredProjects = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return portfolioStore.projects.slice(0, 5)
  return portfolioStore.projects.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.techStack.some((t) => t.toLowerCase().includes(q)),
  )
})

function closePalette() {
  uiStore.setCommandOpen(false)
  searchQuery.value = ''
}

function openProject(slug: string) {
  closePalette()
  router.push(`/project/${slug}`)
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(portfolioStore.siteSettings.contactEmail)
    isEmailCopied.value = true
    setTimeout(() => {
      isEmailCopied.value = false
    }, 1800)
  } catch {
    // Silent fallback
  }
}

function downloadCv() {
  const url = getDriveDownloadUrl(portfolioStore.siteSettings.cvDriveUrl)
  window.open(url, '_blank', 'noopener,noreferrer')
  closePalette()
}

function toggleInspect() {
  uiStore.toggleXRay()
  closePalette()
}

function cycleRoleLens() {
  const order = ['all', 'ux', 'engineering'] as const
  const nextIndex = (order.indexOf(uiStore.roleLens) + 1) % order.length
  uiStore.setRoleLens(order[nextIndex])
  closePalette()
}

watch(
  () => uiStore.isCommandOpen,
  async (open) => {
    if (open) {
      await nextTick()
      inputRef.value?.focus()
    }
  },
)
</script>

<template>
  <AnimatePresence>
    <div
      v-if="uiStore.isCommandOpen"
      class="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
      @keydown.esc="closePalette"
    >
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.18 }"
        class="fixed inset-0 bg-[#090E1E]/35 backdrop-blur-xs"
        @click="closePalette"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Quick Command Palette"
        :initial="{ opacity: 0, y: -12, scale: 0.98 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: -8, scale: 0.98 }"
        :transition="{ duration: 0.2 }"
        class="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/15"
      >
        <div class="flex items-center gap-3 border-b border-slate-100 px-5 h-14">
          <HugeiconsIcon :icon="Search01Icon" class="size-4 text-slate-400 shrink-0" />
          <input
            ref="inputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Search projects, stack, or actions..."
            class="w-full bg-transparent text-sm text-[#090E1E] placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            @click="closePalette"
            aria-label="Close command palette"
            class="inline-flex size-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <HugeiconsIcon :icon="Cancel01Icon" class="size-4" />
          </button>
        </div>

        <div class="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          <div>
            <p class="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Projects
            </p>
            <div v-if="filteredProjects.length > 0" class="space-y-0.5">
              <button
                v-for="project in filteredProjects"
                :key="project.id"
                type="button"
                @click="openProject(project.slug)"
                class="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#FAFBFD] cursor-pointer"
              >
                <div class="min-w-0 pr-3">
                  <p class="text-sm font-medium text-[#090E1E] group-hover:text-[#2454E8] truncate">
                    {{ project.title }}
                  </p>
                  <p class="text-xs text-slate-500 truncate">
                    {{ project.tagline }}
                  </p>
                </div>
                <HugeiconsIcon
                  :icon="ArrowRight01Icon"
                  class="size-4 text-slate-300 group-hover:text-[#2454E8] shrink-0"
                />
              </button>
            </div>
            <p v-else class="px-3 py-3 text-xs text-slate-500">No matching projects found.</p>
          </div>

          <div class="border-t border-slate-100 pt-3">
            <p class="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Quick Actions
            </p>
            <div class="space-y-0.5">
              <button
                type="button"
                @click="copyEmail"
                class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-[#FAFBFD] hover:text-[#2454E8] transition-colors cursor-pointer"
              >
                <span class="flex items-center gap-2.5">
                  <HugeiconsIcon
                    :icon="isEmailCopied ? Tick01Icon : Copy01Icon"
                    :class="['size-4', isEmailCopied ? 'text-emerald-600' : 'text-slate-400']"
                  />
                  <span>{{
                    isEmailCopied ? 'Email Copied to Clipboard' : 'Copy Contact Email'
                  }}</span>
                </span>
                <span class="text-[11px] text-slate-400">Email</span>
              </button>

              <button
                type="button"
                @click="downloadCv"
                class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-[#FAFBFD] hover:text-[#2454E8] transition-colors cursor-pointer"
              >
                <span class="flex items-center gap-2.5">
                  <HugeiconsIcon :icon="Download01Icon" class="size-4 text-slate-400" />
                  <span>Download Latest CV</span>
                </span>
                <span class="text-[11px] text-slate-400">PDF</span>
              </button>

              <button
                type="button"
                @click="cycleRoleLens"
                class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-[#FAFBFD] hover:text-[#2454E8] transition-colors cursor-pointer"
              >
                <span class="flex items-center gap-2.5">
                  <HugeiconsIcon :icon="SparklesIcon" class="size-4 text-slate-400" />
                  <span>Cycle Role Lens (Current: {{ uiStore.roleLens }})</span>
                </span>
                <span class="text-[11px] text-slate-400">Filter</span>
              </button>

              <button
                type="button"
                @click="toggleInspect"
                class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-[#FAFBFD] hover:text-[#2454E8] transition-colors cursor-pointer"
              >
                <span class="flex items-center gap-2.5">
                  <HugeiconsIcon :icon="Layers01Icon" class="size-4 text-slate-400" />
                  <span
                    >{{ uiStore.isXRayActive ? 'Disable' : 'Enable' }} X-Ray Grid Inspector</span
                  >
                </span>
                <span class="text-[11px] text-slate-400">Shift + I</span>
              </button>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-between border-t border-slate-100 bg-[#FAFBFD] px-5 py-2.5 text-[11px] text-slate-400"
        >
          <span>Press ESC to close</span>
          <span>⌘K Quick Palette</span>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
</template>
