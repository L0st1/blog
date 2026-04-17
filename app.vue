<script setup lang="ts">
useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
    <div class="fixed top-4 right-4 z-50 flex items-center gap-2">
      <ColorModeToggle />
      <GitHubProfileLink />
    </div>
    <ProseCodeCopy />
    <NuxtPage />
  </div>
</template>
