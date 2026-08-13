import { expect, type Locator, type Page } from '@playwright/test';

export const RED_BUTTON_TEST_ID = 'red-button';

export function redButton(page: Page): Locator {
  return page.getByTestId(RED_BUTTON_TEST_ID);
}

export async function expectRedButtonVisible(button: Locator) {
  await expect(button).toBeVisible();
  await expect(button).toHaveRole('button');
}

export async function expectRedBackground(button: Locator) {
  const { r, g, b } = await button.evaluate((el) => {
    const { backgroundColor } = window.getComputedStyle(el);
    const match = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) {
      return { r: 0, g: 0, b: 0 };
    }
    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
    };
  });

  expect(r, `expected red background, got rgb(${r}, ${g}, ${b})`).toBeGreaterThan(120);
  expect(g, `green channel too high for red button: ${g}`).toBeLessThan(120);
  expect(b, `blue channel too high for red button: ${b}`).toBeLessThan(120);
}

export async function expectRespondsToClick(button: Locator) {
  await expect(button).toBeEnabled();
  await button.click({ trial: true });
  await button.click();
  await expect(button).toBeVisible();
}

export async function mockAuthenticatedHome(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'qa-test-token');
    localStorage.setItem('userId', 'qa-test-user');
  });

  await page.route('**/api/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ tasks: [] }),
    });
  });
}
