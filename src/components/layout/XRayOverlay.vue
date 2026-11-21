<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import { HugeiconsIcon } from '@hugeicons/vue'
import { Cancel01Icon, Layers01Icon } from '@hugeicons/core-free-icons'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()
</script>

<template>
  <AnimatePresence>
    <div v-if="uiStore.isXRayActive" class="fixed inset-0 z-[60] pointer-events-none">
      <div class="mx-auto h-full max-w-5xl px-6 sm:px-8">
        <div class="grid h-full grid-cols-4 sm:grid-cols-12 gap-4">
          <div
            v-for="col in 12"
            :key="col"
            :class="[
              'h-full border-x border-[#2454E8]/15 bg-[#2454E8]/[0.03]',
              col > 4 ? 'hidden sm:block' : '',
            ]"
          />
        </div>
      </div>

      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: 12 }"
        class="pointer-events-auto fixed bottom-5 right-5 flex items-center gap-4 rounded-full border border-slate-200 bg-white/95 backdrop-blur-md px-4 py-2 text-xs text-slate-700 shadow-lg shadow-slate-900/10"
      >
        <span class="flex items-center gap-1.5 font-medium text-[#2454E8]">
          <HugeiconsIcon :icon="Layers01Icon" class="size-3.5" />
          <span>X-Ray Active</span>
        </span>

        <span class="hidden sm:inline text-slate-300">|</span>

        <div class="hidden sm:flex items-center gap-2">
          <span class="inline-flex items-center gap-1">
            <span class="size-2.5 rounded-full bg-[#090E1E]" />
            <code class="text-[11px]">#090E1E</code>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="size-2.5 rounded-full bg-[#2454E8]" />
            <code class="text-[11px]">#2454E8</code>
          </span>
          <span class="text-[11px] text-slate-500">Outfit + Times New Roman</span>
        </div>

        <button
          type="button"
          @click="uiStore.toggleXRay()"
          aria-label="Close X-Ray inspector"
          class="inline-flex size-6 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
        >
          <HugeiconsIcon :icon="Cancel01Icon" class="size-3.5" />
        </button>
      </motion.div>
    </div>
  </AnimatePresence>
</template>
