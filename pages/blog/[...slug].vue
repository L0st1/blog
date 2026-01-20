<script setup lang="ts">
import type { PostMeta } from '~/content/schema'

interface PostResponse {
  slug: string
  meta: PostMeta
  html: string
}

const route = useRoute()
// 处理数组形式的 slug，如 ['2026', 'hello-world']
const slug = Array.isArray(route.params.slug) 
  ? route.params.slug.join('/') 
  : route.params.slug

const { data: post } = await useAsyncData<PostResponse>(`post-${slug}`, () =>
  $fetch(`/api/posts/${slug}`)
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}
</script>

<template>
  <div class="page-container">
    <!-- 左侧边栏 -->
    <aside class="sidebar sidebar-left">
      <div class="sidebar-content">
        <h3>文章信息</h3>
        <p>发布日期: {{ post?.meta.date }}</p>
        <p>标签: {{ post?.meta.tags?.join(', ') }}</p>
        <!-- 在这里添加更多左侧内容 -->
      </div>
    </aside>

    <!-- 中间主内容区域 - Markdown 渲染区 -->
    <main class="main-content">
      <article v-if="post" class="prose">
        <h1>{{ post.meta.title }}</h1>
        <p class="summary">{{ post.meta.summary }}</p>
        <!-- Markdown 渲染内容 -->
        <div class="markdown-body" v-html="post.html" />
      </article>
    </main>

    <!-- 右侧边栏 -->
    <aside class="sidebar sidebar-right">
      <div class="sidebar-content">
        <h3>目录</h3>
        <!-- 这里可以添加文章目录 -->
        <nav class="toc">
          <p>文章目录将显示在这里</p>
        </nav>
        
        <h3>相关文章</h3>
        <!-- 这里可以添加相关文章推荐 -->
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
  background: #f9f9f9;
  border-radius: 8px;
}

.sidebar h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
}

/* 左侧边栏 */
.sidebar-left {
  border-right: 1px solid #eee;
}

/* 右侧边栏 */
.sidebar-right {
  border-left: 1px solid #eee;
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
  color: #666;
  font-style: italic;
}

.markdown-body {
  line-height: 1.8;
}

/* 目录样式 */
.toc {
  font-size: 0.9rem;
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
