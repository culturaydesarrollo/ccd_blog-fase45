import { test, expect, type Page } from '@playwright/test';

/**
 * Tests de interacción del visor 3D (`/visor/un-clavo/`).
 *
 * Cubren los controles que la bitácora dejó pendientes: auto-rotación, zoom,
 * centrar, realidad aumentada, compartir, pantalla completa y teclado.
 * El modelo se sirve desde `dist/` por `astro preview`.
 */

const URL_VISOR = '/visor/un-clavo/';

type Orbita = { theta: number; phi: number; radius: number };

async function abrirVisor(page: Page) {
  await page.goto(URL_VISOR);
  // El script de la página espera a `loaded` con un vigilante cada 400 ms;
  // esperar el estado "ok" es la señal observable de que todo está en marcha.
  await expect(page.locator('#estado')).toHaveAttribute('data-state', 'ok', {
    timeout: 60_000,
  });
}

async function orbita(page: Page): Promise<Orbita> {
  return page.evaluate(() => {
    const mv = document.getElementById('mv') as HTMLElement & {
      getCameraOrbit(): { theta: number; phi: number; radius: number };
    };
    return mv.getCameraOrbit();
  });
}

async function autoRotate(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const mv = document.getElementById('mv') as HTMLElement & { autoRotate: boolean };
    return mv.autoRotate;
  });
}

/** Apaga la auto-rotación para que las medidas de ángulo no deriven. */
async function apagarRotacion(page: Page) {
  if ((await page.locator('#btnRotar').getAttribute('aria-pressed')) === 'true') {
    await page.locator('#btnRotar').click();
  }
  await expect(page.locator('#btnRotar')).toHaveAttribute('aria-pressed', 'false');
}

test.describe('visor Un clavo: carga', () => {
  test('el modelo carga y se publican las dimensiones', async ({ page }) => {
    await abrirVisor(page);

    await expect(page.locator('#estado')).toHaveText(/Modelo cargado/);
    await expect(page.locator('#datoMedidas')).toHaveText(
      /^\d+,\d{2} × \d+,\d{2} × \d+,\d{2} m$/
    );
    await expect(page.locator('#progreso')).toHaveAttribute('data-visible', 'false');
  });
});

test.describe('visor Un clavo: auto-rotación', () => {
  test('arranca rotando y el botón conmuta aria-pressed y mv.autoRotate', async ({ page }) => {
    await abrirVisor(page);

    const btn = page.locator('#btnRotar');
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(await autoRotate(page)).toBe(true);

    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    expect(await autoRotate(page)).toBe(false);

    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(await autoRotate(page)).toBe(true);
  });
});

test.describe('visor Un clavo: zoom', () => {
  test('acercar reduce el radio y alejar lo aumenta', async ({ page }) => {
    await abrirVisor(page);

    const base = (await orbita(page)).radius;
    expect(base).toBeGreaterThan(0);

    await page.locator('#btnAcercar').click();
    const acercado = (await orbita(page)).radius;
    expect(acercado).toBeLessThan(base);

    await page.locator('#btnAcercar').click();
    const masCercano = (await orbita(page)).radius;
    expect(masCercano).toBeLessThan(acercado);

    await page.locator('#btnAlejar').click();
    const alejado = (await orbita(page)).radius;
    expect(alejado).toBeGreaterThan(masCercano);
  });

  test('el zoom no se sale de los límites (0,5× … 2,2×)', async ({ page }) => {
    await abrirVisor(page);
    const base = (await orbita(page)).radius;

    for (let i = 0; i < 12; i++) await page.locator('#btnAcercar').click();
    expect((await orbita(page)).radius).toBeGreaterThanOrEqual(base * 0.5 - 1e-6);

    for (let i = 0; i < 20; i++) await page.locator('#btnAlejar').click();
    expect((await orbita(page)).radius).toBeLessThanOrEqual(base * 2.2 + 1e-6);
  });
});

test.describe('visor Un clavo: centrar', () => {
  test('centrar restaura la órbita inicial y avisa', async ({ page }) => {
    await abrirVisor(page);

    const base = (await orbita(page)).radius;
    expect(base).toBeGreaterThan(0);

    await page.locator('#btnAcercar').click();
    await page.locator('#btnAcercar').click();
    expect((await orbita(page)).radius).toBeLessThan(base);

    await page.locator('#btnCentrar').click();

    await expect(page.locator('#aviso')).toHaveText('Cámara centrada');
    await expect(page.locator('#aviso')).toHaveAttribute('data-visible', 'true');
    await expect
      .poll(async () => (await orbita(page)).radius, { timeout: 10_000 })
      .toBeCloseTo(base, 3);
  });
});

test.describe('visor Un clavo: realidad aumentada', () => {
  test('sin soporte AR el botón queda deshabilitado con título explicativo', async ({
    page,
  }) => {
    await abrirVisor(page);
    // comprobarAR() corre al cargar y otra vez a los 1500 ms.
    await page.waitForTimeout(2_000);

    const btn = page.locator('#btnAR');
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute('title', /Chrome para Android/);
    await expect(btn).toHaveAttribute('title', /\.usdz/);
    await expect(page.locator('#datoAR')).toHaveText('no en este navegador');
  });

  test('el título del botón AR explica el caso de Firefox e iPhone', async ({ page }) => {
    await abrirVisor(page);
    await page.waitForTimeout(2_000);

    const title = await page.locator('#btnAR').getAttribute('title');
    expect(title).toContain('Firefox no la soporta');
    expect(title).toContain('.usdz');
  });
});

