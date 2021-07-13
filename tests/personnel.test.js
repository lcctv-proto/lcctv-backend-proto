let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/personnel", () => {
    let data = {
        personnelName: {
            firstName: "Gerard Dominic",
            middleName: "Aguirre",
            lastName: "Vizcocho",
        },
        username: "admin",
        password: "12345678",
        roleID: "60eae1c90264ea46882ec4d4",
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/personnel/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.personnelName).toStrictEqual(data.personnelName);
        expect(response.body.username).toBe("");
        expect(response.body.password).toBe("");
        expect(response.body.roleID).toBe(data.roleID);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/personnel/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.personnelName).toStrictEqual(data.personnelName);
        expect(response.body.username).toBe("");
        expect(response.body.password).toBe("");
        expect(response.body.roleID).toBe(data.roleID);
    });

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/personnel/register/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.personnelName).toStrictEqual(data.personnelName);
        expect(response.body.username).toBe(data.username);
        expect(response.body.password).toBe(data.password);
        expect(response.body.roleID).toBe(data.roleID);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/personnel/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.personnelName).toStrictEqual(data.personnelName);
        expect(response.body.username).toBe(data.username);
        expect(response.body.password).toBe(data.password);
        expect(response.body.roleID).toBe(data.roleID);
    });
});
