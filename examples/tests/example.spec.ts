import { ConsoleMessage, expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/api/dummylogin/alice');
});

test('should load the example', async ({ baseURL, page }) => {
  const URL = process.env['BASE_URL'] ?? baseURL;
  console.info('Navigating to page:', URL);

  let errorLogs = 0;
  let testEnded: (value: string | PromiseLike<string>) => void;
  const waitForTestEnd = new Promise<string>((resolve) => {
    testEnded = resolve;
  });

  const handleMessage = async (msg: ConsoleMessage) => {
    const text = msg.text();
    console.log(msg.type(), '>>', text);
    if (msg.type() === 'error') {
      errorLogs += 1;
    }

    const lower = text.toLowerCase();
    // An extension example must emit a console log message ending by `is activated!`
    if (/is activated!$/.test(lower)) {
      testEnded(text);
    }
  };

  page.on('console', handleMessage);

  await page.goto(URL);

  await expect(page.locator('#jupyter-config-data')).toBeDefined();

  await waitForTestEnd;

  await page.pause();
  await expect(errorLogs).toEqual(0);
});
