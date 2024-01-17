import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Your setupNodeEvents code
    },
    specPattern: 'integration/**/*.ts',
    supportFile: false,
  },
});