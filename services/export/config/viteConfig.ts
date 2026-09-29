/**
 * Generate vite.config.ts for exported project
 */

export const generateViteConfig = (): string => `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
})
`;
