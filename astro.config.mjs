// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL / BASE_PATH can be overridden at build time (see README).
// Until the custom domain is live, the site is served from
// https://<user>.github.io/maxlov-portfolio/, which needs BASE_PATH=/maxlov-portfolio
export default defineConfig({
  site: process.env.SITE_URL || 'https://maxlov.dev',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
});
