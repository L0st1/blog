<script setup lang="ts">
/**
 * Blur reveal: single Motion wrapper around the default slot.
 * Motion applies opacity/filter on the wrapper div only — inner nodes do not get
 * inline animation styles; that is expected (same as Framer Motion / motion-v).
 *
 * In Markdown, use Nuxt Content MDC blocks (::blur-reveal ... ::), not raw HTML
 * <BlurReveal>, or the parser may not close the component and will nest the rest
 * of the article inside it.
 */
import { Motion } from 'motion-v'

interface Props {
  duration?: number
  blur?: string
  yOffset?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1,
  blur: '20px',
  yOffset: 20,
})

function getInitial() {
  return {
    opacity: 0,
    filter: `blur(${props.blur})`,
    y: props.yOffset,
  }
}

function getAnimate() {
  return {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
  }
}
</script>

<template>
  <div :class="props.class">
    <Motion
      as="div"
      :initial="getInitial()"
      :animate="getAnimate()"
      :transition="{
        duration: props.duration,
        ease: 'easeInOut',
        delay: 0,
      }"
    >
      <slot />
    </Motion>
  </div>
</template>
