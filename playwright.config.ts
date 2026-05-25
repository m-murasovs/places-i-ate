import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3737',
        storageState: 'e2e/.auth/user.json',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'setup',
            testMatch: /global\.setup\.ts/,
            use: { storageState: undefined },
        },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup'],
            teardown: 'teardown',
        },
        {
            name: 'teardown',
            testMatch: /global\.teardown\.ts/,
            use: { storageState: undefined },
        },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3737',
        reuseExistingServer: true,
        env: {
            E2E_TEST: 'true',
            E2E_SECRET_TOKEN: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
        },
    },
});
