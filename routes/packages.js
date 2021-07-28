const router = require("express").Router();
const Package = require("../models/Package");

router.get("/", async (req, res) => {
    try {
        const packages = await Package.find();
        res.status(200).json(packages.filter((pack) => !pack.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const pack = await Package.findById(req.params.id);

        !pack.isDeleted
            ? res.status(200).json(pack)
            : res.status(404).json({ message: "Package not found" });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { description, price } = req.body;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    const prefix = `PKG-${yyyy}${mm}${dd}`;

    const pack = new Package({
        prefix: prefix,
        description: description,
        price: price,
        isDeleted: false,
    });

    try {
        const savedPackage = await pack.save();
        res.status(201).json(savedPackage);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.put("/:id", async (req, res) => {
    const { description, price } = req.body;

    try {
        const pack = await Package.findById(req.params.id);

        if (pack.isDeleted)
            res.status(404).json({ message: "Package not found" });

        const updatedPackage = await Package.findByIdAndUpdate(req.params.id, {
            $set: { description: description, price: price },
        });

        updatedPackage.description = description;
        updatedPackage.price = price;

        res.status(200).json(updatedPackage);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const pack = await Package.findById(req.params.id);

        if (pack.isDeleted)
            res.status(404).json({ message: "Package not found" });

        const deletedPackage = await Package.findByIdAndUpdate(req.params.id, {
            $set: { isDeleted: true },
        });
        deletedPackage.isDeleted = true;
        res.status(200).json(deletedPackage);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedPackage);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
