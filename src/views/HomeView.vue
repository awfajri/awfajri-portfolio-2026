<script setup lang="ts">
import FloatingNavbar from '@/components/layout/FloatingNavbar.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import TechStackMarquee from '@/components/home/TechStackMarquee.vue'
import ScrollRevealManifesto from '@/components/home/ScrollRevealManifesto.vue'
import AboutTextPlayground from '@/components/home/AboutTextPlayground.vue'
import SelectedWorks from '@/components/home/SelectedWorks.vue'
import ArchiveDirectory from '@/components/home/ArchiveDirectory.vue'
</script>

<template>
  <div class="min-h-screen bg-white">
    <FloatingNavbar />
    <main>
      <HeroSection />
      <TechStackMarquee />
      <ScrollRevealManifesto />
      <AboutTextPlayground />
      <SelectedWorks />
      <ArchiveDirectory />
    </main>
  </div>
</template>
