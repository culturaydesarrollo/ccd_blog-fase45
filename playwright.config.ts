import { defineConfig } from '@playwright/test';

// Tests de interacción del visor 3D. Se ejecutan contra el build real
// (`dist/`), igual que lo que sirve Cloudflare Pages, no contra el dev server.
export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    // Chrome del sistema: sin descargar Chromium ni duplicar el navegador.
    channel: 'chrome',
    headless: true,
    // Sin permisos de portapapeles el fallback de "compartir" cambia de mensaje.
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
