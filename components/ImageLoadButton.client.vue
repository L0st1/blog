<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 请求地址，默认可改为站点内任意图片路径 */
    src?: string
  }>(),
  { src: '/img/t-proto.png' },
)

const imageSrc = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

let blobUrl: string | null = null

function revokeBlob() {
  if (blobUrl) {
    URL.revokeObjectURL(blobUrl)
    blobUrl = null
  }
}

async function loadImage() {
  if (loading.value) {
    return
  }
  loading.value = true
  error.value = null
  revokeBlob()
  imageSrc.value = null

  try {
    const res = await fetch(props.src)
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`)
    }
    const blob = await res.blob()
    blobUrl = URL.createObjectURL(blob)
    imageSrc.value = blobUrl
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  }
  finally {
    loading.value = false
  }
}

onUnmounted(() => {
  revokeBlob()
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <button
      type="button"
      class="inline-flex w-fit items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      :disabled="loading"
      @click="loadImage"
    >
      {{ loading ? '加载中…' : '加载图片示例' }}
    </button>
    <p
      v-if="error"
      class="text-sm text-red-600 dark:text-red-400"
      role="alert"
    >
      {{ error }}
    </p>
    <img
      v-if="imageSrc"
      :src="imageSrc"
      alt=""
      class="max-h-[min(70vh,32rem)] max-w-full rounded-md border border-zinc-200 object-contain dark:border-zinc-700"
    >
  </div>
</template>
