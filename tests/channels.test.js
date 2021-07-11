let request = require("supertest");
require("dotenv").config();
request = request(`http://localhost:${process.env.PORT}`);

describe("TEST CRUD for /api/channels", () => {
    let data = {
        description: "CARTOON NETWORK",
        assignedNumber: "37",
        label: "Cartoon Network is the leading kids’ brand in the Philippines. Its dedicated Philippine channel offers the best in original animated content including the multi-award-winning global hits Regular Show, The Amazing World of Gumball and Adventure Time. Cartoon Network is available in 31 countries throughout Asia Pacific and is currently seen in more than 85 million pay-TV homes. Online, Cartoon Network reaches nearly three million unique visitors a month in the region. In Asia Pacific, Cartoon Network is created and distributed by Turner Broadcasting System Asia Pacific, Inc., a Time Warner company.",
        bannerImageURL: "example.com/cartoon_network/banner_image.png",
        videoURL: "example.com/cartoon_network/video.mp4",
        channelImages: [
            "example.com/cartoon_network/image1.png",
            "example.com/cartoon_network/image2.png",
            "example.com/cartoon_network/image3.png",
        ],
        packages: [],
    };

    test("TEST /POST (CREATE)", async () => {
        const response = await request
            .post("/api/channels/")
            .send(data)
            .set("Accept", "application/json");

        data.created_id = response.body._id;

        expect(response.statusCode).toBe(201);
        expect(response.body.description).toBe(data.description);
        expect(response.body.assignedNumber).toBe(data.assignedNumber);
        expect(response.body.label).toBe(data.label);
        expect(response.body.bannerImageURL).toBe(data.bannerImageURL);
        expect(response.body.videoURL).toBe(data.videoURL);
        expect(response.body.channelImages).toStrictEqual(data.channelImages);
        expect(response.body.packages).toStrictEqual(data.packages);
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/channels/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.assignedNumber).toBe(data.assignedNumber);
        expect(response.body.label).toBe(data.label);
        expect(response.body.bannerImageURL).toBe(data.bannerImageURL);
        expect(response.body.videoURL).toBe(data.videoURL);
        expect(response.body.channelImages).toStrictEqual(data.channelImages);
        expect(response.body.packages).toStrictEqual(data.packages);
    });

    data = {
        description: "KAPAMILYA CHANNEL",
        assignedNumber: "22",
        label: "Kapamilya Channel (lit. 'Family Channel', stylized as Kapamilya channel) is a 24-hour Philippine pay television network owned and operated by ABS-CBN Corporation, a company under the Lopez Group. The network is headquartered at the ABS-CBN Broadcasting Center in Quezon City where it started broadcasting on June 13, 2020 at 5:30 a.m. with Kapamilya Daily Mass as its first program also marking its parent company's 74th anniversary. A separate high definition 1080i resolution channel began broadcasting the same day. The network serves as the replacement of the main terrestrial ABS-CBN network after ceasing its free-to-air broadcast operations as ordered by the National Telecommunications Commission (NTC) on May 5, 2020 due to the expiration of its legislative franchise. It carries most of programs that ABS-CBN aired prior to the shutdown. Its studios are located at the ABS-CBN Broadcasting Center, Sergeant Esguerra Avenue, Barangay South Triangle, Diliman, Quezon City.",
        bannerImageURL: "example.com/kapamilya_channel/banner_image.png",
        videoURL: "example.com/kapamilya_channel/video.mp4",
        channelImages: [
            "example.com/kapamilya_channel/image1.png",
            "example.com/kapamilya_channel/image2.png",
            "example.com/kapamilya_channel/image3.png",
        ],
        packages: [],
    };

    test("TEST /PUT (UDPATE)", async () => {
        const response = await request
            .put(`/api/channels/${data.created_id}`)
            .send(data)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.assignedNumber).toBe(data.assignedNumber);
        expect(response.body.label).toBe(data.label);
        expect(response.body.bannerImageURL).toBe(data.bannerImageURL);
        expect(response.body.videoURL).toBe(data.videoURL);
        expect(response.body.channelImages).toStrictEqual(data.channelImages);
        expect(response.body.packages).toStrictEqual(data.packages);
    });

    let new_packages_payload = {
        packages: ["60eae1c90264ea46882ec4d4"],
    };

    test("TEST /PATCH (UDPATE)", async () => {
        const response = await request
            .patch(`/api/channels/${data.created_id}`)
            .send(new_packages_payload)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.assignedNumber).toBe(data.assignedNumber);
        expect(response.body.label).toBe(data.label);
        expect(response.body.bannerImageURL).toBe(data.bannerImageURL);
        expect(response.body.videoURL).toBe(data.videoURL);
        expect(response.body.channelImages).toStrictEqual(data.channelImages);
        expect(response.body.packages).toStrictEqual(
            new_packages_payload.packages
        );
    });

    test("TEST /GET (READ)", async () => {
        const response = await request.get(`/api/channels/${data.created_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.assignedNumber).toBe(data.assignedNumber);
        expect(response.body.label).toBe(data.label);
        expect(response.body.bannerImageURL).toBe(data.bannerImageURL);
        expect(response.body.videoURL).toBe(data.videoURL);
        expect(response.body.channelImages).toStrictEqual(data.channelImages);
        expect(response.body.packages).toStrictEqual(
            new_packages_payload.packages
        );
    });

    test("TEST /DELETE (DELETE)", async () => {
        const response = await request.delete(
            `/api/channels/hard/${data.created_id}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.description).toBe(data.description);
        expect(response.body.assignedNumber).toBe(data.assignedNumber);
        expect(response.body.label).toBe(data.label);
        expect(response.body.bannerImageURL).toBe(data.bannerImageURL);
        expect(response.body.videoURL).toBe(data.videoURL);
        expect(response.body.channelImages).toStrictEqual(data.channelImages);
        expect(response.body.packages).toStrictEqual(
            new_packages_payload.packages
        );
    });
});
