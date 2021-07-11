let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/accounts", () => {
    let data = {
        accountName: {
            firstName: "Charles Edward",
            middleName: "Alalan",
            lastName: "Umali",
        },
        additionalInfo: {
            birthdate: "2000-02-17T00:00:00.000Z",
            nationality: "Filipino",
            gender: "Male",
            civilStatus: "Single",
        },
        serviceAddress: {
            unit: "5A",
            street: "J. Fajardo Street",
            barangay: "449",
            municipality: "Sampaloc",
            province: "NCR",
            zipCode: 1005,
            homeOwnership: "Rent",
            residencyYear: 3,
        },
        contactInfo: {
            cellphoneNumber: "09168930213",
            telephoneNumber: "222-8019",
            email: "vizcochogerard@yahoo.com",
            motherMaidenName: {
                firstName: "Claricelle",
                middleName: "Galvez",
                lastName: "Aguirre",
            },
            spouseName: {
                firstName: "",
                middleName: "",
                lastName: "",
            },
        },
        packageID: "176bf0524ecb4e1db48ff352",
        governmentIdImageURL: "example.com/id.png",
        billingImageURL: "example.com/billing.png",
    };
    let new_payload = {
        accountName: {
            firstName: "Gerard Dominic",
            middleName: "Aguirre",
            lastName: "Vizcocho",
        },
        additionalInfo: {
            birthdate: "2000-02-17T00:00:00.000Z",
            nationality: "Filipino",
            gender: "Male",
            civilStatus: "Single",
        },
        contactInfo: {
            cellphoneNumber: "09168930213",
            telephoneNumber: "222-8019",
            email: "vizcochopogi@gmail.com",
            motherMaidenName: {
                firstName: "Claricelle",
                middleName: "Galvez",
                lastName: "Aguirre",
            },
            spouseName: {
                firstName: "",
                middleName: "",
                lastName: "",
            },
        },
    };
    let new_address_payload = {
        serviceAddress: {
            unit: "763",
            street: "Carola Street",
            barangay: "455",
            municipality: "Sampaloc",
            province: "NCR",
            zipCode: 1008,
            homeOwnership: "Rent",
            residencyYear: 3,
        },
    };
    let new_package = { packageID: "2176bf0524ecb4e1db48ff35" };

    let new_status = { accountStatus: "ACTIVE" };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/accounts/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.accountName).toStrictEqual(data.accountName);
        expect(response.body.additionalInfo).toStrictEqual(data.additionalInfo);
        expect(response.body.serviceAddress).toStrictEqual(data.serviceAddress);
        expect(response.body.contactInfo).toStrictEqual(data.contactInfo);
        expect(response.body.packageID).toBe(data.packageID);
        expect(response.body.governmentIdImageURL).toBe(
            data.governmentIdImageURL
        );
        expect(response.body.billingImageURL).toBe(data.billingImageURL);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/accounts/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.accountName).toStrictEqual(data.accountName);
        expect(response.body.additionalInfo).toStrictEqual(data.additionalInfo);
        expect(response.body.serviceAddress).toStrictEqual(data.serviceAddress);
        expect(response.body.contactInfo).toStrictEqual(data.contactInfo);
        expect(response.body.packageID).toBe(data.packageID);
        expect(response.body.accountStatus).toBe("PENDING");
        expect(response.body.governmentIdImageURL).toBe(
            data.governmentIdImageURL
        );
        expect(response.body.billingImageURL).toBe(data.billingImageURL);
    });

    test("TEST /PUT (UDPATE)", async () => {
        const response = await request
            .put(`/api/accounts/${data.created_id}`)
            .send(new_payload)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.accountName).toStrictEqual(
            new_payload.accountName
        );
        expect(response.body.additionalInfo).toStrictEqual(
            new_payload.additionalInfo
        );
        expect(response.body.serviceAddress).toStrictEqual(data.serviceAddress);
        expect(response.body.contactInfo).toStrictEqual(
            new_payload.contactInfo
        );
        expect(response.body.packageID).toBe(data.packageID);
        expect(response.body.accountStatus).toBe("PENDING");
        expect(response.body.governmentIdImageURL).toBe(
            data.governmentIdImageURL
        );
        expect(response.body.billingImageURL).toBe(data.billingImageURL);
    });

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/accounts/address/${data.created_id}`)
            .send(new_address_payload)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.accountName).toStrictEqual(
            new_payload.accountName
        );
        expect(response.body.additionalInfo).toStrictEqual(
            new_payload.additionalInfo
        );
        expect(response.body.serviceAddress).toStrictEqual(
            new_address_payload.serviceAddress
        );
        expect(response.body.contactInfo).toStrictEqual(
            new_payload.contactInfo
        );
        expect(response.body.packageID).toBe(data.packageID);
        expect(response.body.accountStatus).toBe("PENDING");
        expect(response.body.governmentIdImageURL).toBe(
            data.governmentIdImageURL
        );
        expect(response.body.billingImageURL).toBe(data.billingImageURL);
    });

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/accounts/package/${data.created_id}`)
            .send(new_package)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.accountName).toStrictEqual(
            new_payload.accountName
        );
        expect(response.body.additionalInfo).toStrictEqual(
            new_payload.additionalInfo
        );
        expect(response.body.serviceAddress).toStrictEqual(
            new_address_payload.serviceAddress
        );
        expect(response.body.contactInfo).toStrictEqual(
            new_payload.contactInfo
        );
        expect(response.body.packageID).toBe(new_package.packageID);
        expect(response.body.accountStatus).toBe("PENDING");
        expect(response.body.governmentIdImageURL).toBe(
            data.governmentIdImageURL
        );
        expect(response.body.billingImageURL).toBe(data.billingImageURL);
    });

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/accounts/status/${data.created_id}`)
            .send(new_status)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.accountName).toStrictEqual(
            new_payload.accountName
        );
        expect(response.body.additionalInfo).toStrictEqual(
            new_payload.additionalInfo
        );
        expect(response.body.serviceAddress).toStrictEqual(
            new_address_payload.serviceAddress
        );
        expect(response.body.contactInfo).toStrictEqual(
            new_payload.contactInfo
        );
        expect(response.body.packageID).toBe(new_package.packageID);
        expect(response.body.accountStatus).toBe(new_status.accountStatus);
        expect(response.body.governmentIdImageURL).toBe(
            data.governmentIdImageURL
        );
        expect(response.body.billingImageURL).toBe(data.billingImageURL);
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/accounts/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.accountName).toStrictEqual(
            new_payload.accountName
        );
        expect(response.body.additionalInfo).toStrictEqual(
            new_payload.additionalInfo
        );
        expect(response.body.serviceAddress).toStrictEqual(
            new_address_payload.serviceAddress
        );
        expect(response.body.contactInfo).toStrictEqual(
            new_payload.contactInfo
        );
        expect(response.body.packageID).toBe(new_package.packageID);
        expect(response.body.accountStatus).toBe(new_status.accountStatus);
        expect(response.body.governmentIdImageURL).toBe(
            data.governmentIdImageURL
        );
        expect(response.body.billingImageURL).toBe(data.billingImageURL);
    });
});
