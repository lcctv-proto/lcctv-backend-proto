let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/applications", () => {
    let data = {
        remarks: "sample remark",
        accountID: "60eae1c90264ea46882ec4d4",
    };

    let new_remarks_payload = {
        remarks: "sample remark 2",
    };

    let new_account_payload = {
        accountID: "60eae1c90264ea46882ec4d4",
    };

    let new_status_payload = {
        status: "STATUS",
        step: 3,
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/applications/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.status).toBe("PENDING PAYMENT");
        expect(response.body.step).toBe(1);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(
            `/api/applications/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.status).toBe("PENDING PAYMENT");
        expect(response.body.step).toBe(1);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/applications/remarks/${data.created_id}`)
            .send(new_remarks_payload)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.status).toBe("PENDING PAYMENT");
        expect(response.body.step).toBe(1);
        expect(response.body.remarks).toBe(new_remarks_payload.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/applications/account/${data.created_id}`)
            .send(new_account_payload)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.status).toBe("PENDING PAYMENT");
        expect(response.body.step).toBe(1);
        expect(response.body.remarks).toBe(new_remarks_payload.remarks);
        expect(response.body.accountID).toBe(new_account_payload.accountID);
    });

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/applications/status/${data.created_id}`)
            .send(new_status_payload)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.status).toBe(new_status_payload.status);
        expect(response.body.step).toBe(new_status_payload.step);
        expect(response.body.remarks).toBe(new_remarks_payload.remarks);
        expect(response.body.accountID).toBe(new_account_payload.accountID);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/applications/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.date).toBe("2000-02-17T00:00:00.000Z");
        expect(response.body.status).toBe(new_status_payload.status);
        expect(response.body.step).toBe(new_status_payload.step);
        expect(response.body.remarks).toBe(new_remarks_payload.remarks);
        expect(response.body.accountID).toBe(new_account_payload.accountID);
    });
});
