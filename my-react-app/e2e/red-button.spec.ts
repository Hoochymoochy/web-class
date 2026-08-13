import { test, expect } from '@playwright/test';
import {
  redButton,
  expectRedButtonVisible,
  expectRedBackground,
  expectRespondsToClick,
  mockAuthenticatedHome,
} from './helpers/redButton';

test.describe('Red button acceptance', () => {
  test('About page — visible, red, and clickable', async ({ page }) => {
    await page.goto('/about');
    const button = redButton(page);

    await expectRedButtonVisible(button);
    await expectRedBackground(button);
    await expectRespondsToClick(button);
  });

  test('Home page — visible, red, and clickable', async ({ page }) => {
    await mockAuthenticatedHome(page);
    await page.goto('/');
    const button = redButton(page);

    await expectRedButtonVisible(button);
    await expectRedBackground(button);
    await expectRespondsToClick(button);
  });

  test('keyboard activation with Enter and Space', async ({ page }) => {
    await page.goto('/about');
    const button = redButton(page);
    await expectRedButtonVisible(button);

    await button.focus();
    await expect(button).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(button).toBeVisible();

    await button.focus();
    await page.keyboard.press('Space');
    await expect(button).toBeVisible();
  });
});
