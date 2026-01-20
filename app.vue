<template>
  <NuxtPage />
</template>

<style>
/* MathJax 公式样式 */
mjx-container {
  display: inline-block;
  overflow-x: hidden;
  overflow-y: hidden;
  max-width: 100%;
  /* 使用 middle 让容器垂直居中于行框，再微调 */
  vertical-align: middle;
}

mjx-container[display="true"] {
  display: block;
  text-align: center;
  margin: 1em 0;
}

mjx-container svg {
  max-width: 100%;
  height: auto;                   /* 让 SVG 自然撑高，不要固定 */
  vertical-align: middle;         /* SVG 本身也居中 */
  shape-rendering: geometricPrecision;
  text-rendering: geometricPrecision;
}

/* 客户端渲染模式：隐藏未排版的 TeX，排版完成后显示 */
.mathjax-loading .math-tex {
  visibility: hidden;
}
.mathjax-loading .math-tex::after {
  content: '';
  display: inline-block;
  width: 1em;
  height: 1em;
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 200% 100%;
  animation: mathjax-shimmer 1.2s infinite;
  border-radius: 3px;
  visibility: visible;
}
@keyframes mathjax-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 排版完成后 */
.mathjax-ready .math-tex,
.mathjax-ready mjx-container {
  visibility: visible;
}
</style>