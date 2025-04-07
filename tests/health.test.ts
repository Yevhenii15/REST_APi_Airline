import { test, expect } from "@playwright/test";

export default function health() {
test("Health check", async ({ request }) => {
    const response = await request.get("/api");
    const text = await response.text();

    expect(response.status()).toBe(200);
    expect(text).toBe("Welcome to the API AIRLINES");
});
}
