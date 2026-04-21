<script setup lang="ts">
type Props = {
  /**
   * 指针持续停留在区域上的毫秒数后才揭示。
   */
  revealAfterMs?: number
  /**
   * 遮罩上的提示文案。
   */
  hint?: string
  /**
   * 遮罩模糊强度（像素），过大可能影响性能。
   */
  blurPx?: number
}

const props = withDefaults(defineProps<Props>(), {
  revealAfterMs: 900,
  hint: '悬停片刻以查看',
  blurPx: 14,
})

const revealed = ref(false)
let revealTimer: number | null = null

function clearRevealTimer() {
  if (revealTimer !== null) {
    clearTimeout(revealTimer)
    revealTimer = null
  }
}

function scheduleReveal() {
  if (revealed.value) {
    return
  }
  clearRevealTimer()
  revealTimer = window.setTimeout(() => {
    revealed.value = true
    revealTimer = null
  }, props.revealAfterMs)
}

function cancelPendingReveal() {
  if (revealed.value) {
    return
  }
  clearRevealTimer()
}

function revealNow() {
  clearRevealTimer()
  revealed.value = true
}

onBeforeUnmount(() => {
  clearRevealTimer()
})
</script>

<template>
  <div class="spoiler" :class="{ 'spoiler--revealed': revealed }">
    <!-- 未揭示时 inert：避免焦点进入遮罩下的可聚焦元素 -->
    <div class="spoiler__body" :inert="!revealed">
      <slot />
    </div>

    <button
      v-if="!revealed"
      type="button"
      class="spoiler__mask"
      :style="{ '--spoiler-blur': `${props.blurPx}px` }"
      tabindex="-1"
      aria-hidden="true"
      @pointerenter="scheduleReveal"
      @pointerleave="cancelPendingReveal"
      @pointerdown.prevent.stop
    >
      <span class="spoiler__hint">{{ props.hint }}</span>
    </button>

    <button
      v-if="!revealed"
      type="button"
      class="spoiler__a11y"
      aria-label="揭示剧透内容"
      @click="revealNow"
    >
      揭示
    </button>
  </div>
</template>

<style scoped>
.spoiler {
  position: relative;
  display: block;
  max-width: 100%;
  border-radius: 10px;
  overflow: clip;
}

.spoiler__body {
  user-select: none;
  filter: grayscale(1);
  transition: filter 200ms ease;
}

.spoiler--revealed .spoiler__body {
  user-select: auto;
  filter: none;
}

.spoiler__mask {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  padding: 0.85rem 1rem;
  margin: 0;
  border: 0;
  border-radius: inherit;
  cursor: progress;

  color: rgb(250 250 250);
  font-size: 0.875rem;
  line-height: 1.35;
  text-align: center;

  background: color-mix(in oklab, rgb(17 24 39) 78%, transparent);
  backdrop-filter: blur(var(--spoiler-blur, 14px));
  -webkit-backdrop-filter: blur(var(--spoiler-blur, 14px));
}

.spoiler__hint {
  max-width: min(280px, 100%);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

.spoiler__a11y {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 键盘用户：可见的“揭示”入口，避免无法悬停的设备完全不可用 */
.spoiler__a11y:focus,
.spoiler__a11y:focus-visible {
  position: static;
  width: auto;
  height: auto;
  margin: 0.5rem 0 0;
  clip: auto;
  overflow: visible;
  white-space: normal;
  padding: 0.4rem 0.65rem;
  border-radius: 8px;
  background: rgb(37 99 235);
  color: white;
  font-size: 0.8125rem;
  cursor: pointer;
  z-index: 3;
}
</style>
