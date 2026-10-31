import { expect, test } from '@playwright/test'

// 数据来自本文件显式夹具，仅替换Nuxt首页payload中的posts；不替换DOM或产品分栏/排序逻辑。
const sections = [
  { id: 'engineering', title: 'Engineering' },
  { id: 'thinking', title: 'Thinking' },
  { id: 'life', title: 'Life' },
] as const

for (const scenario of ['populated', 'empty'] as const) {
  test(`首页完整行为 [${scenario}]`, async ({ page }) => {
    let payloads = 0
    await page.route(url => url.pathname === '/_payload.json', async (route) => {
      const response = await route.fetch()
      const payload: unknown[] = await response.json()
      expect(Array.isArray(payload), '明确Nuxt devalue payload格式').toBe(true)
      const owner = payload.find(value => value && typeof value === 'object' && !Array.isArray(value) && 'posts' in value) as { posts: number } | undefined
      expect(owner, '必须找到真实posts数据槽，不能跳过夹具').toBeTruthy()
      expect(Array.isArray(payload[owner!.posts]), 'posts必须为明确文章数组').toBe(true)
      const indices: number[] = []
      const stringRef = (value: string) => payload.push(value) - 1
      if (scenario === 'populated') {
        for (const section of sections) {
          for (const [suffix, date] of [['older', '2025-01-01'], ['newer', '2025-02-02']] as const) {
            const path = suffix === 'older' ? `/${section.id}` : `/${section.id}/newer`
            const item = { title: stringRef(`${section.title} ${suffix}`), path: stringRef(path), date: stringRef(date), description: stringRef('本机候选专用夹具') }
            indices.push(payload.push(item) - 1)
          }
        }
        // 相似前缀及非首页分栏均不得混入，不能用总数替代逐栏归属断言。
        for (const path of ['/engineering-other/ignored', '/thinking-other/ignored', '/life-other/ignored', '/writing/ignored']) {
          indices.push(payload.push({ title: stringRef('不得归属'), path: stringRef(path), date: stringRef('2026-01-01') }) - 1)
        }
      }
      payload[owner!.posts] = indices
      payloads += 1
      await route.fulfill({ response, contentType: 'application/json', body: JSON.stringify(payload) })
    })
    // 从实际文章页通过真实首页入口进入，避免首页SSR属性与客户端夹具混用。
    await page.goto('/blog/engineering/bfcache')
    const homeUrl = new URL('/', page.url()).href
    await page.getByRole('button', { name: /返回首页/ }).click()
    await expect(page).toHaveURL(homeUrl)
    await expect.poll(() => payloads, { message: '必须实际消费明确测试数据' }).toBeGreaterThan(0)
    await expect(page.getByRole('heading', { name: 'L0st1', exact: true })).toBeVisible()
    await expect(page.locator('.home .sections > section')).toHaveCount(3)
    await expect(page.locator('.home h2')).toHaveText(sections.map(section => section.title))
    for (const section of sections) {
      const region = page.getByRole('region', { name: section.title, exact: true })
      await expect(region).toBeVisible()
      if (scenario === 'empty') {
        await expect(region.locator('.post-link')).toHaveCount(0)
        await expect(region.getByText('暂无文章', { exact: true })).toBeVisible()
      }
      else {
        const links = region.locator('.post-link')
        await expect(links).toHaveText([`${section.title} newer`, `${section.title} older`])
        await expect(links.nth(0)).toHaveAttribute('href', `/blog/${section.id}/newer`)
        await expect(links.nth(1)).toHaveAttribute('href', `/blog/${section.id}`)
        await expect(region.locator('time')).toHaveText(['2025-02-02', '2025-01-01'])
        await expect(region.getByText('暂无文章', { exact: true })).toHaveCount(0)
      }
    }
    await expect(page.locator('.home').getByText('不得归属', { exact: true })).toHaveCount(0)
  })
}
