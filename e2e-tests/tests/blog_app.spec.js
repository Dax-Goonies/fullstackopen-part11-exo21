const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helpers')

// Set the testing environment
describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'daxtest',
        name: 'Dax Test',
        password: 'salasana'
      }
    })
    await page.goto('http://localhost:5173')
  })

  // Test login
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()

      await loginWith(page, 'daxtest', 'salasana')
      await expect(page.getByRole('button', { name: 'logout'})).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, 'daxtest', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  // Test features while logged in
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, 'daxtest', 'salasana')
    })

    // Test that a new blog can be created
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('E2E Test Blog')
      await page.getByTestId('author').fill('Dax')
      await page.getByTestId('url').fill('https://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByRole('link', { name: 'E2E Test Blog by Dax' })).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('link', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('E2E Test Blog')
        await page.getByTestId('author').fill('Dax')
        await page.getByTestId('url').fill('https://example.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByRole('link', { name: 'E2E Test Blog by Dax' }).waitFor()
      })

      // Test that a blog can be liked
      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'E2E Test Blog by Dax' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('1 likes', { exact: false })).toBeVisible()
      })

      // Test that a blog can be deleted by the creator of the blog
      test('the creator can delete their own blog', async ({ page }) => {
        await page.getByRole('link', { name: 'E2E Test Blog by Dax' }).click()

        page.on('dialog', async dialog => {
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByRole('link', { name: 'E2E Test Blog by Dax' })).not.toBeVisible()
      })
    })
  })
})