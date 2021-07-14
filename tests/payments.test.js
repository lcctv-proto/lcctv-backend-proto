let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD (CASH) for /api/payments", () => {
    let data = {
        feeIDs: [
            "60eae1c90264ea46882ec4d4",
            "60eae1c90264ea46882ec4d4",
            "60eae1c90264ea46882ec4d4",
        ],
        amountPaid: 640,
        receiptNumber: "20180135469",
        modeOfPayment: "CASH",
        remarks: "",
        accountID: "60eae1c90264ea46882ec4d4",
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/payments/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.feeIDs).toStrictEqual(data.feeIDs);
        expect(response.body.amountPaid).toBe(data.amountPaid);
        expect(response.body.receiptNumber).toBe(data.receiptNumber);
        expect(response.body.modeOfPayment).toBe(data.modeOfPayment);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/payments/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.feeIDs).toStrictEqual(data.feeIDs);
        expect(response.body.amountPaid).toBe(data.amountPaid);
        expect(response.body.receiptNumber).toBe(data.receiptNumber);
        expect(response.body.modeOfPayment).toBe(data.modeOfPayment);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/payments/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.feeIDs).toStrictEqual(data.feeIDs);
        expect(response.body.amountPaid).toBe(data.amountPaid);
        expect(response.body.receiptNumber).toBe(data.receiptNumber);
        expect(response.body.modeOfPayment).toBe(data.modeOfPayment);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });
});

describe("TEST CRUD (CHECK) for /api/payments", () => {
    let data = {
        feeIDs: [
            "60eae1c90264ea46882ec4d4",
            "60eae1c90264ea46882ec4d4",
            "60eae1c90264ea46882ec4d4",
        ],
        amountPaid: 1099,
        dateIssued: "2000-02-17T00:00:00.000Z",
        receiptNumber: "20180135468",
        modeOfPayment: "CHECK",
        issuingBank: "BDO",
        checkNumber: "2018919231702",
        checkAmount: 1100,
        remarks: "",
        accountID: "60eae1c90264ea46882ec4d4",
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/payments/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.feeIDs).toStrictEqual(data.feeIDs);
        expect(response.body.amountPaid).toBe(data.amountPaid);
        expect(response.body.dateIssued).toBe(data.dateIssued);
        expect(response.body.receiptNumber).toBe(data.receiptNumber);
        expect(response.body.modeOfPayment).toBe(data.modeOfPayment);
        expect(response.body.issuingBank).toBe(data.issuingBank);
        expect(response.body.checkNumber).toBe(data.checkNumber);
        expect(response.body.checkAmount).toBe(data.checkAmount);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/payments/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.feeIDs).toStrictEqual(data.feeIDs);
        expect(response.body.amountPaid).toBe(data.amountPaid);
        expect(response.body.dateIssued).toBe(data.dateIssued);
        expect(response.body.receiptNumber).toBe(data.receiptNumber);
        expect(response.body.modeOfPayment).toBe(data.modeOfPayment);
        expect(response.body.issuingBank).toBe(data.issuingBank);
        expect(response.body.checkNumber).toBe(data.checkNumber);
        expect(response.body.checkAmount).toBe(data.checkAmount);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/payments/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.feeIDs).toStrictEqual(data.feeIDs);
        expect(response.body.amountPaid).toBe(data.amountPaid);
        expect(response.body.dateIssued).toBe(data.dateIssued);
        expect(response.body.receiptNumber).toBe(data.receiptNumber);
        expect(response.body.modeOfPayment).toBe(data.modeOfPayment);
        expect(response.body.issuingBank).toBe(data.issuingBank);
        expect(response.body.checkNumber).toBe(data.checkNumber);
        expect(response.body.checkAmount).toBe(data.checkAmount);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });
});

describe("TEST CRUD (PORTAL) for /api/payments", () => {
    let data = {
        feeIDs: [
            "60eae1c90264ea46882ec4d4",
            "60eae1c90264ea46882ec4d4",
            "60eae1c90264ea46882ec4d4",
        ],
        amountPaid: 1100,
        dateIssued: "2000-02-17T00:00:00.000Z",
        referenceNumber: "20180235468",
        modeOfPayment: "GCash",
        remarks: "",
        accountID: "60eae1c90264ea46882ec4d4",
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/payments/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.feeIDs).toStrictEqual(data.feeIDs);
        expect(response.body.amountPaid).toBe(data.amountPaid);
        expect(response.body.dateIssued).toBe(data.dateIssued);
        expect(response.body.referenceNumber).toBe(data.referenceNumber);
        expect(response.body.modeOfPayment).toBe(data.modeOfPayment);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/payments/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.feeIDs).toStrictEqual(data.feeIDs);
        expect(response.body.amountPaid).toBe(data.amountPaid);
        expect(response.body.dateIssued).toBe(data.dateIssued);
        expect(response.body.referenceNumber).toBe(data.referenceNumber);
        expect(response.body.modeOfPayment).toBe(data.modeOfPayment);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/payments/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.feeIDs).toStrictEqual(data.feeIDs);
        expect(response.body.amountPaid).toBe(data.amountPaid);
        expect(response.body.dateIssued).toBe(data.dateIssued);
        expect(response.body.referenceNumber).toBe(data.referenceNumber);
        expect(response.body.modeOfPayment).toBe(data.modeOfPayment);
        expect(response.body.remarks).toBe(data.remarks);
        expect(response.body.accountID).toBe(data.accountID);
    });
});
