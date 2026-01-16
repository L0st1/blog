<script setup lang="ts">
import type { Post } from '~/content/loader'

const route = useRoute()
const { data: post } = await useAsyncData<Post>(`post-${route.params.slug}`, () =>
  $fetch(`/api/posts/${route.params.slug}`)
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