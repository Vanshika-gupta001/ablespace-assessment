import { test, expect } from '@playwright/test';

test.describe('Guest login and tasks', () => {
  test('lets a guest log in and land on the tasks list', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByText("Let's get back on track"),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Continue as Guest' }).click();

    await expect(page).toHaveURL(/\/tasks$/);
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
    await expect(page.getByText('To Do')).toBeVisible();
    await expect(page.getByText('Doing')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('On Hold')).toBeVisible();
  });

  test('creates a task and sees it appear in the list', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Continue as Guest' }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    await page.getByRole('button', { name: 'Add Task' }).click();
    await page.getByLabel('Title').fill('Playwright smoke test task');
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(
      page.getByText('Playwright smoke test task'),
    ).toBeVisible();
  });

  test('switches to board view and back', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Continue as Guest' }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    await page.getByRole('button', { name: 'Board' }).click();
    // Board view renders the same status columns as draggable Kanban lanes.
    await expect(page.getByText('To Do')).toBeVisible();

    await page.getByRole('button', { name: 'List' }).click();
    await expect(page.getByText('To Do')).toBeVisible();
  });

  test('opens a task detail page and adds a comment', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Continue as Guest' }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    await page.getByRole('button', { name: 'Add Task' }).click();
    await page.getByLabel('Title').fill('Task with a comment');
    await page.getByRole('button', { name: 'Create task' }).click();

    await page.getByText('Task with a comment').click();
    await expect(page).toHaveURL(/\/tasks\/.+/);

    await page.getByPlaceholder('Add a comment...').fill('First update');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('First update')).toBeVisible();
  });

  test('toggles the theme from Settings and it persists after reload', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Continue as Guest' }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/settings$/);

    const toggle = page.getByRole('button', {
      name: /Switch to (dark|light) theme/,
    });
    await toggle.click();
    const htmlClass = await page.locator('html').getAttribute('class');

    await page.reload();
    await expect(page.locator('html')).toHaveClass(htmlClass ?? '');
  });
});
