<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowRight01Icon, Download01Icon } from '@hugeicons/core-free-icons'
import MotionButton from '@/components/ui/MotionButton.vue'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useDriveAsset } from '@/composables/useDriveAsset'

import bgHeroSection from '@/assets/hero/bg-hero-section.svg'
import cardHero1st from '@/assets/hero/card-hero-1st.svg'
import cardHero3rd from '@/assets/hero/card-hero-3rd.svg'
import cardHeroGrade from '@/assets/hero/card-hero-grade.svg'

const portfolioStore = usePortfolioStore()
const { getDriveDownloadUrl } = useDriveAsset()

const cvDownloadLink = computed(() => getDriveDownloadUrl(portfolioStore.siteSettings.cvDriveUrl))
</script>

<template>
  <section
    class="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-6 pt-28 pb-16 sm:px-8 sm:pt-32 sm:pb-20"
  >
    <!-- Custom Figma SVG Background -->
    <img
      :src="bgHeroSection"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
    />

    <!-- Centered Editorial Content -->
    <div class="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
      <!-- Concise Eyebrow -->
      <p class="text-xs sm:text-sm font-normal tracking-wide text-[#2454E8] mb-4 sm:mb-5">
        Auf Fajri . Product Designer & Developer
      </p>

      <!-- Dual-Font Headline (Outfit + Times New Roman Italic) -->
      <h1
        class="text-[34px] sm:text-5xl md:text-[64px] tracking-tight leading-[1.1] text-[#090E1E]"
      >
        <span class="block font-sans font-semibold"> A clearer vision for </span>
        <span class="block font-serif italic font-normal text-[#2454E8] mt-1">
          digital products that work.
        </span>
      </h1>

      <!-- Sub-headline -->
      <p
        class="mt-5 sm:mt-6 max-w-md sm:max-w-xl text-sm sm:text-base font-normal text-slate-700 leading-relaxed"
      >
        4x National UI/UX Finalist and Informatics student. Turning user research into clean design
        systems and production code.
      </p>

      <!-- 2 Clean CTA Buttons -->
      <div class="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
        <MotionButton
          href="#works"
          :tap-scale="0.97"
          class="bg-[#090E1E] hover:bg-[#162040] text-white h-11 sm:h-12 px-6 sm:px-7 text-xs sm:text-sm font-medium shadow-sm"
        >
          <span>Explore Works</span>
          <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4" />
        </MotionButton>

        <MotionButton
          :href="cvDownloadLink"
          target="_blank"
          rel="noopener noreferrer"
          :tap-scale="0.97"
          class="bg-white/90 hover:bg-white text-[#090E1E] h-11 sm:h-12 px-6 sm:px-7 text-xs sm:text-sm font-medium border border-slate-200/90 shadow-xs"
        >
          <span>Download CV</span>
          <HugeiconsIcon :icon="Download01Icon" class="size-4 text-[#2454E8]" />
        </MotionButton>
      </div>
    </div>

    <!-- 3 Fanned Achievement SVG Cards (Mobile-Safe Widths) -->
    <div
      class="relative z-10 mt-12 sm:mt-16 w-full max-w-3xl mx-auto flex items-end justify-center select-none"
    >
      <!-- Left Card: 3rd Place -->
      <motion.div
        :initial="{ opacity: 0, y: 24, rotate: -4 }"
        :animate="{ opacity: 1, y: 0, rotate: -4 }"
        :while-hover="{ y: -10, rotate: -2, scale: 1.03, zIndex: 30 }"
        :transition="{ type: 'spring', stiffness: 320, damping: 24 }"
        class="relative z-10 -mr-4 sm:-mr-8 mb-1 w-[112px] sm:w-[195px] md:w-[215px] drop-shadow-md cursor-pointer"
      >
        <img
          :src="cardHero3rd"
          alt="3rd Place BEM FTI Competition"
          class="w-full h-auto block pointer-events-none"
        />
      </motion.div>

      <!-- Center Card: 2nd Place -->
      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :while-hover="{ y: -10, scale: 1.04 }"
        :transition="{ type: 'spring', stiffness: 320, damping: 24, delay: 0.06 }"
        class="relative z-20 w-[128px] sm:w-[215px] md:w-[235px] drop-shadow-xl cursor-pointer"
      >
        <img
          :src="cardHero1st"
          alt="2nd Place IT FEST FILKOM UB 2026"
          class="w-full h-auto block pointer-events-none"
        />
      </motion.div>

      <!-- Right Card: 3.94 GPA -->
      <motion.div
        :initial="{ opacity: 0, y: 24, rotate: 4 }"
        :animate="{ opacity: 1, y: 0, rotate: 4 }"
        :while-hover="{ y: -10, rotate: 2, scale: 1.03, zIndex: 30 }"
        :transition="{ type: 'spring', stiffness: 320, damping: 24, delay: 0.12 }"
        class="relative z-10 -ml-4 sm:-ml-8 mb-1 w-[112px] sm:w-[195px] md:w-[215px] drop-shadow-md cursor-pointer"
      >
        <img
          :src="cardHeroGrade"
          alt="3.94 GPA Recently"
          class="w-full h-auto block pointer-events-none"
        />
      </motion.div>
    </div>
  </section>
</template>
