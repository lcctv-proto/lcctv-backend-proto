let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/areas", () => {
    let data = {
        created_id: "",
        name: "AREA-001",
        description: "VICTORIA",
        imageURL: "example.com/area1.png",
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/areas/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
        expect(response.body.imageURL).toBe(data.imageURL);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/areas/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
        expect(response.body.imageURL).toBe(data.imageURL);
    });

    data.name = "AREA-002";
    data.description = "BAUTISTA";
    data.imageURL = "example.com/area2.png";

    test("TEST /PUT (UDPATE)", async () => {
        const response = await request
            .put(`/api/areas/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
        expect(response.body.imageURL).toBe(data.imageURL);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/areas/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
        expect(response.body.imageURL).toBe(data.imageURL);
    });
});
