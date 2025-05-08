import { test, expect } from "@playwright/test";

export function routeTests() {
  test("Admin registers, logs in, fetches airports, and creates a route", async ({ request }) => {
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

    // Step 3: Fetch airport IDs
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
      await fetchAirport("LAX");

      // Step 4: Create flight route
    const routeData = {
        departureAirport_id: "JFK",
        arrivalAirport_id: "LAX",
        duration: "5h 30m",
      };
  
      const createRouteRes = await request.post("/api/routes/", {
        data: routeData,
        headers: { "auth-token": token },
      });
  
      const createRouteJson = await createRouteRes.json();
      console.log("Create Route Response:", createRouteJson);
  
      expect(createRouteRes.status()).toBe(201);
      expect(createRouteJson.error).toBeFalsy(); 
      expect(createRouteJson.departureAirport_id).toBe("JFK");
      expect(createRouteJson.arrivalAirport_id).toBe("LAX");
      expect(createRouteJson.duration).toBe("5h 30m");
  });
}
