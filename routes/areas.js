const router = require("express").Router();
const Area = require("../models/Area");

router.get("/", async (req, res) => {
    try {
        const areas = await Area.find();
        res.status(200).json(areas.filter((area) => !area.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const area = await Area.findById(req.params.id);

        !area.isDeleted
            ? res.status(200).json(area)
            : res.status(404).json({ message: "Area not found" });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { name, description, imageURL } = req.body;

    const area = new Area({
        name: name,
        description: description,
        imageURL: imageURL,
        isDeleted: false,
    });

    try {
        const savedArea = await area.save();
        res.status(201).json(savedArea);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.put("/:id", async (req, res) => {
    const { name, description, imageURL } = req.body;

    try {
        const area = await Area.findById(req.params.id);

        if (area.isDeleted) res.status(404).json({ message: "Area not found" });

        const updatedArea = await Area.findByIdAndUpdate(req.params.id, {
            $set: { name: name, description: description, imageURL: imageURL },
        });

        updatedArea.name = name;
        updatedArea.description = description;
        updatedArea.imageURL = imageURL;

        res.status(200).json(updatedArea);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const area = await Area.findById(req.params.id);

        if (area.isDeleted) res.status(404).json({ message: "Area not found" });

        const deletedArea = await Area.findByIdAndUpdate(req.params.id, {
            $set: { isDeleted: true },
        });
        deletedArea.isDeleted = true;
        res.status(200).json(deletedArea);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedArea = await Area.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedArea);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
