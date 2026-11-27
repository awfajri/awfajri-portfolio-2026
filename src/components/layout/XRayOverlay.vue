<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()
</script>

<template>
  <Teleport to="body">
    <div v-if="uiStore.isXRayActive" class="pointer-events-none fixed inset-0 z-40">
      <!-- Wrapper luar: samakan padding horizontal dengan semua section -->
      <div class="h-full w-full px-6 sm:px-8">
        <!-- Container dalam: samakan max-w-5xl (1024px) persis dengan konten -->
        <div class="mx-auto h-full max-w-5xl border-x border-[#2454E8]/25">
          <div class="grid h-full grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4 sm:gap-6">
            <div
              v-for="n in 12"
              :key="n"
              class="h-full bg-[#2454E8]/[0.035] border-x border-[#2454E8]/[0.08]"
            />
          </div>
        </div>
      </div>

      <!-- Floating X-Ray HUD -->
      <div
        class="pointer-events-auto fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-2 text-xs shadow-lg shadow-slate-900/10"
      >
        <span class="inline-flex items-center gap-1.5 font-medium text-[#2454E8]">
          <span class="size-2 rounded-full bg-[#2454E8] animate-pulse" />
          X-Ray Active
        </span>

        <span class="h-3.5 w-px bg-slate-200" />

        <span class="hidden sm:inline-flex items-center gap-2 text-slate-600">
          <span class="inline-flex items-center gap-1">
            <span class="size-2.5 rounded-full bg-[#090E1E]" />
            #090E1E
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="size-2.5 rounded-full bg-[#2454E8]" />
            #2454E8
          </span>
          <span class="text-slate-400">·</span>
          <span>Outfit + Serif</span>
        </span>

        <button
          type="button"
          @click="uiStore.toggleXRay()"
          aria-label="Close X-Ray Mode"
          class="ml-1 inline-flex size-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  </Teleport>
</template>
