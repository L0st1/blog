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

/** Nuxt Content 的 toc.links 为树；depth 用于缩进展示 h2→h4（无 h3 时 h4 会挂在上一级下） */
interface TocLink {
  id: string
  text: string
  children?: TocLink[]
}

function flattenTocLinks(links: TocLink[] | undefined, depth = 0): { id: string, text: string, depth: number }[] {
  if (!links?.length) {
    return []
  }
  const out: { id: string, text: string, depth: number }[] = []
  for (const link of links) {
    out.push({ id: link.id, text: link.text, depth })
    if (link.children?.length) {
      out.push(...flattenTocLinks(link.children, depth + 1))
    }
  }
  return out
}

const tocRows = computed(() =>
  flattenTocLinks(post.value?.body?.toc?.links as TocLink[] | undefined),
)
</script>

<template>
  <!-- 窄屏侧栏隐藏时：与 app.vue 中主题切换 + GitHub（fixed right-4，两枚 w-10 + gap-2）左侧对齐 -->
  <NuxtLink
    to="/"
    class="fixed top-4 right-[calc(1rem+2.5rem+0.5rem+2.5rem+0.5rem)] z-50 hidden h-10 max-w-[min(11rem,calc(100vw-9rem))] items-center justify-center truncate rounded-full border border-zinc-200 bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-sm backdrop-blur-md transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:bg-zinc-800 max-[1200px]:inline-flex"
  >
    返回首页
  </NuxtLink>
  <div class="page-container text-zinc-900 dark:text-zinc-100">
    <!-- 左侧边栏 -->
    <aside class="sidebar sidebar-left self-start sticky top-8 pr-4">
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
        <!-- <h1>{{ post.title }}</h1>
        <p class="summary text-zinc-600 dark:text-zinc-400">
          {{ post.description }}
        </p> -->
        <!-- Nuxt Content 渲染组件 -->
        <ContentRenderer :value="post" />
      </article>
    </main>

    <!-- 右侧边栏 -->
    <aside class="sidebar sidebar-right self-start sticky top-16 pl-4">
      <div class="sidebar-content">
        <h3>快速定位</h3>
        <nav class="toc">
          <ul v-if="tocRows.length" class="toc-list">
            <li
              v-for="row in tocRows"
              :key="row.id"
              class="toc-row"
              :style="{ paddingLeft: `calc(${row.depth} * 0.65rem)` }"
            >
              <a :href="`#${row.id}`">{{ row.text }}</a>
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

.toc-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.toc-row {
  margin: 0.2rem 0;
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
    display: none;
  }
}
</style>
