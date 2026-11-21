<script setup lang="ts">
import { motion } from 'motion-v'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  href?: string
  target?: string
  rel?: string
  tapScale?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  tapScale: 0.97,
})
</script>

<template>
  <motion.a
    v-if="href"
    :href="href"
    :target="target"
    :rel="rel"
    :while-hover="{ scale: 1.02 }"
    :while-press="{ scale: tapScale }"
    :transition="{ type: 'spring', stiffness: 450, damping: 25 }"
    :class="
      cn(
        'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors cursor-pointer select-none',
        props.class,
      )
    "
  >
    <slot />
  </motion.a>

  <motion.button
    v-else
    type="button"
    :while-hover="{ scale: 1.02 }"
    :while-press="{ scale: tapScale }"
    :transition="{ type: 'spring', stiffness: 450, damping: 25 }"
    :class="
      cn(
        'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors cursor-pointer select-none',
        props.class,
      )
    "
  >
    <slot />
  </motion.button>
</template>
