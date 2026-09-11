import { defineConfig } from '@playwright/test';
import config from './data/config.json';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  workers: 1,
  use: {
    baseURL: config.baseUrl,
  },
});
