import { test, expect } from "@playwright/test";


export default function userRegister() {
test("Valid user reg info", async ({ request }) => {
    test.setTimeout(10_000);

    // Arange
    const user = {
    name: "New User",
    email: "user@test.com",
    phone: "1234567890",
    password: "12345678",
    dateOfBirth: "1990-01-01"
    };
    
    // Act
    const response = await request.post("/api/user/register", { data: user });
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(201);
    expect(json.error).toEqual(null);
});

}







