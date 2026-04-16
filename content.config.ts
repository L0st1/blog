import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        /** 路由 slug：小写、多词用 `-` 连接，可含多级如 `engineering/foo-bar` */
        path: z.string().regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/,
        ),
        description: z.string().optional(),
        date: z.string(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  },
})
