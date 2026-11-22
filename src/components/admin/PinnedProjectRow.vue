<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { PinIcon, Edit02Icon, Delete02Icon } from '@hugeicons/core-free-icons'
import type { ProjectItem } from '@/types/portfolio'

defineProps<{
  item: ProjectItem
  isSelected: boolean
  isDragging?: boolean
}>()

defineEmits<{
  select: [project: ProjectItem]
  pin: [project: ProjectItem]
  archive: [project: ProjectItem]
  delete: [id: string]
  dragstart: [id: string]
  dragover: [id: string]
  drop: [id: string]
  dragend: []
}>()
</script>

<template>
  <div
    draggable="true"
    @dragstart="$emit('dragstart', item.id)"
    @dragover.prevent="$emit('dragover', item.id)"
    @drop.prevent="$emit('drop', item.id)"
    @dragend="$emit('dragend')"
    :class="[
      'group flex items-center justify-between gap-2 rounded-2xl border px-3 py-3 transition-all select-none',
      isDragging ? 'opacity-40 scale-[0.98]' : '',
      isSelected
        ? 'border-[#2454E8] bg-[#F7F9FF]'
        : item.isArchived
          ? 'border-slate-200/60 bg-slate-50/70 opacity-75'
          : 'border-slate-200/80 bg-white hover:border-slate-300',
    ]"
  >
    <!-- Drag Handle -->
    <span
      title="Drag to reorder"
      class="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 px-0.5 shrink-0"
    >
      <svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
      </svg>
    </span>

    <!-- Click card ONLY selects for editing -->
    <button
      type="button"
      @click="$emit('select', item)"
      class="min-w-0 flex-1 text-left cursor-pointer"
    >
      <p class="text-sm font-medium text-[#090E1E] truncate">
        {{ item.title }}
      </p>
      <p class="text-[11px] text-slate-500 truncate">
        {{ item.year }} · {{ item.category ? item.category.toUpperCase() : 'UNCATEGORIZED' }}
        <span v-if="item.isArchived" class="ml-1 text-amber-600 font-medium">· Archived</span>
      </p>
    </button>

    <!-- 4 Action Icons: Pin, Archive, Edit, Delete -->
    <div class="flex items-center gap-0.5 shrink-0">
      <button
        type="button"
        @click.stop="$emit('pin', item)"
        :aria-label="item.isFeatured ? 'Unpin project' : 'Pin to Selected Works'"
        :title="item.isFeatured ? 'Unpin from Selected Works' : 'Pin to Selected Works'"
        :class="[
          'inline-flex size-7 items-center justify-center rounded-full transition-colors cursor-pointer',
          item.isFeatured
            ? 'bg-[#EEF3FF] text-[#2454E8]'
            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700',
        ]"
      >
        <HugeiconsIcon :icon="PinIcon" class="size-3.5" />
      </button>

      <button
        type="button"
        @click.stop="$emit('archive', item)"
        :aria-label="item.isArchived ? 'Unarchive project' : 'Archive project'"
        :title="item.isArchived ? 'Restore from Archive' : 'Hide / Archive Project'"
        :class="[
          'inline-flex size-7 items-center justify-center rounded-full transition-colors cursor-pointer',
          item.isArchived
            ? 'bg-amber-50 text-amber-600'
            : 'text-slate-400 hover:bg-amber-50 hover:text-amber-600',
        ]"
      >
        <svg
          class="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="2" y="4" width="20" height="5" rx="1" />
          <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
          <path d="M10 13h4" />
        </svg>
      </button>

      <button
        type="button"
        @click.stop="$emit('select', item)"
        aria-label="Edit project"
        title="Edit Project"
        class="inline-flex size-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-[#090E1E] cursor-pointer"
      >
        <HugeiconsIcon :icon="Edit02Icon" class="size-3.5" />
      </button>

      <button
        type="button"
        @click.stop="$emit('delete', item.id)"
        aria-label="Delete project"
        title="Delete Project"
        class="inline-flex size-7 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
      >
        <HugeiconsIcon :icon="Delete02Icon" class="size-3.5" />
      </button>
    </div>
  </div>
</template>
