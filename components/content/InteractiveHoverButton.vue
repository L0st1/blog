<script setup lang="ts">
/**
 * Inspira 按钮 — 供 Markdown MDC 使用（须放在 components/content/ 才会被 Content 注册）。
 * 块语法示例：
 * ::interactive-hover-button{text="一个按钮" class="w-full" message="keep it up"}
 * ::
 *
 * 说明：MDC 里不能写 @click="..."；需要交互时用 `message` 在客户端 alert（演示用）。
 */
import InspiraInteractiveHoverButton from '~/components/inspira/InteractiveHoverButton.vue'

const props = withDefaults(
  defineProps<{
    text?: string
    class?: string
    /** 若设置，则在点击时用 window.alert 显示（仅客户端） */
    message?: string
  }>(),
  { text: 'Button' },
)

function handleClick() {
  if (!import.meta.client || !props.message) {
    return
  }
  // 演示用：MDC 中无法绑定自定义回调
  // eslint-disable-next-line no-alert -- demo for content authors
  window.alert(props.message)
}
</script>

<template>
  <InspiraInteractiveHoverButton
    :text="props.text"
    :class="props.class"
    @click="handleClick"
  />
</template>
