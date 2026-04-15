---
title: bfcache可能导致新部署的代码不生效
date: 2026-01-14
tags: [bfcache]
description: 前端应用成功发布新版本后，bfcache有可能导致新代码不生效
---

::blur-reveal{class="pt-8" :duration="0.75"}

bfcache（Back/Forward Cache）可能让用户在前进 / 后退导航时看到的是旧页面状态，从而看不到新部署的代码，但这不是一次重新加载失败，而是浏览器的刻意设计行为。

[bfcache](https://web.dev/articles/bfcache?hl=zh-cn) 恢复的是“内存快照”，不是“最新资源”

解决方案：

手动检测
```js
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // 来自 bfcache
    console.log('Restored from bfcache')
  }
})
```

版本校验
```js
window.addEventListener('pageshow', async (e) => {
  if (e.persisted) {
    const latest = await fetch('/version.json', { cache: 'no-store' })
    const { version } = await latest.json()

    if (version !== __APP_VERSION__) {
      location.reload()
    }
  }
})
```
::
