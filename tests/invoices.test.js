let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/invoices", () => {
    let data = {
        amountDue: 640,
        accountID: "60eae1c90264ea46882ec4d4",
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/invoices/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.amountDue).toBe(data.amountDue);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/invoices/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.amountDue).toBe(data.amountDue);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/invoices/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.amountDue).toBe(data.amountDue);
        expect(response.body.accountID).toBe(data.accountID);
    });
});
