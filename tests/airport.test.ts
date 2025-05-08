import { test, expect } from "@playwright/test";
// At the top of airport.test.ts
test.describe.configure({ mode: 'serial' });


export function airportTests() {
    test("Admin registers, logs in and fetches JFK", async ({ request }) => {
      test.setTimeout(15_000);
  
      // Step 1: Register admin user
      const adminUser = {
        name: "Admin User",
        email: "admin@test.com",
        phone: "0987654321",
        password: "adminpass",  
        dateOfBirth: "1980-01-01",
        isAdmin: true, 
      };
  
      const registerRes = await request.post("/api/user/register", {
        data: adminUser,
      });
  
      const registerJson = await registerRes.json();
      console.log("Register response:", registerJson); 
      expect(registerRes.status()).toBe(201);
      expect(registerJson.error).toBeNull();
  
      // Step 2: Login admin user
      const loginRes = await request.post("/api/user/login", {
        data: {
          email: adminUser.email,    
          password: adminUser.password, 
        },
      });
  
      const loginJson = await loginRes.json();
      console.log("Login response:", loginJson); 
      expect(loginRes.status()).toBe(200); 
      expect(loginJson.error).toBeNull();
  
      const token = loginJson.data.token;
      expect(token).toBeDefined();
  
      // Step 3: Fetch JFK airport
      const fetchAirport = async (code: string) => {
        const res = await request.get(`/api/airports/fetch/${code}`, {
          headers: { "auth-token": token },
        });
  
        const raw = await res.text();
        console.log(`${code} Airport API Raw Response:`, raw);
  
        let json;
        try {
          json = JSON.parse(raw);
        } catch {
          throw new Error(`Response for ${code} was not valid JSON`);
        }
  
        expect(res.ok()).toBeTruthy();
        expect(json.error).toBeFalsy();
      };
  
      await fetchAirport("JFK");
    });
  }
  