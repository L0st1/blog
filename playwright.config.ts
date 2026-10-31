import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL
if (!baseURL) {
  throw new Error('请显式设置 PLAYWRIGHT_BASE_URL，指向已核对版本的被测前端')
}

export default defineConfig({
  testDir: './tests/candidates',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  timeout: 30_000,
  outputDir: './artifacts/playwright/results',
  reporter: [
    ['list'],
    ['json', { outputFile: './artifacts/playwright/report.json' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
