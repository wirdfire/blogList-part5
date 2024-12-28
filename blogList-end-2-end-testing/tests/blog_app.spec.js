const { test, expect, describe, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset'); // Adjust URL as needed
        await request.post('http://localhost:3003/api/users', {
            data: {
                username: 'testuser',
                password: 'password'
            },
        });
        await page.goto('http://localhost:5173');
    });

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('Log in to application')).toBeVisible();
    });

    describe('Login', () => {
        test.only('succeeds with correct credentials', async ({ page }) => {
            await page.fill('input[name="username"]', 'testuser');
            await page.fill('input[name="password"]', 'password');
            await page.click('button', { name: 'login' });

            await expect(page.getByText('testuser logged in')).toBeVisible();
        });

        test('fails with wrong credentials', async ({ page }) => {
            await page.fill('input[name="username"]', 'testuser');
            await page.fill('input[name="password"]', 'wrongpassword');
            await page.click('button', { name: 'login' });

            await expect(page.getByText('invalid username or password')).toBeVisible();
            await expect(page.getByText('invalid username or password')).toHaveCSS('color', 'rgb(255, 0, 0)');
        });

        describe('When logged in', () => {
            beforeEach(async ({ page }) => {
                await page.goto('http://localhost:5173');
                await page.fill('input[name="username"]', 'testuser');
                await page.fill('input[name="password"]', 'password');
                await page.click('button', { name: 'login' });
            });

            test('a new blog can be created', async ({ page }) => {
                await page.click('button', { name: 'new blog' });
                await page.fill('input[name="title"]', 'Test Blog Title');
                await page.fill('input[name="author"]', 'Test Author');
                await page.fill('input[name="url"]', 'http://testblog.com');
                await page.click('button', { name: 'save' });

                await expect(page.getByText('Test Blog Title Test Author')).toBeVisible();
            });

            test('a blog can be liked', async ({ page }) => {
                await page.click('button', { name: 'view' });
                await page.click('button', { name: 'like' });

                await expect(page.getByText('likes 1')).toBeVisible();
            });

            test('user can delete a blog', async ({ page }) => {
                await page.click('button', { name: 'view' });
                page.on('dialog', async (dialog) => {
                    await dialog.accept();
                });
                await page.click('button', { name: 'remove' });

                await expect(page.getByText('Test Blog Title Test Author')).not.toBeVisible();
            });

            test('only the creator sees the delete button', async ({ page }) => {
                await page.click('button', { name: 'view' });

                const deleteButton = page.locator('button', { name: 'remove' });
                await expect(deleteButton).toBeVisible();

                // Simulate another user
                await page.goto('http://localhost:5173');
                await page.fill('input[name="username"]', 'anotheruser');
                await page.fill('input[name="password"]', 'password');
                await page.click('button', { name: 'login' });

                await page.click('button', { name: 'view' });
                await expect(deleteButton).not.toBeVisible();
            });

        });

    });
});
