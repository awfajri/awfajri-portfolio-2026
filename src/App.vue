<script setup lang="ts">
import { onMounted } from 'vue'
import { AnimateUIProvider } from '@animate-ui/vue/provider'
import { useUiStore } from '@/stores/uiStore'
import { usePortfolioStore } from '@/stores/portfolioStore'

const uiStore = useUiStore()
const portfolioStore = usePortfolioStore()

onMounted(() => {
  portfolioStore.fetchPortfolioData()
})
</script>

<template>
  <AnimateUIProvider :tempo="uiStore.animationTempo" check-animation="pop">
    <div
      class="min-h-screen bg-white text-slate-900 antialiased selection:bg-indigo-600 selection:text-white"
    >
      <RouterView />
    </div>
  </AnimateUIProvider>
</template>
