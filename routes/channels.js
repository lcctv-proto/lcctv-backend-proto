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

        if (channel.isDeleted)
            return res.status(404).json({ message: "Channel not found" });

        res.status(200).json(channel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.get("/packages/:id", async (req, res) => {
    try {
        const channels = await Channel.find();
        res.status(200).json(
            channels.filter((channel) =>
                channel.packages.includes(req.params.id)
            )
        );
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const {
        description,
        assignedNumber,
        label,
        bannerImageURL,
        videoURL,
        channelImages,
        packages,
    } = req.body;

    const channel = new Channel({
        prefix: "CHA",
        description: description,
        assignedNumber: assignedNumber,
        label: label,
        bannerImageURL: bannerImageURL,
        videoURL: videoURL,
        channelImages: channelImages,
        packages: packages,
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

router.put("/:id", async (req, res) => {
    const {
        description,
        assignedNumber,
        label,
        bannerImageURL,
        videoURL,
        channelImages,
    } = req.body;

    try {
        const channel = await Channel.findById(req.params.id);

        if (channel.isDeleted)
            return res.status(404).json({ message: "Channel not found" });

        const updatedChannel = await Channel.findByIdAndUpdate(req.params.id, {
            $set: {
                description: description,
                assignedNumber: assignedNumber,
                label: label,
                bannerImageURL: bannerImageURL,
                videoURL: videoURL,
                channelImages: channelImages,
            },
        });

        updatedChannel.description = description;
        updatedChannel.assignedNumber = assignedNumber;
        updatedChannel.label = label;
        updatedChannel.bannerImageURL = bannerImageURL;
        updatedChannel.videoURL = videoURL;
        updatedChannel.channelImages = channelImages;
        updatedChannel.isDeleted = false;
        res.status(200).json(updatedChannel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/:id", async (req, res) => {
    const { packages } = req.body;
    try {
        const channel = await Channel.findById(req.params.id);

        if (channel.isDeleted)
            return res.status(404).json({ message: "Channel not found" });

        const updatedChannel = await Channel.findByIdAndUpdate(req.params.id, {
            $set: { packages: packages },
        });
        updatedChannel.packages = packages;
        res.status(200).json(updatedChannel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id);

        if (channel.isDeleted)
            return res.status(404).json({ message: "Channel not found" });

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

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedChannel = await Channel.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedChannel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
