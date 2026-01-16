<script setup lang="ts">
import type { Post } from '~/content/loader'

const route = useRoute()
// 处理数组形式的 slug，如 ['2026', 'hello-world']
const slug = Array.isArray(route.params.slug) 
  ? route.params.slug.join('/') 
  : route.params.slug

const { data: post } = await useAsyncData<Post>(`post-${slug}`, () =>
  $fetch(`/api/posts/${slug}`)
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}
</script>

<template>
  <article v-if="post">
    <h1>{{ post.meta.title }}</h1>
    <p>{{ post.meta.summary }}</p>
    <pre>{{ post.body }}</pre>
  </article>
</template>
