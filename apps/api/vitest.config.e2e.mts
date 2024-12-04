import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
    isolate: true,
  },
  plugins: [tsconfigPaths()],
})
