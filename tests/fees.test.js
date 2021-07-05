let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/fees", () => {
    let data = {
        created_id: "",
        name: "FEE-001",
        description: "BASIC MONTHLY FEE",
        price: 640,
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/fees/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/fees/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });

    data.name = "FEE-002";
    data.description = "PREMIUM MONTHLY FEE";
    data.price = 790;

    test("TEST /PUT (UDPATE)", async () => {
        const response = await request
            .put(`/api/fees/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/fees/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });
});
