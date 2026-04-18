<script setup lang="ts">
/**
 * 为 article.prose 内的 <pre> 注入复制按钮与长代码块收起（>30 行默认收起）。
 * 样式见 assets/css/main.css `.code-copy-btn`、`.code-block-viewport`、`.code-collapse-toggle`。
 */
import { useClipboard } from '@vueuse/core'

const COLLAPSE_LINE_THRESHOLD = 30

const route = useRoute()
const { copy } = useClipboard()

function enhance() {
  document.querySelectorAll<HTMLElement>('article.prose pre').forEach((pre) => {
    if (pre.dataset.proseCodeEnhanced === 'true') {
      return
    }
    pre.dataset.proseCodeEnhanced = 'true'

    const codeEl = pre.querySelector('code')
    if (!codeEl) {
      return
    }

    const lineEls = codeEl.querySelectorAll('.line')
    const lineCount = lineEls.length > 0
      ? lineEls.length
      : (codeEl.textContent ?? '').split('\n').length || 1

    if (lineCount > COLLAPSE_LINE_THRESHOLD) {
      const viewport = document.createElement('div')
      viewport.className = 'code-block-viewport'
      pre.insertBefore(viewport, codeEl)
      viewport.appendChild(codeEl)
      pre.dataset.codeCollapsed = 'true'

      const toggle = document.createElement('button')
      toggle.type = 'button'
      toggle.className = 'code-collapse-toggle'
      toggle.textContent = `展开全部（${lineCount} 行）`
      toggle.addEventListener('click', () => {
        const collapsed = pre.dataset.codeCollapsed === 'true'
        if (collapsed) {
          pre.dataset.codeCollapsed = 'false'
          toggle.textContent = '收起'
        }
        else {
          pre.dataset.codeCollapsed = 'true'
          toggle.textContent = `展开全部（${lineCount} 行）`
        }
      })
      pre.appendChild(toggle)
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
