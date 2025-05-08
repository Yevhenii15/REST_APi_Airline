import { test, expect } from "@playwright/test";

export function userTests() {
    test("Valid user registration and login info", async ({ request }) => {
      test.setTimeout(10_000);
  
      // Arrange: Register the user first
      const user = {
        name: "New User",
        email: "user@test.com",
        phone: "1234567890",
        password: "12345678",
        dateOfBirth: "1990-01-01"
      };
  
      // Register user
      const registerResponse = await request.post("/api/user/register", { data: user });
      const registerJson = await registerResponse.json();
  
      // Assert registration response
      expect(registerResponse.status()).toBe(201);
      expect(registerJson.error).toEqual(null);
  
      // Act: Now try to log in with the registered user
      const userCredentials = {
        email: "user@test.com",
        password: "12345678"
      };
  
      const loginResponse = await request.post("/api/user/login", { data: userCredentials });
      const loginJson = await loginResponse.json();
  
      
  
      // Assert login response
      expect(loginResponse.status()).toBe(200);
      expect(loginJson.data?.token).toBeDefined(); // Update this to access token inside `data`
      expect(loginJson.error).toEqual(null);
    });
  }
  