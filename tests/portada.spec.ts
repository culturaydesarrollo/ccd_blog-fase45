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
    // Alcance al contenido de la tarjeta: la tarjeta ahora incluye también el
    // modal de biografía, que lleva su propio <p>.
    await expect(tarjeta.locator('.latest-card-content > p')).toHaveText(RESUMEN);

    // El título del artículo dentro del resumen es un hipervínculo a la pieza.
    const enlaceArticulo = tarjeta.locator('p a[href="/un-clavo-soc-ficcion-plastica/"]');
    await expect(enlaceArticulo).toHaveText('“Un clavo... s.o.c - Ficción plástica”');
    await expect(enlaceArticulo).toBeVisible();

    await expect(tarjeta.locator('a[href="/visor/un-clavo/"].read-more')).toHaveText(
      'Abrir el visor →'
    );
  });

  test('el enlace del resumen lleva al artículo que nombra', async ({ page }) => {
    await page.goto('/');

    await page
      .locator('.visor-section .featured-card p a[href="/un-clavo-soc-ficcion-plastica/"]')
      .click();

    await expect(page).toHaveURL(/\/un-clavo-soc-ficcion-plastica\/$/);
    await expect(page.locator('h1')).toContainText('Ficción Plástica');
  });
});
