let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/equipments", () => {
    let data = {
        created_id: "",
        label: "CABLE TIES",
        description: "BLACK CABLE TIES",
        price: 150,
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/equipments/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.label).toBe(data.label);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(
            `/api/equipments/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.label).toBe(data.label);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });

    data.label = "CABLE TIE";
    data.description = "GREEN CABLE TIE";
    data.price = 200;

    test("TEST /PUT (UDPATE)", async () => {
        const response = await request
            .put(`/api/equipments/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.label).toBe(data.label);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/equipments/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.label).toBe(data.label);
        expect(response.body.description).toBe(data.description);
        expect(response.body.price).toBe(data.price);
    });
});
