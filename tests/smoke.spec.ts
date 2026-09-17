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

  test("tree page renders", async ({ page }, testInfo) => {
    await page.goto("/family-tree");
    await expect(page.getByRole("heading", { name: /The tree/ })).toBeVisible();
    const tree = page.getByRole("application", { name: /Family tree/ });
    await expect(tree).toBeVisible();
    const scene = tree.locator(":scope > div").first();
    const scale = () => scene.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a);
    await expect(scene).toHaveCSS("transform", /^matrix\(/);
    const initialScale = await scale();
    await page.getByRole("button", { name: "Zoom in", exact: true }).click();
    await expect.poll(scale).toBeCloseTo(initialScale * 1.25, 2);
    await page.getByRole("button", { name: "Fit to view", exact: true }).click();
    await expect.poll(scale).toBeCloseTo(initialScale, 5);
    await tree.scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath("tree-fitted.png") });

    const visibleCard = await tree.locator("a[href^='/people/']").evaluateAll((links) => {
      const viewport = links[0]?.closest("[data-tree-viewport]")?.getBoundingClientRect();
      if (!viewport) return null;
      const link = links.find((element) => {
        const box = element.getBoundingClientRect();
        return box.left >= viewport.left && box.right <= viewport.right &&
          box.top >= Math.max(viewport.top, 0) && box.bottom <= Math.min(viewport.bottom, innerHeight);
      });
      return link?.getAttribute("href") ?? null;
    });
    expect(visibleCard, "a fitted tree card must be navigable").not.toBeNull();
    await tree.locator(`a[href="${visibleCard}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${visibleCard}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("stories index", async ({ page }) => {
    await page.goto("/stories");
    await expect(page.getByRole("link", { name: /The 2000 split/ })).toBeVisible();
  });
});
