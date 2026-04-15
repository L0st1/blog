<script setup lang="ts">
/**
 * Inspira UI Blur Reveal — for use in Markdown (Nuxt Content).
 * @see https://inspira-ui.com/docs/en/components/text-animations/blur-reveal
 *
 * Prefer MDC block syntax (parses reliably; raw HTML tags can swallow the rest of the file):
 * ::blur-reveal{class="p-8" :duration="0.75"}
 * Your paragraph text (markdown OK).
 * ::
 */
import InspiraBlurReveal from '~/components/inspira/IBlurReveal.vue'

type Props = {
  duration?: number
  blur?: string
  yOffset?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 0.75,
  blur: '10px',
  yOffset: 20,
})
</script>

<template>
  <InspiraBlurReveal
    :duration="props.duration"
    :blur="props.blur"
    :y-offset="props.yOffset"
    :class="props.class"
  >
    <slot />
  </InspiraBlurReveal>
</template>
