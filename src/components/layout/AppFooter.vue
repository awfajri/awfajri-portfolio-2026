<script setup lang="ts">
import { ref, computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  ArrowUpRight01Icon,
  Copy01Icon,
  Tick01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons'
import MotionButton from '@/components/ui/MotionButton.vue'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useDriveAsset } from '@/composables/useDriveAsset'

const portfolioStore = usePortfolioStore()
const { getDriveImageUrl, getDriveDownloadUrl } = useDriveAsset()

const isEmailCopied = ref(false)

const bannerBgUrl = computed(() =>
  getDriveImageUrl(portfolioStore.siteSettings.figmaBannerDriveUrl),
)

const cvDownloadLink = computed(() => getDriveDownloadUrl(portfolioStore.siteSettings.cvDriveUrl))

async function copyContactEmail() {
  try {
    await navigator.clipboard.writeText(portfolioStore.siteSettings.contactEmail)
    isEmailCopied.value = true
    setTimeout(() => {
      isEmailCopied.value = false
    }, 2200)
  } catch {
    // Fallback silent
  }
}

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/awfajri' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/auf-fajri-ramadhani-556528274' },
  { label: 'Email', href: `mailto:${portfolioStore.siteSettings.contactEmail}` },
]
</script>

<template>
  <footer class="w-full bg-white px-6 pt-10 pb-12 sm:px-8 sm:pt-16">
    <div class="mx-auto max-w-5xl">
      <!-- Horizontal CTA Banner Card (Supports Figma Banner from Google Drive) -->
      <div
        class="relative overflow-hidden rounded-[2rem] bg-[#090E1E] text-white px-7 py-12 sm:px-14 sm:py-16"
      >
        <!-- Optional Figma Banner Image from Google Drive -->
        <img
          v-if="bannerBgUrl"
          :src="bannerBgUrl"
          alt=""
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <!-- Clean Readability Overlay -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#090E1E] via-[#090E1E]/60 to-transparent"
        ></div>
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090E1E]/80 via-transparent to-transparent"
        ></div>
        <div class="relative z-10 max-w-2xl">
          <p class="text-xs sm:text-sm font-medium tracking-wide text-blue-300">
            Let's Collaborate
          </p>

          <h2
            class="mt-3 text-3xl sm:text-4xl md:text-[42px] font-medium tracking-tight leading-[1.12] text-white"
          >
            Have a product to design or
            <span class="font-serif italic font-normal text-blue-300"> build together? </span>
          </h2>

          <p class="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Open for product design internships, front-end engineering roles, and selected freelance
            collaborations.
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3.5">
            <MotionButton
              @click="copyContactEmail"
              :tap-scale="0.97"
              class="bg-white hover:bg-blue-50 text-[#090E1E] h-11 px-6 text-sm font-medium"
            >
              <HugeiconsIcon
                :icon="isEmailCopied ? Tick01Icon : Copy01Icon"
                :class="['size-4', isEmailCopied ? 'text-emerald-600' : 'text-[#2454E8]']"
              />
              <span>{{
                isEmailCopied ? 'Email Copied' : portfolioStore.siteSettings.bannerCtaText
              }}</span>
            </MotionButton>

            <MotionButton
              :href="cvDownloadLink"
              target="_blank"
              rel="noopener noreferrer"
              :tap-scale="0.97"
              class="bg-white/10 hover:bg-white/20 text-white border border-white/20 h-11 px-6 text-sm font-medium"
            >
              <HugeiconsIcon :icon="Download01Icon" class="size-4" />
              <span>Download CV</span>
            </MotionButton>
          </div>
        </div>
      </div>

      <!-- Minimalist Bottom Bar -->
      <div
        class="mt-10 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <a href="#" class="text-base font-semibold tracking-tight text-[#090E1E]">
            Auf Fajri<span class="text-[#2454E8]">.</span>
          </a>
          <p class="mt-1 text-xs text-slate-500">
            © 2026 Auf Fajri Ramadhani. Built with Vue 3 & TypeScript.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 hover:text-[#2454E8] transition-colors"
          >
            <span>{{ social.label }}</span>
            <HugeiconsIcon :icon="ArrowUpRight01Icon" class="size-3.5 opacity-60" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
