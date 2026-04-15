<script setup lang="ts">
/**
 * 为 article.prose 内的 <pre> 注入复制按钮；样式见 assets/css/main.css `.code-copy-btn`。
 * 使用 VueUse useClipboard 复制源码文本。
 */
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const { copy } = useClipboard()

function enhance() {
  document.querySelectorAll<HTMLElement>('article.prose pre').forEach((pre) => {
    if (pre.dataset.copyEnhanced === 'true') {
      return
    }
    pre.dataset.copyEnhanced = 'true'

    const codeEl = pre.querySelector('code')
    if (!codeEl) {
      return
    }

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'code-copy-btn'
    btn.textContent = '复制'

    btn.addEventListener('click', async () => {
      const text = codeEl.textContent ?? ''
      await copy(text)
      btn.textContent = '已复制'
      window.setTimeout(() => {
        btn.textContent = '复制'
      }, 2000)
    })

    pre.appendChild(btn)
  })
}

function scheduleEnhance() {
  nextTick(() => {
    requestAnimationFrame(() => {
      enhance()
    })
  })
}

onMounted(scheduleEnhance)

watch(
  () => route.fullPath,
  scheduleEnhance,
  { flush: 'post' },
)
</script>

<template>
  <span aria-hidden="true" />
</template>
