let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD (INSTALLATIONS) for /api/jo", () => {
    let data = {
        jobDate: "2000-02-17T00:00:00.000Z",
        status: "ONGOING",
        type: "INSTALLATION",
        branch: "BRANCH 1",
        remarks: "",
        equipmentsUsed: [
            { equipmentID: "60eae1c90264ea46882ec4d4", quantity: 10 },
            { equipmentID: "60eae1c90264ea46882ec4d5", quantity: 5 },
            { equipmentID: "60eae1c90264ea46882ec4d6", quantity: 9 },
            { equipmentID: "60eae1c90264ea46882ec4d7", quantity: 2 },
        ],
        inquiryID: "",
        applicationID: "60eae1c90264ea46882ec4d4",
        accountID: "60eae1c90264ea46882ec4d4",
        teamID: "60eae1c90264ea46882ec4d4",
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/jo/installation")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.type).toBe(data.type);
        expect(response.body.applicationID).toBe(data.applicationID);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /PATCH (CREATE)", async () => {
        const response = await request
            .patch(`/api/jo/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;
        expect(response.statusCode).toBe(200);
        expect(response.body.jobDate).toBe(data.jobDate);
        expect(response.body.status).toBe(data.status);
        expect(response.body.type).toBe(data.type);
        expect(response.body.branch).toBe(data.branch);
        expect(response.body.applicationID).toBe(data.applicationID);
        expect(response.body.accountID).toBe(data.accountID);
        expect(response.body.teamID).toBe(data.teamID);
    });

    test("TEST /PATCH (CREATE)", async () => {
        const response = await request
            .patch(`/api/jo/equipments/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;
        expect(response.statusCode).toBe(200);
        expect(response.body.jobDate).toBe(data.jobDate);
        expect(response.body.status).toBe(data.status);
        expect(response.body.type).toBe(data.type);
        expect(response.body.branch).toBe(data.branch);
        expect(response.body.equipmentsUsed).toStrictEqual(data.equipmentsUsed);
        expect(response.body.applicationID).toBe(data.applicationID);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/jo/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.jobDate).toBe(data.jobDate);
        expect(response.body.status).toBe(data.status);
        expect(response.body.type).toBe(data.type);
        expect(response.body.branch).toBe(data.branch);
        expect(response.body.equipmentsUsed).toStrictEqual(data.equipmentsUsed);
        expect(response.body.applicationID).toBe(data.applicationID);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/jo/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.jobDate).toBe(data.jobDate);
        expect(response.body.status).toBe(data.status);
        expect(response.body.type).toBe(data.type);
        expect(response.body.branch).toBe(data.branch);
        expect(response.body.equipmentsUsed).toStrictEqual(data.equipmentsUsed);
        expect(response.body.applicationID).toBe(data.applicationID);
        expect(response.body.accountID).toBe(data.accountID);
    });
});

describe("TEST CRUD (MAINTENANCE) for /api/jo", () => {
    let data = {
        jobDate: "2000-02-17T00:00:00.000Z",
        status: "ONGOING",
        type: "INSTALLATION",
        branch: "BRANCH 1",
        remarks: "",
        equipmentsUsed: [
            { equipmentID: "60eae1c90264ea46882ec4d4", quantity: 10 },
            { equipmentID: "60eae1c90264ea46882ec4d5", quantity: 5 },
            { equipmentID: "60eae1c90264ea46882ec4d6", quantity: 9 },
            { equipmentID: "60eae1c90264ea46882ec4d7", quantity: 2 },
        ],
        inquiryID: "60eae1c90264ea46882ec4d4",
        applicationID: "",
        accountID: "60eae1c90264ea46882ec4d4",
        teamID: "60eae1c90264ea46882ec4d4",
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/jo/maintenance")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.type).toBe(data.type);
        expect(response.body.inquiryID).toBe(data.inquiryID);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /PATCH (CREATE)", async () => {
        const response = await request
            .patch(`/api/jo/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;
        expect(response.statusCode).toBe(200);
        expect(response.body.jobDate).toBe(data.jobDate);
        expect(response.body.status).toBe(data.status);
        expect(response.body.type).toBe(data.type);
        expect(response.body.branch).toBe(data.branch);
        expect(response.body.inquiryID).toBe(data.inquiryID);
        expect(response.body.accountID).toBe(data.accountID);
        expect(response.body.teamID).toBe(data.teamID);
    });

    test("TEST /PATCH (CREATE)", async () => {
        const response = await request
            .patch(`/api/jo/equipments/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;
        expect(response.statusCode).toBe(200);
        expect(response.body.jobDate).toBe(data.jobDate);
        expect(response.body.status).toBe(data.status);
        expect(response.body.type).toBe(data.type);
        expect(response.body.branch).toBe(data.branch);
        expect(response.body.equipmentsUsed).toStrictEqual(data.equipmentsUsed);
        expect(response.body.inquiryID).toBe(data.inquiryID);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/jo/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.jobDate).toBe(data.jobDate);
        expect(response.body.status).toBe(data.status);
        expect(response.body.type).toBe(data.type);
        expect(response.body.branch).toBe(data.branch);
        expect(response.body.equipmentsUsed).toStrictEqual(data.equipmentsUsed);
        expect(response.body.inquiryID).toBe(data.inquiryID);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/jo/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.jobDate).toBe(data.jobDate);
        expect(response.body.status).toBe(data.status);
        expect(response.body.type).toBe(data.type);
        expect(response.body.branch).toBe(data.branch);
        expect(response.body.equipmentsUsed).toStrictEqual(data.equipmentsUsed);
        expect(response.body.inquiryID).toBe(data.inquiryID);
        expect(response.body.accountID).toBe(data.accountID);
    });
});
