const router = require("express").Router();
const Channel = require("../models/Channel");
const Package = require("../models/Package");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const multerAzure = require("multer-azure");
const auth = require("../auth/auth");

const storage = multerAzure({
    connectionString: process.env.AZURE_CONN_STRING,
    account: process.env.AZURE_ACCOUNT,
    key: process.env.AZURE_KEY,
    container: "channels",
    blobPathResolver: function (req, file, cb) {
        const blobPath = crypto.randomUUID() + path.extname(file.originalname);
        cb(null, blobPath);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Wrong File Type"), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: "2mb",
    },
    fileFilter,
}).fields([
    { name: "bannerImageURL", maxCount: 1 },
    { name: "channelImage1URL", maxCount: 1 },
    { name: "channelImage2URL", maxCount: 1 },
    { name: "channelImage3URL", maxCount: 1 },
]);

router.get("/", async (req, res) => {
    try {
        const channels = await Channel.find({}, "-__v").populate(
            "packages",
            "-__v"
        );
        res.status(200).json(channels.filter((channel) => !channel.isDeleted));
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;

    try {
        // CHA-210730 002
        const prefix = id.toUpperCase().substring(0, 10);
        const cha_ctr = parseInt(id.toUpperCase().substring(10), 10);

        if (type === "custom") {
            await Channel.findOne({ prefix, cha_ctr })
                .populate("packages", "-isDeleted -__v")
                .then((channel) => {
                    if (channel.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Channel not found" });

                    res.status(200).json(channel);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Channel not found" })
                );
        } else {
            await Channel.findById(id)
                .populate("packages", "-isDeleted -__v")
                .then((channel) => {
                    if (channel.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Channel not found" });

                    res.status(200).json(channel);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Channel not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.get("/packages/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Package.findById(id)
            .then(async (pkg) => {
                if (pkg.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Package not found" });

                const channels = await Channel.find({}, "-__v").populate(
                    "packages",
                    "-__v"
                );

                res.status(200).json(
                    channels.filter((channel) => channel.packages.includes(id))
                );
            })
            .catch((err) => {
                return res.status(404).json({ message: "Package not found" });
            });
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", upload, auth, async (req, res) => {
    const { description, assignedNumber, label, videoURL, packages, isHD } =
        JSON.parse(req.body.payload);

    const bannerImageURL = req.files.bannerImageURL[0].url;
    const channelImages = [
        req.files.channelImage1URL[0].url,
        req.files.channelImage2URL[0].url,
        req.files.channelImage3URL[0].url,
    ];

    const channel = new Channel({
        description,
        assignedNumber,
        label,
        bannerImageURL,
        videoURL,
        channelImages,
        packages,
        isHD,
    });

    try {
        const savedChannel = await channel.save();

        res.status(201).json(savedChannel);
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.put("/:id", auth, async (req, res) => {
    const {
        description,
        assignedNumber,
        label,
        bannerImageURL,
        videoURL,
        channelImages,
    } = req.body;
    const { id } = req.params;

    try {
        await Channel.findById(id)
            .then(async (channel) => {
                if (channel.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Channel not found" });

                const updatedChannel = await Channel.findByIdAndUpdate(id, {
                    $set: {
                        description,
                        assignedNumber,
                        label,
                        bannerImageURL,
                        videoURL,
                        channelImages,
                    },
                });

                res.status(200).json({
                    ...updatedChannel._doc,
                    description,
                    assignedNumber,
                    label,
                    bannerImageURL,
                    videoURL,
                    channelImages,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Channel not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/packages/:id", auth, async (req, res) => {
    const { packages } = req.body;
    const { id } = req.params;

    try {
        await Channel.findById(id)
            .then(async (channel) => {
                if (channel.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Channel not found" });

                const updatedChannel = await Channel.findByIdAndUpdate(id, {
                    $set: { packages },
                });

                res.status(200).json({
                    ...updatedChannel._doc,
                    packages,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Channel not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        await Channel.findById(id)
            .then(async (channel) => {
                if (channel.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Channel not found" });

                const deletedChannel = await Channel.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: { isDeleted: true },
                    }
                );

                res.status(200).json({
                    ...deletedChannel._doc,
                    isDeleted: true,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Channel not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        await Channel.findById(id)
            .then(async (channel) => {
                if (channel.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Channel not found" });

                const deletedChannel = await Channel.findByIdAndDelete(id);
                res.status(200).json(deletedChannel);
            })
            .catch((err) =>
                res.status(404).json({ message: "Channel not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
