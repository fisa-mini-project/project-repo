import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  projects: [{ name: 'popup' }, { name: 'sidepanel' }],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: 'msedge',
    viewport: { width: 420, height: 600 },
  },
  webServer: {
    command: 'node tests/serve-build.js',
    url: 'http://127.0.0.1:4173/popup.html',
    reuseExistingServer: false,
  },
})
