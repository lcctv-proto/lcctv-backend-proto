let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/roles", () => {
    let data = {
        created_id: "",
        name: "ROLE-000",
        description: "SUPERADMIN",
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/roles/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/roles/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
    });

    data.name = "PLAN-001";
    data.description = "ADMIN";

    test("TEST /PUT (UDPATE)", async () => {
        const response = await request
            .put(`/api/roles/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/roles/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
    });
});
