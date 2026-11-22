<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowLeft01Icon, ArrowRight01Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { getTechIconUrl } from '@/lib/techIcons'

const ITEMS_PER_PAGE = 5

const router = useRouter()
const portfolioStore = usePortfolioStore()

const activeCategory = ref<string>('all')
const currentPage = ref<number>(1)

const filterOptions = computed(() => {
  const allArchive = portfolioStore.archiveProjects
  const dynamicCategories = (portfolioStore.siteSettings.categories || []).map((cat) => ({
    label: cat.toUpperCase(),
    value: cat,
    count: allArchive.filter((p) => p.category === cat).length,
  }))

  return [{ label: 'All', value: 'all', count: allArchive.length }, ...dynamicCategories]
})

const filteredArchive = computed(() => {
  const list = portfolioStore.archiveProjects
  if (activeCategory.value === 'all') return list
  return list.filter((p) => p.category === activeCategory.value)
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredArchive.value.length / ITEMS_PER_PAGE)),
)

const paginatedArchive = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredArchive.value.slice(start, start + ITEMS_PER_PAGE)
})

const rangeSummary = computed(() => {
  const total = filteredArchive.value.length
  if (total === 0) return ''
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE + 1
  const end = Math.min(currentPage.value * ITEMS_PER_PAGE, total)
  return `Showing ${start}–${end} of ${total}`
})

function selectCategory(category: string) {
  activeCategory.value = category
  currentPage.value = 1
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch(
  () => portfolioStore.siteSettings.categories,
  (cats) => {
    if (activeCategory.value !== 'all' && !(cats || []).includes(activeCategory.value)) {
      activeCategory.value = 'all'
      currentPage.value = 1
    }
  },
)

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})
</script>

<template>
  <section id="archive" class="w-full bg-white px-6 py-20 sm:px-8 sm:py-24">
    <div class="mx-auto max-w-5xl">
      <!-- Header & Dynamic Category Pills -->
      <div
        class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-slate-200/80"
      >
        <div>
          <p class="text-xs sm:text-sm font-medium tracking-wide text-[#2454E8]">
            Archive & Experiments
          </p>
          <h2 class="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-[#090E1E]">
            More builds &
            <span class="font-serif italic font-normal text-[#2454E8]"> explorations. </span>
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Filter archive by category"
          class="flex flex-wrap items-center gap-1.5"
        >
          <button
            v-for="opt in filterOptions"
            :key="opt.value"
            type="button"
            role="tab"
            :aria-selected="activeCategory === opt.value"
            @click="selectCategory(opt.value)"
            :class="[
              'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer',
              activeCategory === opt.value
                ? 'bg-[#090E1E] text-white'
                : 'bg-[#FAFBFD] border border-slate-200 text-slate-600 hover:text-[#2454E8]',
            ]"
          >
            <span>{{ opt.label }}</span>
            <span
              :class="[
                'text-[10px] tabular-nums',
                activeCategory === opt.value ? 'text-white/75' : 'text-slate-400',
              ]"
            >
              {{ opt.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Archive List -->
      <div v-if="paginatedArchive.length > 0" class="divide-y divide-slate-200/75">
        <button
          v-for="project in paginatedArchive"
          :key="project.id"
          type="button"
          @click="router.push(`/project/${project.slug}`)"
          class="group w-full py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left transition-colors hover:bg-[#FAFBFD] px-3 -mx-3 rounded-2xl cursor-pointer"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2.5">
              <span
                class="text-base font-medium text-[#090E1E] group-hover:text-[#2454E8] transition-colors"
              >
                {{ project.title }}
              </span>
              <span
                v-if="project.category"
                class="rounded-full bg-[#EEF3FF] px-2.5 py-0.5 text-[10px] font-medium text-[#2454E8] uppercase"
              >
                {{ project.category }}
              </span>
              <span class="text-xs text-slate-400 tabular-nums">
                {{ project.year }}
              </span>
            </div>
            <p class="mt-1 text-sm text-slate-500 line-clamp-1">
              {{ project.tagline }}
            </p>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div class="flex flex-wrap items-center gap-1.5">
              <span
                v-for="tech in project.techStack.slice(0, 3)"
                :key="tech"
                class="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-600"
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

            <HugeiconsIcon
              :icon="ArrowUpRight01Icon"
              class="size-4 text-slate-300 group-hover:text-[#2454E8] transition-colors shrink-0"
            />
          </div>
        </button>
      </div>

      <!-- Empty State -->
      <p v-else class="py-12 text-center text-sm text-slate-500">
        No archived projects in this category yet.
      </p>

      <!-- Pagination Controls -->
      <nav
        v-if="totalPages > 1"
        aria-label="Archive pagination"
        class="mt-6 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-xs text-slate-500 tabular-nums">
          {{ rangeSummary }}
        </p>

        <div class="flex items-center gap-1.5">
          <button
            type="button"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            aria-label="Previous page"
            class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 h-8 text-xs font-medium text-slate-600 hover:border-[#2454E8] hover:text-[#2454E8] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
          >
            <HugeiconsIcon :icon="ArrowLeft01Icon" class="size-3.5" />
            <span>Prev</span>
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            :aria-current="currentPage === page ? 'page' : undefined"
            @click="goToPage(page)"
            :class="[
              'inline-flex size-8 items-center justify-center rounded-full text-xs font-medium tabular-nums transition-colors cursor-pointer',
              currentPage === page
                ? 'bg-[#090E1E] text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#2454E8] hover:text-[#2454E8]',
            ]"
          >
            {{ page }}
          </button>

          <button
            type="button"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            aria-label="Next page"
            class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 h-8 text-xs font-medium text-slate-600 hover:border-[#2454E8] hover:text-[#2454E8] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
          >
            <span>Next</span>
            <HugeiconsIcon :icon="ArrowRight01Icon" class="size-3.5" />
          </button>
        </div>
      </nav>
    </div>
  </section>
</template>
