<script setup lang="ts">
type Props = {
  /**
   * Tooltip text content.
   * Keep it short; for rich content prefer slot-based approach later.
   */
  text: string
  /**
   * Optional visual style.
   */
  tone?: 'default' | 'info' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'default',
})

const tooltipId = useId()
</script>

<template>
  <span class="tooltip" :data-tone="props.tone">
    <span
      class="tooltip__term"
      tabindex="0"
      role="button"
      :aria-describedby="tooltipId"
    >
      <slot />
    </span>

    <span :id="tooltipId" class="tooltip__bubble" role="tooltip">
      {{ props.text }}
    </span>
  </span>
</template>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.tooltip__term {
  cursor: help;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 0.18em;
  text-decoration-thickness: 0.1em;
  outline: none;
}

.tooltip__term:focus-visible {
  outline: 2px solid color-mix(in oklab, #2563eb 60%, white);
  outline-offset: 2px;
  border-radius: 4px;
}

.tooltip__bubble {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  transform: translateX(-50%);
  z-index: 50;

  width: max-content;
  max-width: min(320px, calc(100vw - 24px));
  padding: 0.55rem 0.7rem;
  border-radius: 10px;
  border: 1px solid color-mix(in oklab, rgba(0, 0, 0, 0.32) 35%, white);

  background: rgba(17, 24, 39, 0.96);
  color: white;
  font-size: 0.875rem;
  line-height: 1.25rem;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);

  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 120ms ease, transform 120ms ease, visibility 120ms ease;
}

.tooltip__bubble::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  border: 7px solid transparent;
  border-top-color: rgba(17, 24, 39, 0.96);
}

.tooltip__term:hover + .tooltip__bubble,
.tooltip__term:focus + .tooltip__bubble,
.tooltip__term:focus-visible + .tooltip__bubble {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-2px);
}

.tooltip[data-tone="info"] .tooltip__bubble {
  background: rgba(30, 64, 175, 0.96);
}

.tooltip[data-tone="info"] .tooltip__bubble::after {
  border-top-color: rgba(30, 64, 175, 0.96);
}

.tooltip[data-tone="warning"] .tooltip__bubble {
  background: rgba(146, 64, 14, 0.96);
}

.tooltip[data-tone="warning"] .tooltip__bubble::after {
  border-top-color: rgba(146, 64, 14, 0.96);
}
</style>
