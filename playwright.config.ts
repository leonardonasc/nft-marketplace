import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'http://127.0.0.1:4173',
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'bun run dev --host 127.0.0.1',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: true,
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
