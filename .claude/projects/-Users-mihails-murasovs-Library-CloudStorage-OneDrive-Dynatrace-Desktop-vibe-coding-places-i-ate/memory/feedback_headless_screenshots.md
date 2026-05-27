---
name: feedback-headless-screenshots
description: Use Playwright scripts for headless screenshots instead of Chrome DevTools MCP to avoid opening visible browser windows
metadata:
  type: feedback
---

Use a Playwright script for taking screenshots of the app, not the Chrome DevTools MCP. The MCP opens a visible browser window that doesn't close automatically.

**Why:** The Chrome DevTools MCP opens a real Chrome window on the user's screen, which is disruptive. Playwright can run fully headless.

**How to apply:** When previewing UI changes, write a quick inline Playwright script (e.g. `npx playwright test --project=chromium` with a temp script, or use the Playwright API directly via `node -e "..."`) to navigate and screenshot in headless mode. Save screenshots to `/tmp` and read them with the Read tool.
