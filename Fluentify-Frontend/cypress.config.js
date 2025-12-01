// cypress.config.js (example)
import { defineConfig } from 'cypress'
export default defineConfig({
  e2e: {
    baseUrl: 'https://fluentify-rho.vercel.app',
    env: { API_URL: 'https://fluentify-rho.vercel.app' } // optional
  }
})
