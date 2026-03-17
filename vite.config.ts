import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Serves index.html for all 404s so History API routing works on direct
  // navigation and page refresh without a dedicated server rewrite rule.
  appType: 'spa',
})
