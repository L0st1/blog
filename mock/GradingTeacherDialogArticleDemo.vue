<script setup lang="ts">
/**
 * 阅卷教师弹窗演示 — 实现位于 mock/；Markdown 通过 components/content 薄包装注册。
 */
import GradingTeacherDialogDemo from '~/mock/GradingTeacherDialogDemo.vue'

const dialogRef = ref<InstanceType<typeof GradingTeacherDialogDemo> | null>(null)
const lastResult = ref('')

function openDemo() {
  dialogRef.value?.open({
    context: { paperId: 'demo-paper-1', title: '模拟试卷' },
    onConfirm(selected, ctx) {
      lastResult.value = JSON.stringify(
        {
          count: selected.length,
          names: selected.map(t => t.userName ?? t.tenantUserId),
          ctx,
        },
        null,
        2,
      )
    },
  })
}
</script>

<template>
  <ClientOnly>
    <div class="not-prose my-6 rounded-lg border border-zinc-200 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
      <p class="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
        以下为本地模拟数据，无真实接口；与文中弹窗交互一致。
      </p>
      <button
        type="button"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        @click="openDemo"
      >
        打开弹窗
      </button>
      <GradingTeacherDialogDemo ref="dialogRef" />
      <section v-if="lastResult" class="mt-4 rounded border border-zinc-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-950">
        <p class="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          上次确认结果（onConfirm）
        </p>
        <pre class="max-h-48 overflow-auto text-xs text-zinc-800 dark:text-zinc-200">{{ lastResult }}</pre>
      </section>
    </div>
    <template #fallback>
      <div class="not-prose my-6 rounded-lg border border-zinc-200 p-4 text-sm text-zinc-500 dark:border-zinc-700">
        交互演示仅在客户端加载…
      </div>
    </template>
  </ClientOnly>
</template>
