import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

/** Smoke tests run against the real static export in out/ (run `npm run build` first). */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  // Walkthrough tests run axe once per step (5 scans), which can exceed 30s under full parallel load.
  timeout: 60_000,
  forbidOnly: Boolean(process.env.CI),
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "phone", use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 760 }, hasTouch: true } },
  ],
  webServer: {
    command: `python3 -m http.server ${PORT} --bind 127.0.0.1 --directory out`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "ignore",
  },
});
