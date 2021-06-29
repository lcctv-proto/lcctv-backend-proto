const router = require("express").Router();
const Channel = require("../models/Channel");

router.get("/", async (req, res) => {
    try {
        const channels = await Channel.find();
        res.status(200).json(channels.filter((channel) => !channel.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id);

        !channel.isDeleted
            ? res.status(200).json(channel)
            : res.status(404).json({ message: "Channel not found" });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const {
        name,
        description,
        assignedNumber,
        label,
        bannerImageURL,
        videoURL,
        channelImages,
    } = req.body;

    const channel = new Channel({
        name: name,
        description: description,
        assignedNumber: assignedNumber,
        label: label,
        bannerImageURL: bannerImageURL,
        videoURL: videoURL,
        channelImages: channelImages,
        isDeleted: false,
    });

    try {
        const savedChannel = await channel.save();
        res.status(201).json(savedChannel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/:id", (req, res) => {
    res.send(`EDIT PACKAGE WITH PACKAGE ID: ${req.params.id}`);
});

router.delete("/:id", async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id);

        if (channel.isDeleted)
            res.status(404).json({ message: "Channel not found" });

        const deletedChannel = await Channel.findByIdAndUpdate(req.params.id, {
            $set: { isDeleted: true },
        });
        deletedChannel.isDeleted = true;
        res.status(200).json(deletedChannel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
