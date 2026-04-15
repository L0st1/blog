<script setup lang="ts">
import type { ContentCollectionItem } from '@nuxt/content'

import 'katex/dist/katex.min.css'

type Post = ContentCollectionItem & {
  date?: string
  tags?: string[]
}

const route = useRoute()
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryCollection('content').path(`/${slug}`).first()) as { data: Ref<Post | null> }

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}
</script>

<template>
  <div class="page-container text-zinc-900 dark:text-zinc-100">
    <!-- 左侧边栏 -->
    <aside class="sidebar sidebar-left pr-4">
      <NuxtLink v-slot="{ navigate }" to="/" custom>
        <InspiraInteractiveHoverButton
          text="返回首页"
          class="w-full max-w-full"
          @click="navigate"
        />
      </NuxtLink>
      <div class="sidebar-content mt-4">
        <h3>文章信息</h3>
        <p>发布日期: {{ post?.date }}</p>
        <p>标签: {{ post?.tags?.join(', ') }}</p>
      </div>
    </aside>

    <!-- 中间主内容区域 -->
    <main class="main-content">
      <article v-if="post" class="prose">
        <h1>{{ post.title }}</h1>
        <p class="summary text-zinc-600 dark:text-zinc-400">
          {{ post.description }}
        </p>
        <!-- Nuxt Content 渲染组件 -->
        <ContentRenderer :value="post" />
      </article>
    </main>

    <!-- 右侧边栏 -->
    <aside class="sidebar sidebar-right pl-4">
      <div class="sidebar-content">
        <h3>目录</h3>
        <nav class="toc">
          <ul v-if="post?.body?.toc?.links">
            <li v-for="link in post.body.toc.links" :key="link.id">
              <a :href="`#${link.id}`">{{ link.text }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  gap: 2rem;
}

/* 侧边栏通用样式 */
.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.sidebar-content {
  position: sticky;
  top: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background: rgb(244 244 245 / 0.8);
  border: 1px solid rgb(228 228 231);
}

.dark .sidebar-content {
  background: rgb(24 24 27 / 0.5);
  border-color: rgb(63 63 70);
}

.sidebar h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: inherit;
}

/* 左侧边栏 */
.sidebar-left {
  border-right: 1px solid rgb(228 228 231);
}

.dark .sidebar-left {
  border-right-color: rgb(63 63 70);
}

/* 右侧边栏 */
.sidebar-right {
  border-left: 1px solid rgb(228 228 231);
}

.dark .sidebar-right {
  border-left-color: rgb(63 63 70);
}

/* 中间主内容区 */
.main-content {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.prose {
  max-width: 65ch;
  margin: 0 auto;
}

.summary {
  font-style: italic;
}

.markdown-body {
  line-height: 1.8;
}

/* 目录样式 */
.toc {
  font-size: 0.9rem;
}

.toc a {
  color: rgb(37 99 235);
}

.dark .toc a {
  color: rgb(96 165 250);
}

.toc a:hover {
  text-decoration: underline;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .sidebar-left {
    display: none; /* 小屏幕隐藏左侧边栏 */
  }
}

@media (max-width: 900px) {
  .page-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .sidebar-right {
    order: -1; /* 目录移到上面 */
  }
}
</style>
