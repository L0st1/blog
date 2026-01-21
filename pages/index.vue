<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('content').order('date', 'DESC').all())
</script>

<template>
  <div>
    <h1>博客文章</h1>
    <ul v-if="posts && posts.length">
      <li v-for="post in posts" :key="post.path">
        <NuxtLink :to="`/blog${post.path}`">
          {{ post.title }}
        </NuxtLink>
        <p v-if="post.description">
          {{ post.description }}
        </p>
      </li>
    </ul>
    <p v-else>
      暂无文章
    </p>
  </div>
</template>
