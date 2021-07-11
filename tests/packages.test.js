let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/packages", () => {
    let data = {
        created_id: "",
        description: "PREMIUM 790",
        price: 790,
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/packages/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/packages/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });

    data.description = "INTERNATIONAL 1099";
    data.price = 1099;

    test("TEST /PUT (UDPATE)", async () => {
        const response = await request
            .put(`/api/packages/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/packages/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });
});
