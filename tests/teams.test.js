let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/teams", () => {
    let data = {
        description: "A sample description",
        areaID: "60eae1c90264ea46882ec4d4",
        personnelIDs: ["60eae1c90264ea46882ec4d4", "60eae1c90264ea46882ec4d4"],
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/teams/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.description).toBe(data.description);
        expect(response.body.installations).toBe(0);
        expect(response.body.personnelIDs).toStrictEqual([]);
        expect(response.body.areaID).toBe(data.areaID);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/teams/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.installations).toBe(0);
        expect(response.body.personnelIDs).toStrictEqual([]);
        expect(response.body.areaID).toBe(data.areaID);
    });

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/teams/installations/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.installations).toBe(1);
        expect(response.body.personnelIDs).toStrictEqual([]);
        expect(response.body.areaID).toBe(data.areaID);
    });

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/teams/personnel/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.installations).toBe(1);
        expect(response.body.personnelIDs).toStrictEqual(data.personnelIDs);
        expect(response.body.areaID).toBe(data.areaID);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/teams/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.installations).toBe(1);
        expect(response.body.personnelIDs).toStrictEqual(data.personnelIDs);
        expect(response.body.areaID).toBe(data.areaID);
    });
});
