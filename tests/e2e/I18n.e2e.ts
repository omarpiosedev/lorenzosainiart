import { expect, test } from '@playwright/test';

test.describe('I18n', () => {
  test.describe('Language Switching', () => {
    test('should switch language from English to French using dropdown and verify text on the homepage', async ({
      page,
    }) => {
      await page.goto('/en');

      await expect(
        page.getByRole('heading', {
          name: 'Portfolio - Creative Work Showcase',
        }),
      ).toBeVisible();

      await page.getByLabel('lang-switcher').selectOption('fr');

      await expect(
        page.getByRole('heading', {
          name: 'Portfolio - Vitrine de Travaux Créatifs',
        }),
      ).toBeVisible();
    });

    test('should switch language from English to French using URL and verify text on the about page', async ({
      page,
    }) => {
      await page.goto('/en/about');

      await expect(page.getByText('Welcome to our About page!')).toBeVisible();

      await page.goto('/fr/about');

      await expect(
        page.getByText(
          'Bienvenue sur notre page À propos ! Nous sommes une équipe de passionnés et dévoués à la création de logiciels.',
        ),
      ).toBeVisible();
    });
  });
});
