<script lang="ts" setup>
/**
 * Inspira UI — InteractiveHoverButton（样式按本项目 Uno/zinc 主题微调）
 * https://github.com/unovue/inspira-ui/blob/main/app/components/inspira/ui/interactive-hover-button/InteractiveHoverButton.vue
 */
import { cn } from '@inspira-ui/plugins'
import { ref } from 'vue'

interface Props {
  text?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Button',
})

const buttonRef = ref<HTMLButtonElement>()
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    :class="
      cn(
        'group relative w-auto cursor-pointer overflow-hidden border border-zinc-200/90 rounded-full bg-white p-2 px-6 text-center font-semibold text-zinc-900 shadow-sm transition-colors duration-200 hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900/95 dark:text-zinc-100 dark:shadow-[0_1px_2px_0_rgb(0_0_0/0.35)] dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:active:bg-zinc-800/90',
        props.class,
      )
    "
  >
    <div class="flex items-center gap-2">
      <div
        class="size-2 scale-100 rounded-lg bg-blue-100 transition-all duration-300 group-hover:scale-[100.8] dark:bg-gray-100"
      />
      <span
        class="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
      >
        {{ text }}
      </span>
    </div>

    <div
      class="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 text-blue-600 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100 dark:text-blue-400"
    >
      <span class="whitespace-nowrap">{{ text }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-arrow-right"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </div>
  </button>
</template>
