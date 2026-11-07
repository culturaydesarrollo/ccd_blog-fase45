import { test, expect } from '@playwright/test';

/**
 * La portada debe mostrar la sección "Pieza interactiva" con el resumen
 * completo de la obra — el mismo texto que encabeza el visor — y el enlace
 * para abrirlo.
 */

const RESUMEN =
  /Escultura del artículo “Un clavo\.\.\. s\.o\.c - Ficción plástica” obra del año 1995, en tres dimensiones\. Gírala, acércala y —si tu móvil lo permite— colócala a escala real en tu espacio\./;

test.describe('portada: pieza interactiva', () => {
  test('la tarjeta del visor lleva el resumen completo de la obra', async ({ page }) => {
    await page.goto('/');

    const seccion = page.locator('.visor-section');
    await expect(seccion).toBeVisible();
    await expect(seccion.locator('#visor-heading')).toHaveText('Pieza interactiva');

    const tarjeta = seccion.locator('.featured-card');
    await expect(tarjeta.locator('.featured-badge')).toHaveText('Visor 3D');
    await expect(tarjeta.locator('p')).toHaveText(RESUMEN);
    await expect(tarjeta.locator('a[href="/visor/un-clavo/"].read-more')).toHaveText(
      'Abrir el visor →'
    );
  });
});
