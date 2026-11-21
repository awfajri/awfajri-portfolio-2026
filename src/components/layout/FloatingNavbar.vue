<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Search01Icon,
  Layers01Icon,
  Menu01Icon,
  Cancel01Icon,
  Copy01Icon,
  Tick01Icon,
} from '@hugeicons/core-free-icons'
import { useUiStore } from '@/stores/uiStore'
import { usePortfolioStore } from '@/stores/portfolioStore'

const uiStore = useUiStore()
const portfolioStore = usePortfolioStore()

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isEmailCopied = ref(false)

const navLinks = [
  { label: 'Works', href: '#works' },
  { label: 'Archive', href: '#archive' },
  { label: 'About', href: '#about' },
  { label: 'Honors', href: '#honors' },
]

function handleScroll() {
  isScrolled.value = window.scrollY > 24
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(portfolioStore.siteSettings.contactEmail)
    isEmailCopied.value = true
    setTimeout(() => {
      isEmailCopied.value = false
    }, 2000)
  } catch {
    // Fallback silent
  }
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isMobileMenuOpen.value = false
    uiStore.setCommandOpen(!uiStore.isCommandOpen)
  }
  if (e.shiftKey && e.key.toLowerCase() === 'i') {
    const activeTag = (e.target as HTMLElement)?.tagName
    if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
      e.preventDefault()
      uiStore.toggleXRay()
    }
  }
  if (e.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header class="fixed top-4 sm:top-5 inset-x-0 z-50 px-4 sm:px-8 pointer-events-none">
    <nav
      aria-label="Primary Navigation"
      :class="[
        'mx-auto max-w-5xl rounded-full px-5 sm:px-7 h-14 flex items-center justify-between transition-all duration-300 pointer-events-auto',
        isScrolled || isMobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md border border-slate-200/85 shadow-sm'
          : 'bg-transparent border border-transparent',
      ]"
    >
      <!-- Brand -->
      <a
        href="#"
        @click="closeMobileMenu"
        class="text-base font-semibold tracking-tight text-slate-950 focus:outline-none"
      >
        Auf Fajri<span class="text-[#2454E8]">.</span>
      </a>

      <!-- Desktop Center Links -->
      <ul class="hidden md:flex items-center gap-8 text-sm font-normal text-slate-600">
        <li v-for="link in navLinks" :key="link.href">
          <a :href="link.href" class="transition-colors duration-200 hover:text-[#2454E8]">
            {{ link.label }}
          </a>
        </li>
      </ul>

      <!-- Desktop Right Actions -->
      <div class="hidden md:flex items-center gap-2">
        <button
          type="button"
          @click="uiStore.setCommandOpen(true)"
          class="inline-flex items-center gap-2 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
        >
          <HugeiconsIcon :icon="Search01Icon" class="size-3.5" />
          <span>Search</span>
          <span class="text-slate-400 text-[11px]">⌘K</span>
        </button>

        <button
          type="button"
          @click="uiStore.toggleXRay()"
          :class="[
            'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer',
            uiStore.isXRayActive
              ? 'bg-[#6D28D9] text-white'
              : 'bg-[#090E1E] hover:bg-[#2454E8] text-white',
          ]"
        >
          <HugeiconsIcon :icon="Layers01Icon" class="size-3.5" />
          <span>Inspect</span>
        </button>
      </div>

      <!-- Mobile Hamburger Trigger -->
      <button
        type="button"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Toggle Menu"
        class="md:hidden inline-flex size-9 items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <HugeiconsIcon :icon="isMobileMenuOpen ? Cancel01Icon : Menu01Icon" class="size-5" />
      </button>
    </nav>

    <!-- Mobile Dropdown Menu (Clean Editorial Stack) -->
    <AnimatePresence>
      <motion.div
        v-if="isMobileMenuOpen"
        :initial="{ opacity: 0, y: -10, scale: 0.98 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: -8, scale: 0.98 }"
        :transition="{ duration: 0.2 }"
        class="md:hidden mx-auto mt-2.5 max-w-5xl rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/10 p-6 pointer-events-auto"
      >
        <!-- Vertical Navigation List -->
        <ul class="flex flex-col gap-4">
          <li v-for="link in navLinks" :key="link.href">
            <a
              :href="link.href"
              @click="closeMobileMenu"
              class="block text-xl font-medium tracking-tight text-slate-900 hover:text-[#2454E8] transition-colors"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>

        <hr class="my-5 border-slate-100" />

        <!-- Secondary Mobile Quick Actions -->
        <div class="flex flex-col gap-3">
          <div class="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              @click="
                () => {
                  closeMobileMenu()
                  uiStore.setCommandOpen(true)
                }
              "
              class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <HugeiconsIcon :icon="Search01Icon" class="size-3.5" />
              <span>Quick Search</span>
            </button>

            <button
              type="button"
              @click="
                () => {
                  uiStore.toggleXRay()
                  closeMobileMenu()
                }
              "
              :class="[
                'flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium cursor-pointer transition-colors',
                uiStore.isXRayActive ? 'bg-[#6D28D9] text-white' : 'bg-[#090E1E] text-white',
              ]"
            >
              <HugeiconsIcon :icon="Layers01Icon" class="size-3.5" />
              <span>{{ uiStore.isXRayActive ? 'Inspect On' : 'Inspect Mode' }}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </header>
</template>
