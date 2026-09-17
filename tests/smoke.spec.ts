import { test as base, expect } from "@playwright/test";

const test = base.extend<{ runtimeErrors: void }>({
  runtimeErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await use();
    expect(errors, "uncaught browser errors").toEqual([]);
  }, { auto: true }],
});

test.describe("smoke", () => {
  test("home renders", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/The Goel Family of Banda/);
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Family tree", exact: true })).toBeVisible();
  });

  test("people index renders a known person", async ({ page }) => {
    await page.goto("/people");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Aditi Goel")).toBeVisible();
  });

  test("person page renders Aditi", async ({ page }) => {
    await page.goto("/people/aditi-goel");
    await expect(page.getByRole("heading", { name: /Aditi Goel/ })).toBeVisible();
    await expect(page.getByText(/How you're related/i)).toHaveCount(0);
  });

  test("tree page renders", async ({ page }) => {
    await page.goto("/family-tree");
    await expect(page.getByRole("heading", { name: /The tree/ })).toBeVisible();
  });

  test("stories index", async ({ page }) => {
    await page.goto("/stories");
    await expect(page.getByRole("link", { name: /The 2000 split/ })).toBeVisible();
  });
});
