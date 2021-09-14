const router = require("express").Router();
const Area = require("../models/Area");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const multerAzure = require("multer-azure");

const storage = multerAzure({
    connectionString: process.env.AZURE_CONN_STRING,
    account: process.env.AZURE_ACCOUNT,
    key: process.env.AZURE_KEY,
    container: "areas",
    blobPathResolver: function (req, file, cb) {
        const blobPath = crypto.randomUUID() + path.extname(file.originalname);
        console.log(file);
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
});

router.get("/", async (req, res) => {
    try {
        const areas = await Area.find({}, "-__v");

        res.status(200).json(areas.filter((area) => !area.isDeleted));
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
        if (type === "custom") {
            // AREA-210730 001
            const prefix = id.toUpperCase().substring(0, 11);
            const area_ctr = parseInt(id.toUpperCase().substring(11), 10);

            await Area.findOne({ prefix, area_ctr }, "-__v")
                .then((area) => {
                    if (area.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Area not found" });

                    res.status(200).json(area);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Area not found" })
                );
        } else {
            await Area.findById(id, "-__v")
                .then((area) => {
                    if (area.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Area not found" });

                    res.status(200).json(area);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Area not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", upload.single("imageURL"), async (req, res) => {
    const { description } = JSON.parse(req.body.payload);
    const imageURL = req.file.url;

    const area = new Area({
        description,
        imageURL,
    });

    try {
        const savedArea = await area.save();

        res.status(201).json(savedArea);
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.put("/:id", async (req, res) => {
    const { description, imageURL } = req.body;
    const { id } = req.params;

    try {
        await Area.findById(id)
            .then(async (area) => {
                if (area.isDeleted)
                    return res.status(404).json({ message: "Area not found" });

                const updatedArea = await Area.findByIdAndUpdate(id, {
                    $set: { description, imageURL },
                });

                res.status(200).json({
                    ...updatedArea._doc,
                    description,
                    imageURL,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Area not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Area.findById(id)
            .then(async (area) => {
                if (area.isDeleted)
                    return res.status(404).json({ message: "Area not found" });

                const deletedArea = await Area.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedArea._doc,
                    isDeleted: true,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Area not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Area.findById(id)
            .then(async (area) => {
                if (area.isDeleted)
                    return res.status(404).json({ message: "Area not found" });

                const deletedArea = await Area.findByIdAndDelete(id);

                res.status(200).json(deletedArea);
            })
            .catch((err) =>
                res.status(404).json({ message: "Area not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
