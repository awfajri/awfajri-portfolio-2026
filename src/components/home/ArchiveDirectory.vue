<script setup lang="ts">
import { ref, computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { usePortfolioStore } from '@/stores/portfolioStore'
import type { ProjectCategory } from '@/types/portfolio'

const portfolioStore = usePortfolioStore()
const activeCategory = ref<'all' | ProjectCategory>('all')

const categories: { value: 'all' | ProjectCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ux', label: 'UX' },
  { value: 'dev', label: 'Engineering' },
  { value: 'aiot', label: 'AIoT' },
  { value: 'design', label: 'Design' },
]

const visibleArchive = computed(() => {
  const source =
    portfolioStore.archiveProjects.length > 0
      ? portfolioStore.archiveProjects
      : portfolioStore.projects

  if (activeCategory.value === 'all') return source
  return source.filter((item) => item.category === activeCategory.value)
})
</script>

<template>
  <section id="archive" class="w-full bg-white px-6 py-16 sm:px-8 sm:py-24">
    <div class="mx-auto max-w-5xl">
      <!-- Header & Category Pills -->
      <div
        class="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-8 border-b border-slate-200/80"
      >
        <div>
          <p class="text-xs sm:text-sm font-medium tracking-wide text-[#2454E8]">
            Archive & Experiments
          </p>
          <h2 class="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-[#090E1E]">
            Other builds,
            <span class="font-serif italic font-normal text-[#2454E8]">
              research & coursework.
            </span>
          </h2>
        </div>

        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="cat in categories"
            :key="cat.value"
            type="button"
            @click="activeCategory = cat.value"
            :class="[
              'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer',
              activeCategory === cat.value
                ? 'bg-[#090E1E] text-white'
                : 'bg-slate-100 text-slate-600 hover:text-[#2454E8]',
            ]"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Clean Editorial List Rows -->
      <div class="divide-y divide-slate-200/75">
        <RouterLink
          v-for="item in visibleArchive"
          :key="item.id"
          :to="`/project/${item.slug}`"
          class="group grid grid-cols-12 items-center gap-4 py-5 px-2 -mx-2 rounded-xl transition-colors hover:bg-[#FAFBFD]"
        >
          <!-- Year -->
          <span
            class="col-span-2 sm:col-span-1 text-xs sm:text-sm font-medium text-slate-400 tabular-nums"
          >
            {{ item.year }}
          </span>

          <!-- Title & Tagline -->
          <div class="col-span-9 sm:col-span-6">
            <h3
              class="text-base sm:text-lg font-medium text-[#090E1E] group-hover:text-[#2454E8] transition-colors"
            >
              {{ item.title }}
            </h3>
            <p class="mt-0.5 text-xs sm:text-sm text-slate-500 line-clamp-1">
              {{ item.tagline }}
            </p>
          </div>

          <!-- Stack Tags (Desktop) -->
          <div class="hidden sm:flex sm:col-span-4 flex-wrap items-center gap-1.5">
            <span
              v-for="tech in item.techStack.slice(0, 3)"
              :key="tech"
              class="rounded-full bg-white border border-slate-200/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {{ tech }}
            </span>
          </div>

          <!-- Arrow -->
          <div
            class="col-span-1 flex justify-end text-slate-400 group-hover:text-[#2454E8] transition-colors"
          >
            <HugeiconsIcon
              :icon="ArrowUpRight01Icon"
              class="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </RouterLink>
      </div>

      <p v-if="visibleArchive.length === 0" class="py-10 text-center text-sm text-slate-500">
        No archived projects in this category yet.
      </p>
    </div>
  </section>
</template>
