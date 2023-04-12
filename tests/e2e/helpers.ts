import { Permissions as TPermissions } from '$app/common/hooks/permissions/useHasPermission';
import { Page } from '@playwright/test';

export async function logout(page: Page) {
  await page.goto('/logout');

  await page.waitForURL('**/login');
}

export async function login(
  page: Page,
  email = 'user@example.com',
  password = 'password'
) {
  await page.waitForTimeout(500);
  await page.goto('/login');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByLabel('Password').press('Enter');

  await page.waitForURL('**/dashboard');
}

export function permissions(page: Page) {
  const clear = async (email = 'permissions@example.com') => {
    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('link', { name: 'User Management' }).click();
    await page.locator('#filter').fill(email);

    await page.waitForTimeout(1100);

    const tableBody = page.locator('tbody').first();

    await tableBody.getByRole('link').first().click();

    await page.getByLabel('Current password*').fill('password');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Permissions' }).click();

    for (const checkbox of await page.locator('input[type=checkbox]').all()) {
      await checkbox.uncheck();
    }
  };

  const save = async () => {
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Successfully updated user').isVisible();

    await page.waitForTimeout(500);
  };

  const set = async (...permissions: TPermissions[]) => {
    for (const p of permissions) {
      await page.check(`[data-cy=${p}]`);
    }
  };

  return { clear, save, set };
}
