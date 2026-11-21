<script setup lang="ts">
interface TechItem {
  name: string
  slug: string
}

const techStack: TechItem[] = [
  { name: 'Figma', slug: 'figma' },
  { name: 'Vue.js', slug: 'vuedotjs' },
  { name: 'Laravel', slug: 'laravel' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'Tailwind CSS', slug: 'tailwindcss' },
  { name: 'Flutter', slug: 'flutter' },
  { name: 'Firebase', slug: 'firebase' },
  { name: 'Supabase', slug: 'supabase' },
  { name: 'CodeIgniter', slug: 'codeigniter' },
  { name: 'MySQL', slug: 'mysql' },
  { name: 'Notion', slug: 'notion' },
  { name: 'GitHub', slug: 'github' },
]
</script>

<template>
  <section
    aria-label="Core Technologies and Tools"
    class="relative w-full bg-white py-8 sm:py-10 overflow-hidden border-y border-slate-100"
  >
    <!-- Left & Right Smooth Fade Masks -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent"
    />

    <!-- Infinite Marquee Track -->
    <div class="marquee-wrapper flex w-max">
      <div
        v-for="loop in 2"
        :key="loop"
        :aria-hidden="loop === 2"
        class="marquee-track flex shrink-0 items-center gap-10 sm:gap-14 pr-10 sm:pr-14"
      >
        <div
          v-for="tech in techStack"
          :key="`${loop}-${tech.slug}`"
          class="group flex items-center gap-2.5 text-slate-400 hover:text-[#090E1E] transition-colors duration-200 select-none"
        >
          <img
            :src="`https://cdn.simpleicons.org/${tech.slug}/64748b`"
            :alt="tech.name"
            loading="lazy"
            class="size-5 opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <span class="text-sm sm:text-base font-medium tracking-tight whitespace-nowrap">
            {{ tech.name }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-track {
  animation: marquee-scroll 30s linear infinite;
}

.marquee-wrapper:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>
