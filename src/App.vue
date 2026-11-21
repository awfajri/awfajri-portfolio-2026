<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import CommandPalette from '@/components/layout/CommandPalette.vue'
import XRayOverlay from '@/components/layout/XRayOverlay.vue'
import { usePortfolioStore } from '@/stores/portfolioStore'

const portfolioStore = usePortfolioStore()

onMounted(() => {
  portfolioStore.fetchPortfolioData()
})
</script>

<template>
  <RouterView />
  <CommandPalette />
  <XRayOverlay />
</template>