test.describe('visor Un clavo: compartir', () => {
  // `navigator.share` en Chrome escritorio abre el diálogo del sistema: en
  // headless cuelga y hace imposible probar el fallback. Se stubbea el
  // resultado para ejercitar cada rama del código de forma determinista.
  // Serial además: el portapapeles es del sistema y se comparte entre tests.
  test.describe.configure({ mode: 'serial' });

  test('sin Web Share el enlace se copia al portapapeles y se avisa', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, 'share', {
        value: undefined,
        configurable: true,
        writable: true,
      });
    });
    await abrirVisor(page);

    await page.locator('#btnCompartir').click();

    await expect(page.locator('#aviso')).toHaveText('Enlace copiado al portapapeles', {
      timeout: 10_000,
    });
    await expect(page.locator('#aviso')).toHaveAttribute('data-visible', 'true');

    const portapapeles = await page.evaluate(() => navigator.clipboard.readText());
    expect(portapapeles).toContain('/visor/un-clavo/');
  });

  test('si Web Share falla también se cae al portapapeles', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, 'share', {
        value: () => Promise.reject(new DOMException('cancelado', 'AbortError')),
        configurable: true,
        writable: true,
      });
    });
    await abrirVisor(page);

    await page.locator('#btnCompartir').click();

    await expect(page.locator('#aviso')).toHaveText('Enlace copiado al portapapeles', {
      timeout: 10_000,
    });
  });

  test('si Web Share funciona no se cae al portapapeles ni se avisa', async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __shareLlamado: number };
      w.__shareLlamado = 0;
      Object.defineProperty(Navigator.prototype, 'share', {
        value: () => {
          w.__shareLlamado += 1;
          return Promise.resolve();
        },
        configurable: true,
        writable: true,
      });
    });
    await abrirVisor(page);

    await page.locator('#btnCompartir').click();
    await page.waitForTimeout(1_000);

    // Se compartió de verdad y el fallback (portapapeles/aviso) no corrió.
    expect(
      await page.evaluate(() => (window as unknown as { __shareLlamado: number }).__shareLlamado)
    ).toBe(1);
    await expect(page.locator('#aviso')).not.toHaveAttribute('data-visible', 'true');
  });
});

test.describe('visor Un clavo: pantalla completa', () => {
  test('el aria-label cambia al entrar y salir', async ({ page }) => {
    await abrirVisor(page);

    const btn = page.locator('#btnPantalla');
    await expect(btn).toHaveAttribute('aria-label', 'Ver a pantalla completa');

    await btn.click();
    // En algunos entornos headless el navegador rechaza la pantalla
    // completa: en ese caso debe avisarse en lugar de fallar en silencio.
    const entro = await page.evaluate(() => !!document.fullscreenElement);
    if (entro) {
      await expect(btn).toHaveAttribute('aria-label', 'Salir de pantalla completa');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-label', 'Ver a pantalla completa');
    } else {
      await expect(page.locator('#aviso')).toHaveAttribute('data-visible', 'true', {
        timeout: 5_000,
      });
      await expect(page.locator('#aviso')).toHaveText(
        'El navegador no permitió la pantalla completa.'
      );
    }
  });
});

test.describe('visor Un clavo: teclado', () => {
  test('la vitrina es enfocable y las flechas giran la cámara, "0" la centra', async ({
    page,
  }) => {
    await abrirVisor(page);
    await apagarRotacion(page);

    // El manejador vive en #vitrina: el foco tiene que poder llegar ahí.
    const tabIndex = await page.locator('#vitrina').evaluate((el) => el.tabIndex);
    expect(tabIndex).toBeGreaterThanOrEqual(0);

    await page.locator('#vitrina').focus();
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('vitrina');

    const antes = await orbita(page);
    await page.keyboard.press('ArrowLeft');
    await expect.poll(async () => (await orbita(page)).theta).toBeLessThan(antes.theta);

    const girado = (await orbita(page)).theta;
    await page.keyboard.press('ArrowRight');
    await expect
      .poll(async () => (await orbita(page)).theta)
      .toBeCloseTo(girado + 0.12, 4);

    await page.keyboard.press('0');
    await expect(page.locator('#aviso')).toHaveText('Cámara centrada');
  });

  test('"+" acerca y "-" aleja desde el teclado', async ({ page }) => {
    await abrirVisor(page);
    await apagarRotacion(page);

    const base = (await orbita(page)).radius;
    await page.locator('#vitrina').focus();

    await page.keyboard.press('+');
    await expect.poll(async () => (await orbita(page)).radius).toBeLessThan(base);

    await page.keyboard.press('-');
    // 0,82 × 1,22 ≈ 1: vuelve al radio inicial con una tolerancia del 1 %.
    const vuelta = (await orbita(page)).radius;
    expect(Math.abs(vuelta - base)).toBeLessThan(base * 0.01);
  });
});
