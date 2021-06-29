const router = require("express").Router();
const Package = require("../models/Package");

router.get("/", async (req, res) => {
    try {
        const packages = await Package.find();
        res.status(200).json(packages.filter((package) => !package.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const package = await Packages.findById(req.params.id);

        !package.isDeleted
            ? res.status(200).json(package)
            : res.status(404).json({ message: "Package not found" });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { name, description, price } = req.body;

    const package = new Package({
        name: name,
        description: description,
        price: price,
        channels: [],
        isDeleted: false,
    });

    try {
        const savedPackage = await package.save();
        res.status(201).json(savedPackage);
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
        const package = await Package.findById(req.params.id);

        if (package.isDeleted)
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

module.exports = router;
