let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/inquiries", () => {
    let data = {
        contactNumber: "09168930213",
        email: "vizcochogerard@yahoo.com",
        type: "FOLLOW UP NEW INSTALLATION",
        description: "It's been 83 years",
        accountID: "60eae1c90264ea46882ec4d4",
    };

    let new_status_payload = {
        status: "DENIED",
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/inquiries/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.status).toBe("PENDING");
        expect(response.body.contactNumber).toBe(data.contactNumber);
        expect(response.body.email).toBe(data.email);
        expect(response.body.type).toBe(data.type);
        expect(response.body.description).toBe(data.description);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/inquiries/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.status).toBe("PENDING");
        expect(response.body.contactNumber).toBe(data.contactNumber);
        expect(response.body.email).toBe(data.email);
        expect(response.body.type).toBe(data.type);
        expect(response.body.description).toBe(data.description);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/inquiries/status/${data.created_id}`)
            .send(new_status_payload)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.status).toBe(new_status_payload.status);
        expect(response.body.contactNumber).toBe(data.contactNumber);
        expect(response.body.email).toBe(data.email);
        expect(response.body.type).toBe(data.type);
        expect(response.body.description).toBe(data.description);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/inquiries/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.status).toBe(new_status_payload.status);
        expect(response.body.contactNumber).toBe(data.contactNumber);
        expect(response.body.email).toBe(data.email);
        expect(response.body.type).toBe(data.type);
        expect(response.body.description).toBe(data.description);
        expect(response.body.accountID).toBe(data.accountID);
    });
});
